/* eslint-disable no-restricted-globals */
import { transform } from '@babel/standalone';

// 转换JSX代码的函数
const transformCode = (code) => {
  try {
    // 检测是否包含d3相关代码
    const hasD3 = code.includes('d3.') || code.includes('* as d3') || code.includes('from "d3"') || code.includes("from 'd3'");
    
    // 检测是否包含React Hooks
    const hasHooks = code.includes('useState') || 
                     code.includes('useEffect') || 
                     code.includes('useRef') ||
                     code.includes('useContext');
    
    // 转换代码
    const result = transform(code, {
      presets: ['react'],
      plugins: [
        // 处理本地模块导入的自定义插件
        localModuleResolverPlugin
      ]
    });
    
    let transformedCode = result.code;
    
    // 处理React导入
    transformedCode = transformedCode.replace(
      /import\s+React\s*,\s*{\s*([^}]+)\s*}\s*from\s+['"]react['"];?/g,
      (match, imports) => {
        // 保留导入的钩子函数，但移除React导入（因为我们在iframe中已全局定义）
        return '';
      }
    );
    
    // 处理默认导出
    transformedCode = transformedCode.replace(
      /export\s+default\s+(\w+);?/g,
      (match, componentName) => {
        // 标记这个组件是默认导出的，以便稍后渲染
        return `
          // 原始导出保持不变
          export default ${componentName};
          // 同时导出到全局作用域以便渲染
          window.${componentName} = ${componentName};
          window.DefaultComponent = ${componentName};
        `;
      }
    );
    
    // 处理命名导出 - 把所有大写开头的组件导出到全局
    transformedCode = transformedCode.replace(
      /export\s+(?:const|let|var|function|class)\s+([A-Z][a-zA-Z0-9_]*)/g,
      (match, componentName) => {
        return `export const ${componentName} = window.${componentName} = `;
      }
    );
    
    return transformedCode;
  } catch (error) {
    return `
      console.error("编译错误:", ${JSON.stringify(error.message)});
      document.getElementById('root').innerHTML = '<div class="error"><h2>编译错误</h2><pre>' + ${JSON.stringify(error.message)} + '</pre></div>';
    `;
  }
};

// 处理本地模块导入的自定义babel插件
const localModuleResolverPlugin = () => {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        const source = path.node.source.value;
        
        // 特殊处理React导入
        if (source === 'react') {
          // 移除导入，因为我们在iframe中全局提供了React
          // 但我们需要保留导入的hooks和其他函数
          const specifiers = path.node.specifiers;
          
          // 检查是否有默认导入 (import React from 'react')
          const hasDefaultImport = specifiers.some(s => s.type === 'ImportDefaultSpecifier');
          
          // 检查是否有命名导入 (import { useState, useEffect } from 'react')
          const namedImports = specifiers.filter(s => s.type === 'ImportSpecifier');
          
          // 如果只有默认导入，或者没有任何导入，我们可以安全地移除整个导入语句
          if ((hasDefaultImport && namedImports.length === 0) || specifiers.length === 0) {
            path.remove();
          } else {
            // 否则，我们只移除默认导入，保留命名导入
            // 但由于在iframe中我们已经全局暴露了这些钩子函数，所以这里也可以移除
            path.remove();
          }
          return;
        }
        
        // 处理react-dom相关导入
        if (source === 'react-dom/client' || source === 'react-dom') {
          path.remove();
          return;
        }
        
        // 对于第三方库（如d3、recharts等），保留原始导入
        // 它们将通过importmap解析
        
        // 只处理相对导入（本地模块）
        if (source.startsWith('./') || source.startsWith('../')) {
          // 在真实实现中，我们会使用URL.createObjectURL
          // 为了简单起见，我们只是修改路径进行演示
          path.node.source.value = `__MODULE__${source}`;
        }
      }
    }
  };
};

// 添加自动注入Tailwind CSS的代码
const injectTailwindCode = `
  // 自动注入Tailwind CSS
  (function injectTailwind() {
    const link = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  })();
`;

// 添加图片占位符服务的代码
const imagePlaceholderCode = `
  // 替换占位符图片服务
  if (typeof window !== 'undefined') {
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
      if (url && typeof url === 'string' && url.startsWith('/api/placeholder')) {
        // 将占位符API URL替换为实际的图片服务
        const dims = url.split('/').slice(-2);
        return originalFetch(\`https://picsum.photos/\${dims[0]}/\${dims[1]}\`, options);
      }
      return originalFetch(url, options);
    };
    
    // 修改Image类以支持占位符
    const originalCreateElement = document.createElement;
    document.createElement = function(tag) {
      const element = originalCreateElement.call(document, tag);
      if (tag.toLowerCase() === 'img') {
        const originalSetAttribute = element.setAttribute;
        element.setAttribute = function(name, value) {
          if (name === 'src' && value && typeof value === 'string' && value.startsWith('/api/placeholder')) {
            const dims = value.split('/').slice(-2);
            value = \`https://picsum.photos/\${dims[0]}/\${dims[1]}\`;
          }
          return originalSetAttribute.call(this, name, value);
        };
      }
      return element;
    };
  }
`;

// 处理组件渲染的代码
const componentRenderCode = `
  // 查找要渲染的组件
  let ComponentToRender;
  
  // 检查是否有命名为ProductCard的组件
  if (typeof ProductCard !== 'undefined') {
    ComponentToRender = ProductCard;
  } 
  // 检查是否有命名为App的组件
  else if (typeof App !== 'undefined') {
    ComponentToRender = App;
  }
  // 检查是否有default_1变量（Babel的export default转换结果）
  else if (typeof default_1 !== 'undefined') {
    ComponentToRender = default_1;
  }
  // 检查全局exports对象
  else if (typeof exports !== 'undefined' && exports.default) {
    ComponentToRender = exports.default;
  }
  // 尝试找到任何首字母大写的React组件
  else {
    for (const key in window) {
      // 首字母大写，可能是React组件
      if (
        key !== 'React' && 
        key !== 'ReactDOM' && 
        typeof window[key] === 'function' && 
        /^[A-Z]/.test(key)
      ) {
        ComponentToRender = window[key];
        break;
      }
    }
  }
  
  // 如果找不到组件，显示错误信息
  if (!ComponentToRender) {
    throw new Error('找不到可渲染的React组件。请确保您的代码导出或定义了一个组件。');
  }
  
  // 渲染找到的组件
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(React.createElement(ComponentToRender));
`;

// 监听来自主线程的消息
self.addEventListener('message', (event) => {
  const { code, importMap } = event.data;
  
  if (!code) return;
  
  try {
    // 转换代码
    const transformedCode = transformCode(code);
    
    // 构建运行时代码，包括检测和渲染组件
    const runtimeCode = `
      // 执行转换后的用户代码，这会定义组件
      ${transformedCode}
      
      // 寻找要渲染的组件
      let ComponentToRender;
      
      // 首先检查是否有通过DefaultComponent标记的默认导出组件
      if (typeof window.DefaultComponent !== 'undefined') {
        ComponentToRender = window.DefaultComponent;
      } 
      // 然后检查是否有命名为ProductCard的组件（直接定义或作为变量）
      else if (typeof ProductCard !== 'undefined') {
        ComponentToRender = ProductCard;
      }
      // 再检查是否有命名为App的组件
      else if (typeof App !== 'undefined') {
        ComponentToRender = App;
      }
      // 最后尝试查找任何首字母大写的函数（可能是React组件）
      else {
        for (const key in window) {
          if (
            key !== 'React' && 
            key !== 'ReactDOM' && 
            typeof window[key] === 'function' && 
            /^[A-Z]/.test(key)
          ) {
            ComponentToRender = window[key];
            break;
          }
        }
      }
      
      // 如果找到了组件，就渲染它
      if (ComponentToRender) {
        try {
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(React.createElement(ComponentToRender));
        } catch (error) {
          console.error("渲染组件错误:", error);
          document.getElementById('root').innerHTML = '<div class="error"><h2>渲染错误</h2><pre>' + error.message + '</pre></div>';
        }
      } else {
        // 没有找到组件，显示错误信息
        document.getElementById('root').innerHTML = '<div class="error"><h2>错误</h2><pre>找不到可渲染的React组件。请确保您的代码导出或定义了一个组件。</pre></div>';
      }
      
      // 清理DefaultComponent的引用，避免影响下一次渲染
      window.DefaultComponent = undefined;
    `;
    
    // 将编译后的代码发送回主线程
    self.postMessage(runtimeCode);
  } catch (error) {
    self.postMessage(`
      console.error("工作线程错误:", ${JSON.stringify(error.message)});
      document.getElementById('root').innerHTML = '<div class="error"><h2>工作线程错误</h2><pre>' + ${JSON.stringify(error.message)} + '</pre></div>';
    `);
  }
}); 
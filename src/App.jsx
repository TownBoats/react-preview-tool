import { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { defaultCode } from './utils/default-code';
import './App.css';

function App() {
  const [code, setCode] = useState(defaultCode);
  const [compiledCode, setCompiledCode] = useState('');
  const [showingDefaultPreview, setShowingDefaultPreview] = useState(false);
  const [importMap, setImportMap] = useState({
    imports: {
      'react': 'https://esm.sh/react@18.2.0',
      'react-dom/client': 'https://esm.sh/react-dom@18.2.0/client',
      'react/jsx-runtime': 'https://esm.sh/react@18.2.0/jsx-runtime',
      'recharts': 'https://esm.sh/recharts@2.7.0?deps=react@18.2.0'
    }
  });
  const [showExamplePrompt, setShowExamplePrompt] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const previewContainerRef = useRef(null);
  const previewRef = useRef(null);
  const compilerWorkerRef = useRef(null);
  
  useEffect(() => {
    // 初始化编译器Web Worker
    compilerWorkerRef.current = new Worker(
      new URL('./workers/compiler.worker.js', import.meta.url),
      { type: 'module' }
    );
    
    // 设置已编译代码的消息处理程序
    compilerWorkerRef.current.addEventListener('message', (event) => {
      setCompiledCode(event.data);
    });
    
    return () => {
      compilerWorkerRef.current?.terminate();
    };
  }, []);
  
  useEffect(() => {
    // 当代码更改时向编译器worker发送代码
    if (compilerWorkerRef.current) {
      if (code === '') {
        // 如果编辑框为空，但需要显示默认代码的预览
        if (!showingDefaultPreview) {
          compilerWorkerRef.current.postMessage({
            code: defaultCode,
            importMap
          });
          setShowingDefaultPreview(true);
        }
      } else {
        // 正常发送用户编辑的代码
        compilerWorkerRef.current.postMessage({
          code,
          importMap
        });
        setShowingDefaultPreview(false);
      }
    }
  }, [code, importMap, showingDefaultPreview]);

  // 检查是否有新添加的库有示例代码
  useEffect(() => {
    const libraryNames = Object.keys(importMap.imports);
  }, [importMap]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };
  
  const handleImportMapChange = (newImportMap) => {
    setImportMap(newImportMap);
  };
  
  const dismissExamplePrompt = () => {
    setShowExamplePrompt(null);
  };

  const handleClearCode = () => {
    setCode('');
    setShowingDefaultPreview(true);
  };

  const handleRerender = () => {
    // 使用预览组件的刷新方法完全重新加载iframe
    if (previewRef.current) {
      previewRef.current.refresh();
      
      // 重新加载后需要再次发送代码
      setTimeout(() => {
        const codeToRender = code === '' ? defaultCode : code;
        if (compilerWorkerRef.current) {
          compilerWorkerRef.current.postMessage({
            code: codeToRender,
            importMap
          });
        }
      }, 100); // 给iframe一点加载时间
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      // 请求进入全屏模式
      if (previewContainerRef.current) {
        if (previewContainerRef.current.requestFullscreen) {
          previewContainerRef.current.requestFullscreen();
        } else if (previewContainerRef.current.webkitRequestFullscreen) { // Safari
          previewContainerRef.current.webkitRequestFullscreen();
        } else if (previewContainerRef.current.msRequestFullscreen) { // IE11
          previewContainerRef.current.msRequestFullscreen();
        }
      }
    } else {
      // 退出全屏模式
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { // Safari
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE11
        document.msExitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // 监听全屏状态改变事件
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  return (
    <Layout>
      <div className={`editor-preview-container ${isFullscreen ? 'fullscreen-mode' : ''}`}>
        <div className={`panel editor-panel ${isFullscreen ? 'hidden' : ''}`}>
          <div className="panel-header">
            <h2>编辑器</h2>
          </div>
          <Editor value={code} onChange={handleCodeChange} />
        </div>
        
        <div 
          ref={previewContainerRef}
          className={`panel preview-panel ${isFullscreen ? 'fullscreen' : ''}`}>
          <div className="panel-header">
            <h2>预览</h2>
            {isFullscreen && (
              <button 
                className="exit-fullscreen-button" 
                onClick={toggleFullscreen}
                title="退出全屏"
              >
                退出全屏
              </button>
            )}
          </div>
          <Preview 
            ref={previewRef} 
            code={compiledCode} 
            importMap={importMap} 
          />
        </div>
      </div>

      <div className="footer-info-banner">
        <p>目前支持 Tailwind CSS、D3 和 Lucide 图标库，其余的库还没研究清楚。带宽较低，要引入外部库，所以可能要稍等一会渲染。</p>
        <div className="tooltip-container">
          <button 
            className="tooltip-button" 
            onClick={handleClearCode}
            title="清空编辑器中的代码"
          >
            清空代码
          </button>
          <button 
            className="tooltip-button"
            onClick={handleRerender}
            title="重新渲染当前代码"
          >
            重新渲染
          </button>
          <button 
            className="tooltip-button"
            onClick={toggleFullscreen}
            title="全屏预览模式"
          >
            {isFullscreen ? '退出全屏' : '全屏预览'}
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default App;

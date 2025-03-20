# React在线预览工具

这是一个纯浏览器端的React组件预览工具，允许用户在左侧编写React组件代码，并在右侧实时查看渲染结果。

## 主要功能

- **实时预览**：编辑代码后立即查看渲染结果
- **JSX支持**：完整支持JSX语法
- **依赖管理**：可以添加和管理第三方依赖
- **隔离环境**：使用iframe确保预览安全不受干扰
- **错误处理**：编译和运行时错误显示

## 技术栈

- React 19
- Monaco Editor
- Babel (用于JSX编译)
- Web Workers (用于非阻塞编译)
- Import Maps (用于依赖管理)

## 开发设置

```bash
# 安装依赖
npm install

# 运行开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
react-preview-tool/
├── public/
│   ├── iframe.html      # 预览隔离环境
│   └── favicon.ico
├── src/
│   ├── components/      # React组件
│   ├── workers/         # Web Worker编译器
│   ├── utils/           # 工具函数
│   ├── App.jsx          # 主应用
│   └── main.jsx         # 入口点
└── package.json
```

## 使用说明

1. 在左侧编辑器中编写React组件代码
2. 代码会自动编译并在右侧显示结果
3. 使用顶部的依赖管理器添加第三方库
4. 所有编译和运行时错误都会在预览窗口中显示

## 许可证

MIT

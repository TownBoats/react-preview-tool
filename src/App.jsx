import { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { defaultCode } from './utils/default-code';
import './App.css';

function App() {
  const [code, setCode] = useState(defaultCode);
  const [compiledCode, setCompiledCode] = useState('');
  const [importMap, setImportMap] = useState({
    imports: {
      'react': 'https://esm.sh/react@18.2.0',
      'react-dom/client': 'https://esm.sh/react-dom@18.2.0/client',
      'react/jsx-runtime': 'https://esm.sh/react@18.2.0/jsx-runtime',
      'recharts': 'https://esm.sh/recharts@2.7.0?deps=react@18.2.0'
    }
  });
  const [showExamplePrompt, setShowExamplePrompt] = useState(null);
  
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
    if (compilerWorkerRef.current && code) {
      compilerWorkerRef.current.postMessage({
        code,
        importMap
      });
    }
  }, [code, importMap]);

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

  return (
    <Layout>

      

      
      <div className="editor-preview-container">
        <Editor value={code} onChange={handleCodeChange} />
        <Preview code={compiledCode} importMap={importMap} />
      </div>
    </Layout>
  );
}

export default App;

import { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import Editor from './components/Editor';
import Preview from './components/Preview';
import DependencyManager from './components/DependencyManager';
import { defaultCode } from './utils/default-code';
import { libraryExamples } from './utils/library-examples';
import './App.css';

function App() {
  const [code, setCode] = useState(defaultCode);
  const [compiledCode, setCompiledCode] = useState('');
  const [importMap, setImportMap] = useState({
    imports: {
      'react': 'https://esm.sh/react@18.2.0',
      'react-dom/client': 'https://esm.sh/react-dom@18.2.0/client',
      'react/jsx-runtime': 'https://esm.sh/react@18.2.0/jsx-runtime'
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
    
    for (const lib of Object.keys(libraryExamples)) {
      if (libraryNames.includes(lib) && !showExamplePrompt) {
        setShowExamplePrompt(lib);
        break;
      }
    }
  }, [importMap]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };
  
  const handleImportMapChange = (newImportMap) => {
    setImportMap(newImportMap);
  };
  
  const loadExampleCode = (library) => {
    if (libraryExamples[library]) {
      setCode(libraryExamples[library]);
      setShowExamplePrompt(null);
    }
  };
  
  const dismissExamplePrompt = () => {
    setShowExamplePrompt(null);
  };

  return (
    <Layout>
      <div className="top-controls">
        <DependencyManager 
          importMap={importMap}
          onImportMapChange={handleImportMapChange}
        />
      </div>
      
      {showExamplePrompt && (
        <div className="example-prompt">
          <div className="example-prompt-content">
            <span>检测到您添加了 <strong>{showExamplePrompt}</strong> 库。是否加载示例代码？</span>
            <div className="example-prompt-buttons">
              <button 
                className="load-example-button"
                onClick={() => loadExampleCode(showExamplePrompt)}
              >
                加载示例
              </button>
              <button 
                className="dismiss-button"
                onClick={dismissExamplePrompt}
              >
                不用了
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="editor-preview-container">
        <Editor value={code} onChange={handleCodeChange} />
        <Preview code={compiledCode} importMap={importMap} />
      </div>
    </Layout>
  );
}

export default App;

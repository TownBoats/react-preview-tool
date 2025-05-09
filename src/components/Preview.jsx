import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

const Preview = forwardRef(({ code, importMap }, ref) => {
  const iframeRef = useRef(null);
  const iframeUrl = '/iframe.html';
  const [error, setError] = useState(null);
  const [iframeKey, setIframeKey] = useState(0); // 用于强制重新加载iframe
  
  // 暴露刷新方法给父组件
  useImperativeHandle(ref, () => ({
    refresh: () => {
      // 通过改变key值强制重新加载iframe
      setIframeKey(prevKey => prevKey + 1);
      setError(null);
    }
  }));
  
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !code) return;
    
    const handleIframeLoad = () => {
      // 向iframe发送编译后的代码和导入映射
      iframe.contentWindow.postMessage({
        type: 'update',
        code,
        importMap: JSON.stringify(importMap)
      }, '*');
    };
    
    const handleIframeMessage = (event) => {
      // 处理来自iframe的消息
      if (event.source !== iframe.contentWindow) return;
      
      const { type, error, component } = event.data;
      
      if (type === 'componentError' && error) {
        setError(error);
      } else if (type === 'componentReady') {
        // 组件已准备好，清除任何错误
        setError(null);
        console.log(`组件 ${component} 已加载并渲染`);
      }
    };
    
    // 添加消息监听器
    window.addEventListener('message', handleIframeMessage);
    iframe.addEventListener('load', handleIframeLoad);
    
    // 如果iframe已经加载，直接发送消息
    if (iframe.contentDocument?.readyState === 'complete') {
      handleIframeLoad();
    }
    
    return () => {
      iframe.removeEventListener('load', handleIframeLoad);
      window.removeEventListener('message', handleIframeMessage);
    };
  }, [code, importMap, iframeKey]); // 添加iframeKey作为依赖

  return (
    <div className="preview-content">
      {error && (
        <div className="error">
          <h3>渲染错误</h3>
          <pre>{error}</pre>
        </div>
      )}
      <div className="preview-frame-container">
        <iframe
          key={iframeKey} // 添加key强制重新加载
          ref={iframeRef}
          src={iframeUrl}
          title="预览"
          sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
          className="preview-iframe"
          loading="lazy"
          allow="fullscreen"
        />
      </div>
    </div>
  );
});

export default Preview; 
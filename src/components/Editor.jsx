import { useRef, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';

const Editor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    // 设置编辑器选项
    editor.updateOptions({
      minimap: { enabled: false },
      fontSize: 14,
      tabSize: 2,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      fontFamily: '"JetBrains Mono", "Fira Code", Menlo, Monaco, "Courier New", monospace',
      fontLigatures: true,
    });
  };
  
  useEffect(() => {
    // 初始化JSX语法高亮
    return () => {
      editorRef.current = null;
    };
  }, []);

  return (
    <div className="editor-content">
      <MonacoEditor
        height="100%"
        defaultLanguage="javascript"
        defaultValue={value}
        onMount={handleEditorDidMount}
        onChange={onChange}
        theme="vs-dark"
        options={{
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          padding: { top: 12, bottom: 12 },
          lineNumbers: 'on',
          glyphMargin: false,
          folding: true,
          lineDecorationsWidth: 10,
          renderLineHighlight: 'line',
        }}
      />
    </div>
  );
};

export default Editor; 
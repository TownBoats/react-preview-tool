import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <div className="header-text-container">
            <h1>React在线预览工具</h1>
            <p className="header-subtitle">Claude artifacts 的react组件预览平替，支持Tailwind CSS、D3 和 Lucide 图标库。</p>
          </div>
        </div>
      </header>
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default Layout; 
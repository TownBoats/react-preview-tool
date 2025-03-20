import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        <h1>React在线预览工具</h1>
      </header>
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default Layout; 
import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1>React在线预览工具</h1>        </div>
      </header>
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default Layout; 
export const defaultCode = `
import React from 'react';

const WelcomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          欢迎使用 React Preview
        </h1>
        
        <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-6">
          <p className="text-lg text-gray-700">
            这是一个预览页面，请修改或者粘贴左侧代码来预览吧！
          </p>
        </div>
        

      </div>
      
      <div className="mt-8 text-white text-sm opacity-80">
        <p>使用 React + Tailwind CSS 构建</p>
      </div>
    </div>
  );
};

export default WelcomePage;
`; 
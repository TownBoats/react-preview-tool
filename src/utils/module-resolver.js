// 创建模块URL的函数
export const createModuleUrl = (code) => {
  const blob = new Blob([code], { type: 'application/javascript' });
  return URL.createObjectURL(blob);
};

// 释放模块URL的函数
export const revokeModuleUrl = (url) => {
  URL.revokeObjectURL(url);
}; 
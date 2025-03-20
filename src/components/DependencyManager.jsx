import { useState } from 'react';

const DependencyManager = ({ importMap, onImportMapChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [packageName, setPackageName] = useState('');
  const [packageVersion, setPackageVersion] = useState('latest');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 常用React包，供快速选择
  const popularPackages = [
    // 原有库
    { name: 'react-router-dom', version: '6.14.0' },
    { name: 'axios', version: '1.4.0' },
    { name: 'lodash', version: '4.17.21' },

    // 添加数据可视化和图标库
    { name: 'lucide-react', version: '0.263.1', category: '图标' },
    { name: 'recharts', version: '2.7.2', category: '图表' },
    { name: 'd3', version: '7.8.5', category: '数据可视化' },
    { name: 'chart.js', version: '4.3.3', category: '图表' },
    
    // UI库
    { name: '@ant-design/charts', version: '1.4.2', category: 'UI' },
    { name: 'antd', version: '5.6.3', category: 'UI' },
    { name: '@mui/material', version: '5.13.6', category: 'UI' },
    { name: 'tailwindcss', version: '3.3.2', category: 'CSS' },
    { name: 'react-query', version: '3.39.3', category: '状态管理' },
  ];

  // 分类库以便更好地展示
  const categorizedPackages = {
    '图表与数据可视化': popularPackages.filter(pkg => ['图表', '数据可视化'].includes(pkg.category)),
    '图标': popularPackages.filter(pkg => pkg.category === '图标'),
    'UI组件': popularPackages.filter(pkg => pkg.category === 'UI'),
    '实用工具': popularPackages.filter(pkg => !pkg.category || ['状态管理', 'CSS'].includes(pkg.category))
  };

  const handleAddDependency = async (e) => {
    e.preventDefault();
    
    if (!packageName.trim()) {
      setError('包名是必填的');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // 检查指定CDN上是否存在该包
      // 这是一个简化的检查 - 在实际应用中，您需要更强大的验证
      const version = packageVersion === 'latest' ? '' : `@${packageVersion}`;
      const packageUrl = `https://esm.sh/${packageName}${version}`;
      
      // 特殊处理chart.js - 需要添加自动注册
      let additionalImports = {};
      if (packageName === 'chart.js') {
        additionalImports['chart.js/auto'] = `https://esm.sh/chart.js@${packageVersion || 'latest'}/auto`;
      }
      
      // 尝试获取包以查看它是否存在
      const response = await fetch(packageUrl, { method: 'HEAD' });
      
      if (!response.ok) {
        throw new Error(`未找到包: ${packageName}${version}`);
      }
      
      // 添加到导入映射
      const updatedImportMap = {
        ...importMap,
        imports: {
          ...importMap.imports,
          [packageName]: packageUrl,
          ...additionalImports
        }
      };
      
      onImportMapChange(updatedImportMap);
      setShowModal(false);
      setPackageName('');
      setPackageVersion('latest');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleQuickAdd = (pkg) => {
    setPackageName(pkg.name);
    setPackageVersion(pkg.version);
  };
  
  const handleRemoveDependency = (packageName) => {
    // 使用解构赋值从imports中移除特定的包
    const { [packageName]: removed, ...restImports } = importMap.imports;
    
    // 特殊处理chart.js - 同时移除chart.js/auto
    let updatedImports = {...restImports};
    if (packageName === 'chart.js' && updatedImports['chart.js/auto']) {
      const {'chart.js/auto': removedAuto, ...remainingImports} = updatedImports;
      updatedImports = remainingImports;
    }
    
    onImportMapChange({
      ...importMap,
      imports: updatedImports
    });
  };
  
  return (
    <div className="dependency-manager">
      <button 
        className="add-dependency-button"
        onClick={() => setShowModal(true)}
      >
        添加依赖
      </button>
      
      <div className="current-dependencies">
        <h3>依赖项</h3>
        <ul>
          {Object.entries(importMap.imports).map(([name, url]) => (
            <li key={name}>
              <span>{name}</span>
              <button 
                className="remove-button"
                onClick={() => handleRemoveDependency(name)}
              >
                移除
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>添加依赖</h2>
            
            <form onSubmit={handleAddDependency}>
              <div className="form-group">
                <label>包名:</label>
                <input 
                  type="text" 
                  value={packageName} 
                  onChange={e => setPackageName(e.target.value)}
                  placeholder="例如, lodash"
                />
              </div>
              
              <div className="form-group">
                <label>版本:</label>
                <input 
                  type="text" 
                  value={packageVersion} 
                  onChange={e => setPackageVersion(e.target.value)}
                  placeholder="例如, 4.17.21 或 latest"
                />
              </div>
              
              {error && <div className="error">{error}</div>}
              
              <div className="quick-add">
                <h4>快速添加:</h4>
                
                {Object.entries(categorizedPackages).map(([category, packages]) => (
                  <div key={category} className="package-category">
                    <h5>{category}</h5>
                    <div className="package-buttons">
                      {packages.map(pkg => (
                        <button
                          key={pkg.name}
                          type="button"
                          onClick={() => handleQuickAdd(pkg)}
                          title={`${pkg.name}@${pkg.version}`}
                        >
                          {pkg.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                >
                  取消
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? '添加中...' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DependencyManager; 
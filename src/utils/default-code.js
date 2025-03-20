export const defaultCode = `
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const ProductCard = () => {
  const [isInCart, setIsInCart] = useState(false);
  
  const product = {
    name: "智能手表 Pro",
    description: "高级智能手表，支持健康监测、运动追踪和通知管理。防水设计，续航长达7天。",
    price: 1299,
    discount: 200,
    rating: 4.7,
    reviewCount: 124,
    imageSrc: "/api/placeholder/400/300"
  };

  const handleAddToCart = () => {
    setIsInCart(!isInCart);
  };

  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white">
      <div className="relative">
        <img 
          className="w-full h-64 object-cover" 
          src={product.imageSrc} 
          alt={product.name} 
        />
        <span className="absolute top-2 right-2 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
          省¥{product.discount}
        </span>
      </div>
      
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-gray-800">{product.name}</div>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={\`w-4 h-4 \${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}\`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-gray-600 text-sm ml-2">
            {product.rating} ({product.reviewCount}条评价)
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-400 line-through text-sm">¥{product.price}</span>
            <span className="text-gray-800 font-bold text-xl ml-2">¥{product.price - product.discount}</span>
          </div>
          <button 
            onClick={handleAddToCart}
            className={\`px-4 py-2 rounded-lg font-bold \${
              isInCart 
                ? "bg-green-100 text-green-700 border border-green-700" 
                : "bg-blue-600 text-white hover:bg-blue-700"
            } transition-colors duration-200\`}
          >
            {isInCart ? "已加入购物车" : "加入购物车"}
          </button>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-600">次日达</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2a3 3 0 013-3h4a3 3 0 013 3z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-600">30天保修</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
`; 
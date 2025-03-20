// 各个库的示例代码，用于展示如何使用

export const rechartsExample = `
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: '1月', 销售额: 4000, 利润: 2400 },
  { name: '2月', 销售额: 3000, 利润: 1398 },
  { name: '3月', 销售额: 2000, 利润: 9800 },
  { name: '4月', 销售额: 2780, 利润: 3908 },
  { name: '5月', 销售额: 1890, 利润: 4800 },
  { name: '6月', 销售额: 2390, 利润: 3800 },
  { name: '7月', 销售额: 3490, 利润: 4300 },
];

function RechartsExample() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">月度销售与利润趋势</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="销售额" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="利润" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RechartsExample;
`;

export const chartJsExample = `
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chart.js/auto';

Chart.register(...registerables);

function ChartJsExample() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // 如果已经有图表实例，销毁它
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['红色', '蓝色', '黄色', '绿色', '紫色', '橙色'],
          datasets: [
            {
              label: '投票数',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: '最受欢迎的颜色调查',
              font: {
                size: 18
              }
            }
          }
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default ChartJsExample;
`;

export const d3Example = `
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function D3Example() {
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    // 数据
    const data = [
      { name: "北京", value: 50 },
      { name: "上海", value: 40 },
      { name: "广州", value: 30 },
      { name: "深圳", value: 25 },
      { name: "杭州", value: 20 }
    ];
    
    // 清除之前的SVG内容
    d3.select(svgRef.current).selectAll("*").remove();
    
    // 设置SVG尺寸和边距
    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // 创建SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    
    // 创建比例尺
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, innerWidth])
      .padding(0.2);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) * 1.1])
      .range([innerHeight, 0]);
    
    // 创建图表组
    const g = svg.append("g")
      .attr("transform", \`translate(\${margin.left}, \${margin.top})\`);
    
    // 添加X轴
    g.append("g")
      .attr("transform", \`translate(0, \${innerHeight})\`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-25)");
    
    // 添加Y轴
    g.append("g")
      .call(d3.axisLeft(yScale));
    
    // 添加Y轴标题
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (innerHeight / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("人口 (万)");
    
    // 添加柱状图
    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.name))
      .attr("y", d => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", d => innerHeight - yScale(d.value))
      .attr("fill", "#4299e1")
      .on("mouseover", function() {
        d3.select(this).attr("fill", "#2c5282");
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill", "#4299e1");
      });
    
    // 添加数值标签
    g.selectAll(".label")
      .data(data)
      .enter().append("text")
      .attr("class", "label")
      .attr("x", d => xScale(d.name) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.value) - 5)
      .attr("text-anchor", "middle")
      .text(d => d.value);
      
  }, []);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">2023年主要城市人口统计 (D3.js)</h2>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default D3Example;
`;

export const lucideReactExample = `
import React from 'react';
import { 
  Calendar, 
  MessageCircle, 
  Heart, 
  Share2, 
  Bookmark, 
  User, 
  Settings, 
  Bell, 
  Home, 
  Search
} from 'lucide-react';

function LucideIconsExample() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Lucide图标库示例</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">导航栏图标</h3>
        <div className="flex space-x-6 bg-gray-100 p-4 rounded-lg justify-center">
          <Home className="w-6 h-6 text-blue-600" />
          <Search className="w-6 h-6 text-gray-600" />
          <Calendar className="w-6 h-6 text-gray-600" />
          <MessageCircle className="w-6 h-6 text-gray-600" />
          <User className="w-6 h-6 text-gray-600" />
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">社交互动图标</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="border-b border-gray-200 pb-3 mb-3">
            <p className="mb-3">这是一个非常精彩的帖子内容，希望大家喜欢！</p>
            <div className="flex space-x-8">
              <button className="flex items-center text-red-500">
                <Heart className="w-5 h-5 mr-1" /> 
                <span>142</span>
              </button>
              <button className="flex items-center text-blue-500">
                <MessageCircle className="w-5 h-5 mr-1" /> 
                <span>36</span>
              </button>
              <button className="flex items-center text-green-500">
                <Share2 className="w-5 h-5 mr-1" /> 
                <span>分享</span>
              </button>
              <button className="flex items-center text-yellow-600">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">设置菜单图标</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-3">
            <div className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
              <User className="w-5 h-5 mr-3 text-gray-700" />
              <span>个人资料</span>
            </div>
            <div className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
              <Bell className="w-5 h-5 mr-3 text-gray-700" />
              <span>通知设置</span>
            </div>
            <div className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
              <Settings className="w-5 h-5 mr-3 text-gray-700" />
              <span>系统设置</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LucideIconsExample;
`;

// 汇总所有示例
export const libraryExamples = {
  recharts: rechartsExample,
  'chart.js': chartJsExample,
  'd3': d3Example,
  'lucide-react': lucideReactExample
}; 
import React from 'react';

export default function Navigation({ setCurrentPage }) {
  return (
    <nav className="bg-gray-100 sticky top-16 z-[5] shadow">
      <div className="max-w-7xl mx-auto px-4 flex gap-8 h-16 items-center">
        <button 
          onClick={() => setCurrentPage('home')}
          className="font-semibold text-gray-700 hover:text-indigo-600 transition"
        >
          홈
        </button>
        <button 
          onClick={() => setCurrentPage('data-insight')}
          className="font-semibold text-gray-700 hover:text-indigo-600 transition"
        >
          데이터 분석
        </button>
        <button 
          onClick={() => setCurrentPage('solution')}
          className="font-semibold text-gray-700 hover:text-indigo-600 transition"
        >
          솔루션
        </button>
      </div>
    </nav>
  );
}
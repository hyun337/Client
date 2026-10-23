// 페이지 공통 헤더
// 고정된 상단 내비게이션 바 구현
// 페이지 이동 처리

import React from 'react';

const Header = ({ setCurrentPage }) => ( 
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 shadow-2xl z-50 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
            <button
                onClick={() => setCurrentPage('home')}
                className="group flex items-center gap-3 text-2xl font-extrabold text-white hover:text-blue-400 transition duration-200"
            >
                <span>DATA INSIGHT</span>
            </button>

            <nav className="flex gap-2 items-center">
                <button
                    onClick={() => setCurrentPage('home')}
                    className="px-4 py-2 text-white font-semibold rounded-lg hover:bg-white/10 transition duration-200"
                >
                    홈
                </button>
                <button
                    onClick={() => setCurrentPage('data-insight')}
                    className="px-4 py-2 text-white font-semibold rounded-lg hover:bg-white/10 transition duration-200"
                >
                    데이터 분석
                </button>
                <button
                    onClick={() => setCurrentPage('solution')}
                    className="px-4 py-2 text-white font-semibold rounded-lg hover:bg-white/10 transition duration-200"
                >
                    솔루션
                </button>
            </nav>
        </div>
    </header>
);

export default Header;
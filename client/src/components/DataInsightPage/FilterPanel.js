// 동적 필터링 UI 
// 체류 시간 기준 드롭다운 UI 구현

import React from 'react';
import { DURATION_FILTER_OPTIONS } from '../../data/constants'; 

/**
 * 고객 데이터 동적 필터링을 위한 드롭다운 UI 컴포넌트
 * @param {object} props
 * @param {number} props.selectedDuration - 현재 선택된 최소 체류 시간
 * @param {function} props.setSelectedDuration - App.js 상태를 변경하는 함수
 */
export default function FilterPanel({ selectedDuration, setSelectedDuration }) {
    
    // 드롭다운 변경 핸들러
    const handleChange = (event) => {
        // App.js의 setSelectedDuration 호출해 전역 상태 변경
        // value는 문자열이므로 Number로 변환하여 전달
        setSelectedDuration(Number(event.target.value)); 
    };

    return (
        <div className="filter-panel bg-white p-6 shadow-xl rounded-xl border border-indigo-100 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
                데이터 필터링 설정
            </h3>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <label htmlFor="duration-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    최소 체류 시간 기준:
                </label>
                
                <div className="relative w-full sm:w-60">
                    <select
                        id="duration-filter"
                        name="duration-filter"
                        className="appearance-none block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm transition duration-150 ease-in-out cursor-pointer"
                        value={selectedDuration}
                        onChange={handleChange}
                    >
                        {/* DURATION_FILTER_OPTIONS 배열을 순회하며 드롭다운 항목 생성 */}
                        {DURATION_FILTER_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.key}
                            </option>
                        ))}
                    </select>
                    {/* 드롭다운 아이콘 */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
                선택된 기준({selectedDuration === 0 ? '전체' : selectedDuration + '분 이상'})에 따라 데이터 인사이트의 모든 차트가 실시간으로 갱신됩니다.
            </p>
        </div>
    );
}

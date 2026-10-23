// 중앙 상태 관리 및 데이터 라우팅
// 데이터 로드: API로부터 고객 데이터를 비동기로 가져옴
// 전역상태: 현재 페이지와 필터 값 관리
// 실시간 필터링: customers를 필터링한 filterdData 계산, 하위 컴포넌트에 전달


import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import DataInsightPage from './components/DataInsightPage/DataInsightPage';
import SolutionDashboard from './components/SolutionDashboard/SolutionDashboard';

// API 기본 URL
const API_BASE_URL = 'http://localhost:5001/api';

export default function App() {
  // 현재 페이지 상태
  const [currentPage, setCurrentPage] = useState('home');

  // 필터 상태
  const [selectedDuration, setSelectedDuration] = useState(0);

  // 고객 데이터 상태 (API로부터 받아올 데이터)
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchCustomers();
  }, []);

  // API에서 고객 데이터 가져오기
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/customers`);
      setCustomers(response.data.data);
      setError(null);
    } catch (err) {
      console.error('데이터 로드 실패:', err);
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // useMemo로 필터링된 데이터를 캐싱
  const filteredData = useMemo(() => {
    if (selectedDuration === 0) return customers;
    return customers.filter(
      customer => customer.total_duration_min >= selectedDuration
    );
  }, [customers, selectedDuration]);

  // mockData 형식으로 변환 (HeroSection 호환성)
  const mockData = useMemo(() => ({
    customers: customers
  }), [customers]);

  // 로딩 중일 때
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  // 에러 발생 시
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">오류 발생</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchCustomers}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen antialiased">
      {/* Header는 모든 페이지에서 보임 */}
      <Header setCurrentPage={setCurrentPage} />

      {currentPage === 'home' && (
        <>
          {/* HeroSection에 setCurrentPage와 mockData 전달 */}
          <HeroSection 
            setCurrentPage={setCurrentPage} 
            mockData={mockData} 
          />
          <Navigation setCurrentPage={setCurrentPage} />
        </>
      )}

      {currentPage === 'data-insight' && (
        <DataInsightPage
          filteredData={filteredData}
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
        />
      )}

      {currentPage === 'solution' && (
        <SolutionDashboard
          allData={customers}
          filteredData={filteredData}
        />
      )}

      {/* Footer는 모든 페이지에서 보임 */}
      <Footer />
    </div>
  );
}
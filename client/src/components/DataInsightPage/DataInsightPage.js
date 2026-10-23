// 분석 차트 통합
// 필터링된 데이터 받아 4개 분석 차트 통합 배치


import React, { useMemo } from 'react';
import FilterPanel from './FilterPanel';
import CorrelationDashboard from './CorrelationDashboard';
import RepurchasePredictionChart from './RepurchasePredictionChart';
import SurvivalAnalysis from './SurvivalAnalysis';
import AttendanceComparisonChart from './AttendanceComparisonChart';

/**
 * 데이터 인사이트 페이지
 * @param {object} props
 * @param {Array} props.filteredData - 필터링된 고객 데이터
 * @param {number} props.selectedDuration - 현재 선택된 필터 값
 * @param {function} props.setSelectedDuration - 필터 변경 함수
 */
export default function DataInsightPage({
  filteredData,
  selectedDuration,
  setSelectedDuration
}) {
  // 필터링된 데이터 개수를 useMemo로 캐싱
  const filteredCount = useMemo(
    () => filteredData.length,
    [filteredData]
  );

  // 필터 텍스트도 메모이제이션
  const filterText = useMemo(() => {
    return selectedDuration === 0 ? '전체' : `${selectedDuration}분 이상`;
  }, [selectedDuration]);

  return (
    <section className="pt-20 pb-16 bg-gray-50 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-10 border-b pb-4">
          데이터 인사이트
        </h2>

        {/* 1. 필터 패널 */}
        <FilterPanel
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
        />

        {/* 필터링된 데이터 개수 표시 */}
        <p className="text-gray-600 mt-6 mb-8 text-lg font-medium">
          현재 필터 적용 고객: <span className="text-indigo-600 font-bold">
            {filteredCount.toLocaleString()}
          </span>명 ({filterText})
        </p>

        <div className="space-y-12">
          {/* 2. 상관관계 분석 대시보드 */}
          <CorrelationDashboard data={filteredData} />

          {/* 3. 재구매 예측 모델 분석 */}
          <RepurchasePredictionChart data={filteredData} />

          {/* 4. 생존 분석 및 재구매 기간 예측 */}
          <SurvivalAnalysis data={filteredData} />

          {/* 5. 출석 빈도별 재구매율 비교 */}
          <AttendanceComparisonChart data={filteredData} />
        </div>
      </div>
    </section>
  );
}
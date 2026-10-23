// 솔루션 컴포넌트 통합
// 전체 데이터 기반의 KPI와 필터링된 데이터 기반의 이탈 위험 고객 목록 보여주는 3가지 솔루션 컴포넌트 통합 배치


import React from 'react';
import KPICards from './KPICards';
import ChurnRiskList from './ChurnRiskList';
import ChurnRiskSummary from './ChurnRiskSummary';
import ModelPerformance from './ModelPerformance';

/**
 * 솔루션 대시보드 페이지
 * @param {object} props
 * @param {Array} props.allData - 필터가 적용되지 않은 전체 고객 데이터
 * @param {Array} props.filteredData - 필터링된 고객 데이터(필요시 사용)
 */
function SolutionDashboard({ allData, filteredData }) {
  return (
    <section className="pt-20 pb-16 bg-gray-50 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-10 border-b pb-4">솔루션 대시보드</h2>

        <div className="space-y-12">
          {/* 1. 핵심 지표 요약(전체 데이터 사용) */}
          <KPICards data={allData} />

          {/* 2. 이탈 위험도 요약 */}
          <ChurnRiskSummary data={allData} />

          {/* 3. 이탈 위험 고객 예측 리스트((필터링된 데이터 또는 전체 데이터 사용) */}
          <ChurnRiskList data={filteredData} />

          {/* 4. 예측 모델 성능 대시보드(전체 데이터 사용) */}
          <ModelPerformance data={allData} />
         </div>
      </div>
    </section>
  );
}

export default SolutionDashboard;

import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

/**
 * ChurnRiskSummary 컴포넌트 - 이탈 위험도 분포 요약
 * @param {object} props
 * @param {Array<Object>} props.data - 전체 고객 데이터
 * 
 * 고객 데이터를 기반으로 이탈 위험도 분포를 도넛 그래프로 시각화
 * 출석 일수를 기준으로 위험도 계산
 */

const ChurnRiskSummary = ({ data }) => {
  // useMemo로 데이터 계산 최적화
  const summary = useMemo(() => {
    if (!data || data.length === 0) return null;

    // 위험도 계산 로직
    const high = data.filter((d) => d.visit_days <= 2).length; // 2일 이하
    const medium = data.filter((d) => d.visit_days > 2 && d.visit_days <= 6).length; // 3~6일
    const low = data.filter((d) => d.visit_days > 6).length; // 7일 이상

    const total = high + medium + low || 1; // 0으로 나누는 에러 방지

    // 순서 고정 - 높음, 보통, 낮음
    const chartData = [
        { name: "높음 위험군", value: high, color: "#EF4444" },
        { name: "보통 위험군", value: medium, color: "#F59E0B" },
        { name: "낮음 위험군", value: low, color: "#10B981" },
    ]
    
    // 비율 계산 (소수점 1자리까지)
    return {
      highRate: ((high / total) * 100).toFixed(1),
      mediumRate: ((medium / total) * 100).toFixed(1),
      lowRate: ((low / total) * 100).toFixed(1),
      data: chartData,
    };
  }, [data]);

  // 데이터가 비어있을 때 예외 처리
  if (!summary) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">이탈 위험도 요약</h3>
        <p className="text-gray-500">표시할 데이터가 없습니다.</p>
      </div>
    );
  }

  // 랜더링 영역
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-10">

      {/* 색션 제목 및 설명 */}
      <h3 className="text-3xl font-black text-gray-900 mb-6">이탈 위험도 요약</h3>
      <p className="text-gray-600 mb-8">
        전체 고객의 출석 일수를 기반으로 이탈 위험군 비율을 확인하세요.
        출석 일수가 짧을수록 이탈 위험이 높게 평가됩니다.
      </p>

      {/* 도넛 그래프 */}
      <div className="flex flex-col justify-center items-center mb-8">
        <PieChart width={360} height={320}>
          <Pie
            data={summary.data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={2}
          >
            {summary.data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `${v}명`} />
        </PieChart>
        
          <div className="flex justify-center gap-8 mt-4 text-sm font-semibold">
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 inline-block rounded-sm bg-red-500"></span>
                <span className="text-red-500">높음 위험군</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 inline-block rounded-sm bg-amber-500"></span>
                <span className="text-amber-500">보통 위험군</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 inline-block rounded-sm bg-emerald-500"></span>
                <span className="text-emerald-500">낮음 위험군</span>
            </div>
        </div>
    </div>

      {/* 비율 카드형 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="relative bg-red-50 rounded-2xl p-6 text-center overflow-hidden transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500 rounded-l-2xl z-10"></div>
            <h4 className="text-sm font-semibold text-gray-600 mb-1 relative z-20">높음 위험군</h4>
            <p className="text-4xl font-bold text-red-500 mb-2 relative z-20">{summary.highRate}%</p>
            <p className="text-sm text-gray-600 relative z-20">출석일수 2일 이하</p>
        </div>

        <div className="relative bg-amber-50 rounded-2xl p-6 text-center overflow-hidden transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500 rounded-l-2xl z-10"></div>    
            <h4 className="text-sm font-semibold text-gray-600 mb-1 relative z-20">보통 위험군</h4>
            <p className="text-4xl font-bold text-amber-500 mb-2 relative z-20">{summary.mediumRate}%</p>
            <p className="text-sm text-gray-600 relative z-20">출석일수 3~6일</p>
        </div>

        <div className="relative bg-emerald-50 rounded-2xl p-6 text-center overflow-hidden transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 rounded-l-2xl z-10"></div>
            <h4 className="text-sm font-semibold text-gray-600 mb-1 relative z-20">낮음 위험군</h4>
            <p className="text-4xl font-bold text-emerald-500 mb-2 relative z-20">{summary.lowRate}%</p>
            <p className="text-sm text-gray-600 relative z-20">출석일수 7일 이상</p>
        </div>
    </div>


      {/* 인사이트 메시지 */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-l-4 border-blue-500 p-6 rounded-xl">
        <div className="flex items-start gap-3">
          <div>
            <h4 className="font-bold text-blue-900 text-lg mb-2">💡 분석 인사이트</h4>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>출석 일수가 2일 이하인 고객은 재방문 가능성이 매우 낮습다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>출석 일수가 3~6일 고객은 관리 전략에 따라 장기 고객으로 전환될 수 있습니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>출석 일수가 7일 이상인 고객은 장기 유지 고객군으로 분류할 수 있습니다.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChurnRiskSummary);


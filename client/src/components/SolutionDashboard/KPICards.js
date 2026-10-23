import React, { useMemo } from "react";
import { calculateKPIs } from "../../utils/utils";

const KPISection = ({ data }) => {
  const kpis = useMemo(() => {
    if (!data || data.length === 0) return null;
    return calculateKPIs(data);
  }, [data]);

  if (!data || data.length === 0 || !kpis) {
    return (
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200 mb-10">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">주요 KPI 요약</h3>
        <p className="text-gray-500">표시할 데이터가 없습니다.</p>
      </div>
    );
  }

  const cards = [
    {
      title: "총 고객 수",
      value: kpis.totalCustomers.toLocaleString(),
      unit: "명",
      desc: "전체 등록 고객",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      textColor: "text-blue-600",
    },
    {
      title: "평균 출석 일수",
      value: kpis.avgAttendance,
      unit: "일",
      desc: "고객 1인당 평균",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
      textColor: "text-emerald-600",
    },
    {
      title: "재구매율",
      value: kpis.repurchaseRate,
      unit: "%",
      desc: "90일 내 재구매",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-50 to-pink-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-10 rounded-3xl shadow-2xl border border-gray-200 mb-10">
      
      {/* 섹션 헤더 */}
      <h3 className="text-3xl font-black text-gray-900 mb-6">주요 KPI 요약</h3>
      <p className="text-gray-600 mb-8">
        전체 고객 데이터를 기반으로 핵심 지표를 한눈에 확인하세요.
      </p>

      {/* KPI 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((item, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
          >
            {/* 배경 그라데이션 */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-40 group-hover:opacity-60 transition-opacity`}></div>
            
            {/* 카드 내용 */}
            <div className="relative p-8">
              {/* 아이콘 */}
              <div className={`inline-flex p-4 bg-gradient-to-br ${item.gradient} rounded-2xl shadow-lg mb-6 text-white`}>
                {item.icon}
              </div>

              {/* 제목 */}
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                {item.title}
              </h4>

              {/* 값 */}
              <div className="flex items-baseline gap-2 mb-3">
                <p className="text-5xl font-black text-gray-900">
                  {item.value}
                </p>
                <span className="text-2xl font-bold text-gray-600">{item.unit}</span>
              </div>

              {/* 설명 */}
              <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 인사이트 섹션 */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-l-4 border-blue-500 p-6 rounded-xl">
        <div className="flex items-start gap-3">
          <div>
            <h4 className="font-bold text-blue-900 text-lg mb-2">💡 분석 인사이트</h4>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>출석 일수가 증가할수록 재구매율이 유의미하게 상승하는 경향을 보입니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>평균 출석 일수 향상을 위한 리텐션 전략이 효과적일 것으로 예상됩니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>재구매율이 낮은 고객군을 대상으로 맞춤형 마케팅 전략 수립이 필요합니다.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(KPISection);
// 위험 고객 테이블
// Top 10 이탈 위험 고객 목록 위험도별 색상 코딩된 테이블로 표시


import React, { useMemo } from "react";
import { getTopRiskCustomers } from "../../utils/utils";

/**
 * ChurnRiskList 컴포넌트 - 이탈 위험 고객 TOP 10
 * @param {object} props
 * @param {Array<Object>} props.data - 필터링된 고객 데이터
 */
const ChurnRiskList = ({ data }) => {
  // useMemo로 위험 고객 목록 계산 (data가 변경될 때만 재계산)
  const riskCustomers = useMemo(() => {
    if (!data || data.length === 0) return [];
    return getTopRiskCustomers(data, 10);
  }, [data]);

  // 데이터가 없을 때 처리
  if (!riskCustomers || riskCustomers.length === 0) {
    return (
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200 mb-10">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">⚠️ 이탈 위험 고객 TOP 10</h3>
        <p className="text-gray-500">표시할 데이터가 없습니다.</p>
      </div>
    );
  }

  // 위험도별 스타일 정의
  const getRiskStyle = (level) => {
    const styles = {
      HIGH: {
        bg: "bg-gradient-to-r from-red-500 to-rose-600",
        text: "text-white",
        badge: "🔴",
        label: "높음",
        ring: "ring-2 ring-red-200"
      },
      MEDIUM: {
        bg: "bg-gradient-to-r from-amber-500 to-orange-600",
        text: "text-white",
        badge: "🟡",
        label: "보통",
        ring: "ring-2 ring-amber-200"
      },
      LOW: {
        bg: "bg-gradient-to-r from-emerald-500 to-teal-600",
        text: "text-white",
        badge: "🟢",
        label: "낮음",
        ring: "ring-2 ring-emerald-200"
      }
    };
    return styles[level] || styles.LOW;
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-10 rounded-3xl shadow-2xl border border-gray-200 mb-10">

      {/* 섹션 헤더 */}
      <h3 className="text-3xl font-black text-gray-900 mb-6">⚠️ 이탈 위험 고객 TOP 10</h3>
      <p className="text-gray-600 mb-8">
        최근 90일간 재구매가 없는 고객 중 위험도가 가장 높은 10명을 확인하세요.
      </p>

      {/* 테이블 영역 */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            {/* 테이블 헤더 */}
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
              <tr>
                <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300">
                  순위
                </th>
                <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300">
                  고객 ID
                </th>
                <th className="py-4 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300">
                  출석 일수
                </th>
                <th className="py-4 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300">
                  체류시간
                </th>
                <th className="py-4 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300">
                  결제금액
                </th>
                <th className="py-4 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300">
                  위험도
                </th>
              </tr>
            </thead>

            {/* 테이블 바디 */}
            <tbody className="divide-y divide-gray-200">
              {riskCustomers.map((customer, idx) => {
                const style = getRiskStyle(customer.riskLevel);
                return (
                  <tr
                    key={customer.uid || idx}
                    className={`
                      ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      hover:bg-blue-50 transition-colors duration-150
                    `}
                  >
                    {/* 순위 */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center font-bold text-gray-700 text-sm">
                          {idx + 1}
                        </div>
                      </div>
                    </td>

                    {/* 고객 ID */}
                    <td className="py-4 px-6">
                      <span className="font-mono font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                        {customer.uid}
                      </span>
                    </td>

                    {/* 출석 일수 */}
                    <td className="py-4 px-6 text-center">
                      <span className="text-lg font-bold text-gray-900">
                        {customer.visit_days || 0}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">일</span>
                    </td>

                    {/* 체류시간 */}
                    <td className="py-4 px-6 text-center">
                      <span className="text-lg font-bold text-gray-900">
                        {(customer.total_duration_min || 0).toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">분</span>
                    </td>

                    {/* 결제금액 */}
                    <td className="py-4 px-6 text-center">
                      <span className="text-lg font-bold text-gray-900">
                        {((customer.total_payment_may || 0) / 10000).toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">만원</span>
                    </td>

                    {/* 위험도 */}
                    <td className="py-4 px-6 text-center">
                      <span className={`
                        inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm
                        ${style.bg} ${style.text} ${style.ring} shadow-md
                      `}>
                        <span>{style.badge}</span>
                        {style.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 인사이트 섹션 */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-l-4 border-blue-500 p-6 rounded-xl">
        <div className="flex items-start gap-3">
          <div>
            <h4 className="font-bold text-blue-900 text-lg mb-2">💡 분석 인사이트</h4>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>고위험군:</strong> 즉시 개인화된 할인 쿠폰 및 리마인드 메시지 발송</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>중위험군:</strong> 맞춤형 이벤트 초대 및 뉴스레터 발송으로 관심 유도</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>저위험군:</strong> 정기적인 고객 만족도 조사로 이탈 신호 조기 감지</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// React.memo로 불필요한 리렌더링 방지
export default React.memo(ChurnRiskList);
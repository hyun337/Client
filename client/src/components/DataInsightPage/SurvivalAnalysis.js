// 생존 분석 시각화
// 출석 빈도 그룹별 Kaplan-Meier 생존 곡선 시각화


import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// 컴포넌트 외부로 이동 (매번 재생성 방지)
const getAttendanceGroup = (visitDays) => {
  if (visitDays <= 2) return "Low (저빈도)";
  if (visitDays <= 5) return "Mid (중빈도)";
  return "High (고빈도)";
};

// 색상도 상수로 분리
const COLORS = {
  "Low (저빈도)": "#f97316",
  "Mid (중빈도)": "#22c55e",
  "High (고빈도)": "#6366f1",
};

function SurvivalAnalysis({ data }) {
  // Kaplan-Meier 생존율 계산 
  const kmData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const groups = { 
      "Low (저빈도)": [], 
      "Mid (중빈도)": [], 
      "High (고빈도)": [] 
    };
    
    data.forEach((d) => {
      const group = getAttendanceGroup(d.visit_days || 0);
      groups[group].push(d);
    });

    const months = ["6월", "7월", "8월"];
    const keys = ["retained_june", "retained_july", "retained_august"];

    // 월별로 Low, Mid, High를 한 객체에 병합
    const merged = months.map((month, i) => {
      const row = { month };
      Object.keys(groups).forEach((g) => {
        const total = groups[g].length;
        const survivors = groups[g].filter((c) => c[keys[i]] === 1).length;
        row[g] = total > 0 ? survivors / total : 0;
      });
      return row;
    });

    return merged;
  }, [data]);

  // 그룹별 평균 생존율 계산
  const groupAverages = useMemo(() => {
    if (!kmData.length) return {};
    const avg = {};
    ["Low (저빈도)", "Mid (중빈도)", "High (고빈도)"].forEach((g) => {
      const vals = kmData.map((m) => m[g]);
      avg[g] = (vals.reduce((a, b) => a + b, 0) / vals.length) * 100;
    });
    return avg;
  }, [kmData]);

  // 평균 생존율 중 최고 그룹
  const bestGroup = useMemo(() => {
    const groups = Object.keys(groupAverages);
    if (groups.length === 0) return "-";
    return groups.reduce((a, b) => 
      (groupAverages[a] > groupAverages[b] ? a : b), 
      groups[0]
    );
  }, [groupAverages]);

  // 빈 데이터 처리
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          출석 빈도별 고객 생존(재구매 유지) 분석
        </h2>
        <p className="text-gray-500">표시할 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      {/* 제목 + 설명 */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        출석 빈도별 고객 생존(재구매 유지) 분석
      </h2>
      <p className="text-gray-600 mb-6">
        출석 빈도(Low, Mid, High)에 따른 월별 재구매 유지율을 Kaplan-Meier 방식으로 비교합니다.
        출석이 많을수록 고객의 장기 유지율이 높게 나타납니다.
      </p>

      {/* 카드 요약 섹션 */}
      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-orange-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500">저빈도 그룹 평균 생존율</p>
          <p className="text-2xl font-bold text-orange-500">
            {groupAverages["Low (저빈도)"]?.toFixed(1) || 0}%
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500">중빈도 그룹 평균 생존율</p>
          <p className="text-2xl font-bold text-green-600">
            {groupAverages["Mid (중빈도)"]?.toFixed(1) || 0}%
          </p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500">고빈도 그룹 평균 생존율</p>
          <p className="text-2xl font-bold text-indigo-600">
            {groupAverages["High (고빈도)"]?.toFixed(1) || 0}%
          </p>
        </div>
      </div>

      {/* Kaplan-Meier 생존곡선 */}
      <div className="h-[360px] bg-gray-50 p-4 rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={kmData}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              label={{
                value: "경과 기간 (월)",
                position: "insideBottom",
                offset: -5,
              }}
              stroke="#6b7280"
            />
            <YAxis
              domain={[0, 1]}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
              label={{
                value: "생존 확률",
                angle: -90,
                position: "insideLeft",
              }}
              stroke="#6b7280"
            />
            <Tooltip
              formatter={(v) => `${(v * 100).toFixed(1)}%`}
              labelFormatter={(v) => `${v}`}
            />
            <Legend />

            {Object.keys(COLORS).map((group) => (
              <Line
                key={group}
                type="monotone"
                dataKey={group}
                stroke={COLORS[group]}
                strokeWidth={2.8}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name={group}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 최고 성과 그룹 강조 */}
      <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
        <p className="font-semibold text-indigo-700 mb-2"> 최고 성과 그룹</p>
        <p className="text-2xl font-bold text-indigo-600">
          {bestGroup} - {groupAverages[bestGroup]?.toFixed(1)}%
        </p>
      </div>

      {/* 분석 인사이트 */}
      <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <p className="font-semibold text-blue-700">💡 분석 인사이트</p>
        <ul className="list-disc pl-6 text-gray-700 text-sm mt-2">
          <li>고빈도 고객일수록 장기적인 생존(재구매 유지) 확률이 높습니다.</li>
          <li>저빈도 그룹은 초기 이탈률이 높아 리텐션 관리가 필요합니다.</li>
          <li>중빈도 이상 고객에게 장기 혜택 제공 시 재방문율 향상을 기대할 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}

// 불필요한 리렌더링 방지
export default React.memo(SurvivalAnalysis);
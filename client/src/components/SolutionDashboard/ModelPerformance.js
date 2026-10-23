// 모델 성능 지표
// 정확도, 정밀도, 재현율 반원 게이지 차트로 시각화


import React from "react";
import { PieChart, Pie, Cell } from "recharts";

/**
 * ModelPerformance 컴포넌트 - 예측 모델 성능 지표 시각화 
 * @param {object} props
 * @param {Array<Object>} props.data - 전체 고객 데이터 
 */

const ModelPerformance = ({ metrics }) => {
  // 기본 데이터
  const data = metrics || {
    accuracy: 0.94,
    precision: 0.89,
    recall: 0.82,
  };

  // 색상
  const COLORS = {
    accuracy: "#6366F1", // 파랑
    precision: "#22C55E", // 초록
    recall: "#A855F7", // 보라
    bg: "#E5E7EB", // 회색 (게이지 배경색)
  };

  // 게이지용 데이터 구성 함수
  const buildGauge = (value, label, color) => [
    { name: label, value: value * 100 },
    { name: "remain", value: 100 - value * 100 },
  ];

  //랜더링 영역
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-10">
      {/* 섹션 제목 및 설명 */}
      <h3 className="text-3xl font-black text-gray-900 mb-6">모델 성능 지표</h3>
      <p className="text-gray-600 mb-8">
        예측 모델의 주요 성능 지표를 신뢰도 있게 확인하세요.  
      </p>

      {/* 게이지 표시 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {[
          { label: "정확도 (Accuracy)", key: "accuracy", color: COLORS.accuracy },
          { label: "정밀도 (Precision)", key: "precision", color: COLORS.precision },
          { label: "재현율 (Recall)", key: "recall", color: COLORS.recall },
        ].map((metric, idx) => (
          <div
            key={idx}
            className="p-6 rounded-lg border-l-4 border-gray-200 bg-gray-50
                       transition-transform hover:scale-[1.02] hover:shadow-md
                       flex flex-col items-center justify-center"
          >
            {/* 게이지 차트 */}
            <div className="flex justify-center -mt-3 mb-2">
              <PieChart width={160} height={100}>
                <Pie
                  data={buildGauge(data[metric.key], metric.label, metric.color)}
                  startAngle={180}
                  endAngle={0}
                  innerRadius={55}
                  outerRadius={70}
                  dataKey="value"
                  cx="50%"
                  cy="100%"
                >
                  <Cell key="filled" fill={metric.color} />
                  <Cell key="remain" fill={COLORS.bg} />
                </Pie>
              </PieChart>
            </div>

            {/* 수치 표시 */}
            <p className="text-3xl font-bold mt-2" style={{ color: metric.color }}>
              {(data[metric.key] * 100).toFixed(1)}%
            </p>
            <p className="text-sm font-semibold text-gray-700 mt-1">
              {metric.label}
            </p>
          </div>
        ))}
      </div>

      {/* 설명 영역 */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-l-4 border-blue-500 p-6 rounded-xl">
        <div className="flex items-start gap-3">
          <div>
            <h4 className="font-bold text-blue-900 text-lg mb-2">💡 분석 인사이트</h4>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>정확도(Accuracy):</strong> 전체 중 예측이 맞은 비율</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>정밀도(Precision):</strong> 긍정 예측 중 실제로 맞은 비율</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>재현율(Recall)</strong> 실제 긍정 중 예측이 잘 잡아낸 비율</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ModelPerformance);

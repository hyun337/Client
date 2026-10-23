// 상관관계 시각화
// 체류시간-결제금액 간 산점도 표시, 상관계수 출력


import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getCorrelationAnalysisData } from '../../utils/utils.js';

const CorrelationDashboard = ({ data }) => {
  // useMemo를 최상단에서 호출 (조건문 밖)
  const analysisData = useMemo(() => {
    if (!data || data.length === 0) {
      return { scatterData: [], pearson: '0.00', spearman: '0.00' };
    }
    return getCorrelationAnalysisData(data);
  }, [data]);

  const { scatterData, pearson, spearman } = analysisData;

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-xl border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-1">
            고객 ID: {data.id}
          </p>
          <p className="text-sm text-gray-600">
            체류시간: <span className="font-bold text-indigo-600">{data.x}분</span>
          </p>
          <p className="text-sm text-gray-600">
            결제금액: <span className="font-bold text-green-600">{data.y.toLocaleString()}원</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // 데이터 없을 때 처리
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          체류시간-결제금액 상관관계 분석
        </h3>
        <p className="text-gray-500">표시할 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        체류시간-결제금액 상관관계 분석
      </h3>

      <p className="text-gray-600 mb-6">
        고객의 매장 체류 시간과 결제 금액 간의 상관관계를 분석합니다. 
        양의 상관관계가 높을수록 체류 시간이 구매 의사결정에 긍정적 영향을 미칩니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">분석 데이터 수</div>
          <div className="text-3xl font-bold text-indigo-600">
            {scatterData.length.toLocaleString()}
            <span className="text-lg text-gray-500 ml-1">건</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">
            Pearson 상관계수
            <span className="ml-1 text-xs text-gray-400">(선형 관계)</span>
          </div>
          <div className="text-3xl font-bold text-purple-600">{pearson}</div>
          <div className="text-xs text-gray-500 mt-1">
            {parseFloat(pearson) >= 0.7 ? '강한 양의 상관관계' : 
             parseFloat(pearson) >= 0.4 ? '중간 정도의 양의 상관관계' : '약한 상관관계'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">
            Spearman 상관계수
            <span className="ml-1 text-xs text-gray-400">(순위 관계)</span>
          </div>
          <div className="text-3xl font-bold text-green-600">{spearman}</div>
          <div className="text-xs text-gray-500 mt-1">
            {parseFloat(spearman) >= 0.7 ? '강한 순위 상관관계' : 
             parseFloat(spearman) >= 0.4 ? '중간 정도의 순위 상관관계' : '약한 상관관계'}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="체류시간" 
              unit="분"
              label={{ value: '체류시간 (분)', position: 'insideBottom', offset: -10 }}
              stroke="#6b7280"
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="결제금액" 
              unit="원"
              label={{ value: '결제금액 (원)', angle: -90, position: 'insideLeft' }}
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Scatter 
              name="고객 데이터" 
              data={scatterData} 
              fill="#4f46e5"
              fillOpacity={0.6}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <h4 className="font-bold text-blue-900 mb-2">💡 분석 인사이트</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 체류 시간이 길수록 결제 금액이 증가하는 경향이 관찰됩니다.</li>
          <li>• 매장 체험 개선을 통해 체류 시간을 늘리면 매출 증대가 가능합니다.</li>
          <li>• 짧은 체류 시간에도 고액 결제가 발생하는 이상치 고객에 주목하세요.</li>
        </ul>
      </div>
    </div>
  );
};

export default React.memo(CorrelationDashboard);
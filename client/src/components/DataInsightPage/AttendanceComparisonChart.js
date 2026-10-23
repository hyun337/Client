// 출석 빈도 비교
// 출석 빈도 구간별 재구매율 바 차트로 비교

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { getAttendanceComparisonData } from '../../utils/utils';

/**
 * 출석 빈도별 재구매율 비교 차트
 * @param {object} props
 * @param {Array} props.data - 필터링된 고객 데이터
 */
const AttendanceComparisonChart = ({ data }) => {
  // useMemo로 차트 데이터 계산 최적화
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return getAttendanceComparisonData(data);
  }, [data]);

  // 그룹별 색상 정의
  const COLORS = {
    LOW: '#ef4444',    // 빨강 (low)
    MID: '#f59e0b',    // 주황 (mid)
    HIGH: '#10b981'    // 초록 (high)
  };

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="text-sm font-bold text-gray-800 mb-2">
            {data.group === 'LOW' ? '저빈도' : data.group === 'MID' ? '중빈도' : '고빈도'} 그룹
          </p>
          <p className="text-sm text-gray-600">
            재구매율: <span className="font-bold text-indigo-600">{data['재구매율 (%)']}%</span>
          </p>
          <p className="text-sm text-gray-600">
            고객 수: <span className="font-bold text-gray-700">{data['고객 수'].toLocaleString()}명</span>
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
          출석 빈도별 재구매율 비교
        </h3>
        <p className="text-gray-500">표시할 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        출석 빈도별 재구매율 비교
      </h3>

      <p className="text-gray-600 mb-6">
        고객의 출석 빈도를 저빈도(1-2일), 중빈도(3-5일), 고빈도(6일 이상)로 구분하여 
        각 그룹의 재구매율을 비교합니다.
      </p>

      {/* 통계 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {chartData.map((item) => (
          <div 
            key={item.group}
            className="p-4 rounded-lg border-l-4"
            style={{ 
              backgroundColor: `${COLORS[item.group]}10`,
              borderColor: COLORS[item.group]
            }}
          >
            <div className="text-sm text-gray-600 mb-1">
              {item.group === 'LOW' ? '저빈도 (1-2일)' : 
               item.group === 'MID' ? '중빈도 (3-5일)' : 
               '고빈도 (6일+)'}
            </div>
            <div className="text-3xl font-bold mb-1" style={{ color: COLORS[item.group] }}>
              {item['재구매율 (%)']}%
            </div>
            <div className="text-xs text-gray-500">
              {item['고객 수'].toLocaleString()}명의 고객
            </div>
          </div>
        ))}
      </div>

      {/* 막대 차트 */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={chartData}
            margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="group" 
              stroke="#6b7280"
              tickFormatter={(value) => 
                value === 'LOW' ? '저빈도' : 
                value === 'MID' ? '중빈도' : 
                '고빈도'
              }
            />
            <YAxis 
              stroke="#6b7280"
              label={{ 
                value: '재구매율 (%)', 
                angle: -90, 
                position: 'insideLeft' 
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36}
              formatter={() => '재구매율'}
            />
            <Bar 
              dataKey="재구매율 (%)" 
              radius={[8, 8, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.group]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 인사이트 섹션 */}
      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <h4 className="font-bold text-blue-900 mb-2">💡 분석 인사이트</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 출석 빈도가 높을수록 재구매율이 증가하는 경향이 있습니다.</li>
          <li>• 저빈도 고객을 중빈도로 전환하면 재구매율을 크게 향상시킬 수 있습니다.</li>
          <li>• 고빈도 고객 유지를 위한 로열티 프로그램이 효과적입니다.</li>
        </ul>
      </div>
    </div>
  );
};

// React.memo로 불필요한 리렌더링 방지
export default React.memo(AttendanceComparisonChart);
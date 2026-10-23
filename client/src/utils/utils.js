// 통계 및 데이터 가공 로직
// 상관계수 계산: 체류시간-결제금액 간 상관계수 정량적으로 계산
// KPI 계산: 총 고객 수, 재구매율 등 핵심 지표 산출
// 위험도 분석: 이탈 고객 중 위험 점수 계산해 상위 10명 분류


import { ATTENDANCE_GROUPS_OPTIONS, RISK_LEVELS } from '../data/constants';

// ====================================================================
// A. 데이터 필터링 및 전처리 함수(App.js에서 사용)
// ====================================================================

/**
 * 고객 데이터를 주어진 체류 시간(duration) 기준으로 필터링
 * @param {Array<Object>} customers - 전체 고객 데이터
 * @param {number} minDuration - 최소 체류 시간(분) (0은 전체)
 * @returns {Array<Object>} - 필터링된 고객 데이터
 */
export const filterCustomersByDuration = (customers, minDuration) => {
  if (minDuration === 0) {
    return customers;
  }
  return customers.filter(customer => customer.total_duration_min >= minDuration);
};

// ====================================================================
// B. 통계 계산 함수 (상관계수)
// ====================================================================

/**
 * Pearson 상관계수 계산
 * @param {Array<Object>} data - 고객 데이터
 * @returns {number} - Pearson 상관계수
 */
export const calculatePearson = (data) => {
  if (!data || data.length < 2) return 0;
  
  const n = data.length;
  const x = data.map(d => d.total_duration_min || 0);
  const y = data.map(d => d.total_payment_may || 0);
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  if (denominator === 0) return 0;
  return numerator / denominator;
};

/**
 * Spearman 순위 상관계수 계산
 * @param {Array<Object>} data - 고객 데이터
 * @returns {number} - Spearman 상관계수
 */
export const calculateSpearman = (data) => {
  if (!data || data.length < 2) return 0;
  
  // 순위 매기기 함수
  const getRanks = (arr) => {
    const sorted = arr.map((v, i) => ({ value: v, index: i }))
                     .sort((a, b) => a.value - b.value);
    const ranks = new Array(arr.length);
    sorted.forEach((item, rank) => {
      ranks[item.index] = rank + 1;
    });
    return ranks;
  };
  
  const x = data.map(d => d.total_duration_min || 0);
  const y = data.map(d => d.total_payment_may || 0);
  
  const rankX = getRanks(x);
  const rankY = getRanks(y);
  
  // Pearson 공식을 순위에 적용
  const n = data.length;
  const sumRankX = rankX.reduce((a, b) => a + b, 0);
  const sumRankY = rankY.reduce((a, b) => a + b, 0);
  const sumRankXY = rankX.reduce((sum, rx, i) => sum + rx * rankY[i], 0);
  const sumRankX2 = rankX.reduce((sum, rx) => sum + rx * rx, 0);
  const sumRankY2 = rankY.reduce((sum, ry) => sum + ry * ry, 0);
  
  const numerator = n * sumRankXY - sumRankX * sumRankY;
  const denominator = Math.sqrt((n * sumRankX2 - sumRankX * sumRankX) * (n * sumRankY2 - sumRankY * sumRankY));
  
  if (denominator === 0) return 0;
  return numerator / denominator;
};

// ====================================================================
// C. 데이터 인사이트 페이지용 통계 함수
// ====================================================================

/**
 * CorrelationDashboard(상관관계 분석)에 필요한 데이터를 가공
 * @param {Array<Object>} data - 필터링된 고객 데이터
 * @returns {object} - { scatterData: Array, pearson: string, spearman: string }
 */
export const getCorrelationAnalysisData = (data) => {
  // 1. 산점도 데이터 추출
  const scatterData = data.map(customer => ({
    x: customer.total_duration_min, // X축: 체류 시간
    y: customer.total_payment_may, // Y축: 결제 금액
    id: customer.uid // 고객 ID
  }));

  // 2. 실제 상관계수 계산
  const pearson = calculatePearson(data);
  const spearman = calculateSpearman(data);

  return { 
    scatterData, 
    pearson: pearson.toFixed(2), 
    spearman: spearman.toFixed(2) 
  };
};

/**
 * AttendanceComparisonChart(출석 빈도 비교)에 필요한 데이터 계산
 * @param {Array<Object>} data - 필터링된 고객 데이터
 * @returns {Array<Object>} - 그룹별 재구매율 데이터
 */
export const getAttendanceComparisonData = (data) => {
  if (!data || data.length === 0) return [];
  
  // 그룹 분류 기준 상수
  const VISIT_THRESHOLDS = {
    LOW: 2,
    HIGH: 6
  };
  
  // 그룹 분류 함수
  const classifyGroup = (visitDays) => {
    if (visitDays <= VISIT_THRESHOLDS.LOW) return 'low';
    if (visitDays >= VISIT_THRESHOLDS.HIGH) return 'high';
    return 'mid';
  };

  // reduce로 그룹별 집계
  const groupedResults = data.reduce((acc, customer) => {
    const group = classifyGroup(customer.visit_days || 0);
    acc[group].total++;
    if (customer.retained_90 === 1) {
      acc[group].repurchased++;
    }
    return acc;
  }, {
    low: { total: 0, repurchased: 0 },
    mid: { total: 0, repurchased: 0 },
    high: { total: 0, repurchased: 0 }
  });

  // 최종 차트 데이터 포맷으로 변환 (순서 보장)
  return ['low', 'mid', 'high'].map(group => {
    const { total, repurchased } = groupedResults[group];
    const rate = total > 0 ? (repurchased / total) * 100 : 0;
    
    return {
      group: group.toUpperCase(),
      '재구매율 (%)': parseFloat(rate.toFixed(1)),
      '고객 수': total
    };
  });
};


// ====================================================================
// D. 솔루션 대시보드용 통계 함수
// ====================================================================

/**
 * KPICards(핵심 지표)에 필요한 주요 통계 값 계산
 * @param {Array<Object>} allData - 전체 고객 데이터
 * @returns {object} - 주요 KPI 값
 */
export const calculateKPIs = (allData) => {
  if (!allData || allData.length === 0) {
    return {
      totalCustomers: 0,
      avgAttendance: '0.0',
      repurchaseRate: '0.0',
      avgPayment: '0'
    };
  }

  const totalCustomers = allData.length;
  const totalRepurchased = allData.filter(c => c.retained_90 === 1).length;
  
  // 평균 출석 일수 계산(visit_days 사용)
  const totalAttendanceDays = allData.reduce((sum, c) => sum + (c.visit_days || 0), 0);
  const avgAttendance = totalCustomers > 0 ? totalAttendanceDays / totalCustomers : 0;
  
  // 재구매율
  const repurchaseRate = totalCustomers > 0 
    ? (totalRepurchased / totalCustomers * 100).toFixed(1) 
    : '0.0';
  
  // 평균 결제 금액(total_payment_may 사용)
  const totalPayment = allData.reduce((sum, c) => sum + (c.total_payment_may || 0), 0);
  const avgPayment = totalCustomers > 0 ? totalPayment / totalCustomers : 0;

  return {
    totalCustomers: totalCustomers,
    avgAttendance: avgAttendance.toFixed(1),
    repurchaseRate: repurchaseRate,
    avgPayment: avgPayment.toFixed(0),
  };
};

/**
 * ChurnRiskList(이탈 위험 고객 목록)에 필요한 데이터를 가공
 * @param {Array<Object>} data - 필터링된 고객 데이터
 * @param {number} limit - 표시할 최대 고객 수
 * @returns {Array<Object>} - 위험 고객 목록
 */
export const getTopRiskCustomers = (data, limit = 10) => {
  if (!data || data.length === 0) return [];
  
  const churned = data.filter(c => c.retained_90 === 0);
  if (churned.length === 0) return [];

  // 위험도 점수 계산 함수
  const calculateRiskScore = (customer) => {
    const { visit_days = 0, total_duration_min = 0, total_payment_may = 0 } = customer;
    
    const visitScore = visit_days <= 1 ? 50 : 
                       visit_days <= 3 ? 35 : 
                       visit_days <= 5 ? 15 : 5;
    
    const durationScore = total_duration_min <= 100 ? 30 : 
                          total_duration_min <= 300 ? 20 : 
                          total_duration_min <= 600 ? 10 : 5;
    
    const paymentScore = total_payment_may <= 5000 ? 20 : 
                         total_payment_may <= 15000 ? 10 : 5;
    
    return visitScore + durationScore + paymentScore;
  };

  const scored = churned.map(c => ({
    ...c,
    riskScore: calculateRiskScore(c)
  }));

  // 상대적 분포로 위험도 분류
  const scores = scored.map(c => c.riskScore).sort((a, b) => a - b);
  const getPercentile = (p) => scores[Math.floor(scores.length * p)] || 0;
  
  const p80 = getPercentile(0.8);
  const p50 = getPercentile(0.5);

  const labeled = scored.map(c => ({
    ...c,
    riskLevel: c.riskScore >= p80 ? "HIGH" : 
               c.riskScore >= p50 ? "MEDIUM" : "LOW"
  }));

  return labeled.sort((a, b) => b.riskScore - a.riskScore).slice(0, limit);
};
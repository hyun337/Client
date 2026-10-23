const analytics = {
  // Pearson 상관계수 계산
  calculatePearson: (data) => {
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
    
    return denominator === 0 ? 0 : numerator / denominator;
  },

  // Spearman 상관계수 계산
  calculateSpearman: (data) => {
    if (!data || data.length < 2) return 0;
    
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
    
    const n = data.length;
    const sumRankX = rankX.reduce((a, b) => a + b, 0);
    const sumRankY = rankY.reduce((a, b) => a + b, 0);
    const sumRankXY = rankX.reduce((sum, rx, i) => sum + rx * rankY[i], 0);
    const sumRankX2 = rankX.reduce((sum, rx) => sum + rx * rx, 0);
    const sumRankY2 = rankY.reduce((sum, ry) => sum + ry * ry, 0);
    
    const numerator = n * sumRankXY - sumRankX * sumRankY;
    const denominator = Math.sqrt((n * sumRankX2 - sumRankX * sumRankX) * (n * sumRankY2 - sumRankY * sumRankY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  },

  // 출석 빈도별 재구매율 계산
  getAttendanceComparison: (data) => {
    const groupedResults = {
      low: { total: 0, repurchased: 0 },
      mid: { total: 0, repurchased: 0 },
      high: { total: 0, repurchased: 0 }
    };

    data.forEach(customer => {
      let group = 'mid';
      if (customer.visit_days <= 2) group = 'low';
      else if (customer.visit_days >= 6) group = 'high';
      
      groupedResults[group].total++;
      if (customer.retained_90 === 1) {
        groupedResults[group].repurchased++;
      }
    });

    return ['low', 'mid', 'high'].map(group => {
      const { total, repurchased } = groupedResults[group];
      const rate = total > 0 ? (repurchased / total) * 100 : 0;
      
      return {
        group: group.toUpperCase(),
        rate: parseFloat(rate.toFixed(1)),
        total
      };
    });
  },

  // 이탈 위험 고객 계산
  getTopRiskCustomers: (data, limit = 10) => {
    const churned = data.filter(c => c.retained_90 === 0);
    
    const scored = churned.map(c => {
      const visitScore = c.visit_days <= 1 ? 50 : 
                         c.visit_days <= 3 ? 35 : 
                         c.visit_days <= 5 ? 15 : 5;
      
      const durationScore = c.total_duration_min <= 100 ? 30 : 
                            c.total_duration_min <= 300 ? 20 : 
                            c.total_duration_min <= 600 ? 10 : 5;
      
      const paymentScore = c.total_payment_may <= 5000 ? 20 : 
                           c.total_payment_may <= 15000 ? 10 : 5;
      
      return {
        ...c,
        riskScore: visitScore + durationScore + paymentScore
      };
    });

    const scores = scored.map(c => c.riskScore).sort((a, b) => a - b);
    const p80 = scores[Math.floor(scores.length * 0.8)] || 0;
    const p50 = scores[Math.floor(scores.length * 0.5)] || 0;

    const labeled = scored.map(c => ({
      ...c,
      riskLevel: c.riskScore >= p80 ? "HIGH" : 
                 c.riskScore >= p50 ? "MEDIUM" : "LOW"
    }));

    return labeled
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, limit);
  }
};

module.exports = analytics;
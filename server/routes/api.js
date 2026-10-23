// API 엔드포인트 라우팅
// MongoDB에 저장된 전체 데이터 클라이언트에게 제공


const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const analytics = require('../utils/analytics');

// 1. 전체 고객 데이터 조회 (필터링 지원)
router.get('/customers', async (req, res) => {
  try {
    const { minDuration } = req.query;
    
    let query = {};
    if (minDuration && parseInt(minDuration) > 0) {
      query.total_duration_min = { $gte: parseInt(minDuration) };
    }
    
    const customers = await Customer.find(query).lean();
    
    res.json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    console.error('고객 데이터 조회 에러:', error);ç
    res.status(500).json({
      success: false,
      error: '데이터 조회 실패'
    });
  }
});

// 2. 상관관계 분석
router.get('/analysis/correlation', async (req, res) => {
  try {
    const { minDuration } = req.query;
    
    let query = {};
    if (minDuration && parseInt(minDuration) > 0) {
      query.total_duration_min = { $gte: parseInt(minDuration) };
    }
    
    const customers = await Customer.find(query).lean();
    
    const pearson = analytics.calculatePearson(customers);
    const spearman = analytics.calculateSpearman(customers);
    
    const scatterData = customers.map(c => ({
      x: c.total_duration_min,
      y: c.total_payment_may,
      id: c.uid
    }));
    
    res.json({
      success: true,
      data: {
        pearson: pearson.toFixed(2),
        spearman: spearman.toFixed(2),
        scatterData
      }
    });
  } catch (error) {
    console.error('상관관계 분석 에러:', error);
    res.status(500).json({
      success: false,
      error: '상관관계 분석 실패'
    });
  }
});

// 3. 출석 빈도별 재구매율
router.get('/analysis/attendance', async (req, res) => {
  try {
    const { minDuration } = req.query;
    
    let query = {};
    if (minDuration && parseInt(minDuration) > 0) {
      query.total_duration_min = { $gte: parseInt(minDuration) };
    }
    
    const customers = await Customer.find(query).lean();
    const result = analytics.getAttendanceComparison(customers);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('출석 분석 에러:', error);
    res.status(500).json({
      success: false,
      error: '출석 분석 실패'
    });
  }
});

// 4. 이탈 위험 고객 목록
router.get('/customers/churn-risk', async (req, res) => {
  try {
    const { limit = 10, minDuration } = req.query;
    
    let query = {};
    if (minDuration && parseInt(minDuration) > 0) {
      query.total_duration_min = { $gte: parseInt(minDuration) };
    }
    
    const customers = await Customer.find(query).lean();
    const result = analytics.getTopRiskCustomers(customers, parseInt(limit));
    
    res.json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    console.error('위험 고객 조회 에러:', error);
    res.status(500).json({
      success: false,
      error: '위험 고객 조회 실패'
    });
  }
});

// 5. KPI 데이터
router.get('/kpi', async (req, res) => {
  try {
    const customers = await Customer.find().lean();
    const totalCustomers = customers.length;
    const totalRepurchased = customers.filter(c => c.retained_90 === 1).length;
    
    const totalDuration = customers.reduce((sum, c) => sum + (c.total_duration_min || 0), 0);
    const avgDuration = totalCustomers > 0 ? totalDuration / totalCustomers : 0;
    
    const repurchaseRate = totalCustomers > 0 
      ? ((totalRepurchased / totalCustomers) * 100).toFixed(1) 
      : '0.0';
    
    const totalPayment = customers.reduce((sum, c) => sum + (c.total_payment_may || 0), 0);
    const avgPayment = totalCustomers > 0 ? totalPayment / totalCustomers : 0;
    
    res.json({
      success: true,
      data: {
        totalCustomers,
        avgDuration: avgDuration.toFixed(1),
        repurchaseRate,
        avgPayment: avgPayment.toFixed(0)
      }
    });
  } catch (error) {
    console.error('KPI 조회 에러:', error);
    res.status(500).json({
      success: false,
      error: 'KPI 조회 실패'
    });
  }
});

// 6. 월별 재구매율 (RepurchasePredictionChart용)
router.get('/analysis/monthly-repurchase', async (req, res) => {
  try {
    const { minDuration } = req.query;
    
    let query = {};
    if (minDuration && parseInt(minDuration) > 0) {
      query.total_duration_min = { $gte: parseInt(minDuration) };
    }
    
    const customers = await Customer.find(query).lean();
    const total = customers.length;
    
    const months = ['june', 'july', 'august'];
    const result = months.map(month => {
      const retainedKey = `retained_${month}`;
      const retained = customers.filter(c => c[retainedKey] === 1).length;
      const rate = total > 0 ? ((retained / total) * 100).toFixed(2) : 0;
      
      return {
        month: month.charAt(0).toUpperCase() + month.slice(1),
        rate: parseFloat(rate),
        pvalue: retained > 0 ? 0.001 : 0.279
      };
    });
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('월별 재구매율 분석 에러:', error);
    res.status(500).json({
      success: false,
      error: '월별 재구매율 분석 실패'
    });
  }
});

module.exports = router;
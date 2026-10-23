//  서버 및 미들웨어 설정
//  MongoDB 연결
//  Api 라우트 요청 분배

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 기본 라우트 
app.get('/', (req, res) => {
  res.json({
    message: '🚀 고객 데이터 분석 API 서버',
    version: '1.0.0',
    endpoints: {
      customers: '/api/customers',
      correlation: '/api/analysis/correlation',
      attendance: '/api/analysis/attendance',
      churnRisk: '/api/customers/churn-risk',
      kpi: '/api/kpi',
      monthlyRepurchase: '/api/analysis/monthly-repurchase'
    }
  });
});

// API 라우트 (이건 그 다음)
app.use('/api', apiRoutes);

// 404 에러 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '요청한 API를 찾을 수 없습니다'
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: '서버 오류가 발생했습니다'
  });
});

// 서버 시작
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ 서버가 포트 ${PORT}에서 실행 중입니다`);
    console.log(`API 문서: http://localhost:${PORT}`);
  });
});
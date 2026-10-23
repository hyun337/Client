const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const customersData = require('../data/customers.json');

const importData = async () => {
  try {
    // .env 파일 로드 확인
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI가 .env 파일에 없습니다!');
    }

    console.log('MongoDB URI:', process.env.MONGODB_URI); // 디버깅용

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB 연결 성공');
    
    await Customer.deleteMany({});
    console.log('기존 데이터 삭제 완료');
    
    await Customer.insertMany(customersData);
    console.log(`✅ ${customersData.length}개 데이터 import 완료`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 데이터 import 실패:', error);
    process.exit(1);
  }
};

importData();
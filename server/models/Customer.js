// MongoDB  스키마 정의
// Mongoose 스키마 생성
// 데이터 조회 성능 향상 위해 인덱스 설정

const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  uid: {
    type: Number,
    required: true,
    unique: true
  },
  region_city_group: String,
  region_city_group_no: Number,
  region_city: String,
  age_group: String,
  age: Number,
  visit_days: {
    type: Number,
    default: 0
  },
  total_duration_min: {
    type: Number,
    default: 0
  },
  avg_duration_min: Number,
  total_payment_may: {
    type: Number,
    default: 0
  },
  retained_june: {
    type: Number,
    enum: [0, 1],
    default: 0
  },
  retained_july: {
    type: Number,
    enum: [0, 1],
    default: 0
  },
  retained_august: {
    type: Number,
    enum: [0, 1],
    default: 0
  },
  retained_90: {
    type: Number,
    enum: [0, 1],
    default: 0
  }
}, {
  timestamps: true
});

// 인덱스 생성 (쿼리 성능 향상)
customerSchema.index({ visit_days: 1 });
customerSchema.index({ total_duration_min: 1 });
customerSchema.index({ retained_90: 1 });

module.exports = mongoose.model('Customer', customerSchema);
// 메인 페이지 핵심 지표 표시
// 핵심 메시지, 및 총 고객 수, 평균 체류 시간 등 4개 주요 KPI 요약해 표시


import React from 'react';

const HeroSection = ({ setCurrentPage, mockData }) => {
	const customers = mockData?.customers || [];
	const totalCustomers = customers.length;
	
	// 평균 체류 시간 계산
	const avgDuration = totalCustomers > 0 
		? customers.reduce((sum, c) => sum + (c.total_duration_min || 0), 0) / totalCustomers 
		: 0;
	
	// 재구매율 계산
	const repurchasedCount = customers.filter(c => c.retained_90 === 1).length;
	const repurchaseRate = totalCustomers > 0 
		? (repurchasedCount / totalCustomers * 100) 
		: 0;
	
	// 평균 결제 금액 계산
	const avgPayment = totalCustomers > 0
		? customers.reduce((sum, c) => sum + (c.total_payment_may || 0), 0) / totalCustomers
		: 0;

	return (
			<section className="pt-24 pb-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
			<div className="max-w-7xl mx-auto px-4">
				
				{/* 헤드라인 영역 */}
				<div className="text-center mb-16">
					<div className="inline-block mb-4">
						<span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
							데이터 기반 의사결정
						</span>
					</div>
					
					<h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-6">
						고객 행동을 <br className="sm:hidden"/>
						<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
							인사이트
						</span>로 전환
					</h1>
					
					<p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto font-medium">
						체류시간, 구매 패턴, 출석 빈도를 분석하여<br className="hidden sm:inline"/>
						이탈을 예측하고 재구매율을 극대화합니다
					</p>
					
					<button 
						onClick={() => setCurrentPage('data-insight')}
						className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-bold rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
					>
						<span className="flex items-center gap-2">
							분석 대시보드 시작하기
							<svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
							</svg>
						</span>
					</button>
				</div>

				{/* KPI 카드 섹션  */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					
					{/* 카드 1: 총 고객 수 */}
					<div className="group relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
						<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
						
						<div className="relative">
							<div className="flex items-center justify-between mb-4">
								<div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
									<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
									</svg>
								</div>
								<div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
									100%
								</div>
							</div>
							
							<h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
								총 고객 수
							</h3>
							
							<div className="flex items-baseline gap-2 mb-2">
								<p className="text-5xl font-black text-gray-900">
									{totalCustomers.toLocaleString()} 
								</p>
								<span className="text-2xl font-bold text-gray-600">명</span>
							</div>
							
							<p className="text-sm text-gray-500">전체 데이터셋 기준</p>
						</div>
					</div>

					{/* 카드 2: 평균 체류 시간 */}
					<div className="group relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
						<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
						
						<div className="relative">
							<div className="flex items-center justify-between mb-4">
								<div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
									<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
									{Math.min((avgDuration / 120) * 100, 100).toFixed(0)}%
								</div>
							</div>
							
							<h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
								평균 체류 시간
							</h3>
							
							<div className="flex items-baseline gap-2 mb-2">
								<p className="text-5xl font-black text-gray-900">
									{avgDuration.toFixed(0)}
								</p>
								<span className="text-2xl font-bold text-gray-600">분</span>
							</div>
							
							<p className="text-sm text-gray-500">고객당 평균 시간</p>
						</div>
					</div>

					{/* 카드 3: 재구매율 */}
					<div className="group relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
						<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
						
						<div className="relative">
							<div className="flex items-center justify-between mb-4">
								<div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
									<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<div className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
									우수
								</div>
							</div>
							
							<h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
								재구매율
							</h3>
							
							<div className="flex items-baseline gap-2 mb-2">
								<p className="text-5xl font-black text-gray-900">
									{repurchaseRate.toFixed(1)}
								</p>
								<span className="text-2xl font-bold text-gray-600">%</span>
							</div>
							
							<p className="text-sm text-gray-500">{repurchasedCount.toLocaleString()}명 재구매</p>
						</div>
					</div>

					{/* 카드 4: 평균 결제 금액 */}
					<div className="group relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
						<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
						
						<div className="relative">
							<div className="flex items-center justify-between mb-4">
								<div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
									<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<div className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
									{Math.min((avgPayment / 200000) * 100, 100).toFixed(0)}%
								</div>
							</div>
							
							<h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
								평균 결제 금액
							</h3>
							
							<div className="flex items-baseline gap-2 mb-2">
								<p className="text-5xl font-black text-gray-900">
									{(avgPayment / 10000).toFixed(1)}
								</p>
								<span className="text-2xl font-bold text-gray-600">만원</span>
							</div>
							
							<p className="text-sm text-gray-500">고객당 평균 지출</p>
						</div>
					</div>
				</div>

				{/* 하단 정보 메시지 */}
				<div className="text-center mt-12">
					<div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg">
						<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
						<p className="text-gray-700 text-sm font-medium">
							<span className="font-bold text-blue-600">{totalCustomers.toLocaleString()}</span>명의 실시간 데이터 분석 중
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
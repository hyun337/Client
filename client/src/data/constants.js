// 공통 설정 관리
// 체류 시간 필터 옵션, 이탈 위험도 레벨, 색상 등 상수 정의


/**
 * 체류 시간 기준 동적 필터링 옵션 정의
 * key: 드롭다운에 표시될 텍스트 (예: '60분 이상')
 * value: 필터링 로직에서 사용할 최소 체류 시간 (분, 0은 전체)
 */
export const DURATION_FILTER_OPTIONS = [
    { key: '전체 고객', value: 0 },
    { key: '30분 이상', value: 30 },
    { key: '60분 이상', value: 60 },
    { key: '90분 이상', value: 90 },
    { key: '120분 이상', value: 120 },
];

// AttendanceComparisonChart를 위한 출석 그룹
export const ATTENDANCE_GROUPS_OPTIONS = ['low', 'mid', 'high'];


export const RISK_LEVELS = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
};

export const COLORS = {
    [RISK_LEVELS.LOW]: '#10b981',    // 초록색 (Tailwind green-500)
    [RISK_LEVELS.MEDIUM]: '#f59e0b', // 주황색 (Tailwind amber-500)
    [RISK_LEVELS.HIGH]: '#ef4444'    // 빨간색 (Tailwind red-500)
};

export interface RecentRecoveryCase {
    paymentId: number;
    amount: number;
    message: string;
    status: string;
    failureReason?: string;
}

export interface DashboardData {
    totalPayments: number;
    totalRecoveryAttempts: number;
    totalRevenueAtRisk: number;
    totalRevenueRecovered: number;
    recoveryRatePercentage: number;
    recentRecoveryCases: RecentRecoveryCase[];
}

export interface RecoveryCase {
    recoveryId: number;
    paymentId: number;
    amount: number;
    paymentStatus: string;
    action: string;
    recoveryStatus: string;
    recoveredAmount: number;
    failureReason?: string;
    attemptedAt: string;
}

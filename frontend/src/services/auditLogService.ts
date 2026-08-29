import { apiRequest } from "./api";

export interface AuditLog {
    id: number;
    paymentId: number;
    action: string;
    status: string;
    createdAt: string;
}

export async function getAuditLogs(): Promise<AuditLog[]> {

    const data = await apiRequest("/audit-logs");

    return data;
}
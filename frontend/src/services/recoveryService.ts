import { apiRequest } from "./api";

export interface RecoveryCase {
    recoveryId: number;
    paymentId: number;
    amount: number;
    paymentStatus: string;
    action: string;
    recoveryStatus: string;
    recoveredAmount?: number;
    failureReason?: string;
    attemptedAt: string;
}

export interface RecoveryResponse {
    paymentId: number;
    status: string;
    action: string;
}

/**
 * Get all recovery cases.
 */
export async function getRecoveryCases(): Promise<RecoveryCase[]> {

    const data =
        await apiRequest("/recovery");

    return data;
}

/**
 * Process recovery for a payment.
 */
export async function processRecovery(
    paymentId: number
): Promise<RecoveryResponse> {

    const data =
        await apiRequest("/recovery", {
            method: "POST",

            body: JSON.stringify({
                paymentId: paymentId
            })
        });

    return data;
}

/**
 * Trigger batch recovery processing for all at-risk payments.
 */
export async function processBatchRecovery(): Promise<RecoveryResponse[]> {
    const data = await apiRequest("/recovery/batch", {
        method: "POST"
    });
    return data;
}
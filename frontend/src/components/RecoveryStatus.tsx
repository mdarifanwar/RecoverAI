interface RecoveryStatusProps {
  status: string;
  recommendation?: string;
}

function RecoveryStatus({
  status,
  recommendation
}: RecoveryStatusProps) {

  const normalizedStatus = status.toUpperCase();
  const normalizedRecommendation =
    recommendation?.toUpperCase();

  if (
    normalizedStatus === "SUCCESS" ||
    normalizedRecommendation === "NO_ACTION"
  ) {
    return (
      <div className="status status-success">
        <strong>✓ Payment successful</strong>
        <span>No recovery action is required.</span>
      </div>
    );
  }

  if (
    normalizedRecommendation === "RETRY_PAYMENT"
  ) {
    return (
      <div className="status status-warning">
        <strong>⚠ Payment failed</strong>
        <span>
          We'll retry this payment automatically.
        </span>
      </div>
    );
  }

  if (
    normalizedStatus === "PENDING" ||
    normalizedRecommendation === "EVALUATE"
  ) {
    return (
      <div className="status status-pending">
        <strong>⏳ Payment is being processed</strong>
        <span>
          We'll continue monitoring this payment.
        </span>
      </div>
    );
  }

  return (
    <div className="status status-error">
      <strong>⚠ Payment requires attention</strong>
      <span>
        Please review this payment manually.
      </span>
    </div>
  );
}

export default RecoveryStatus;
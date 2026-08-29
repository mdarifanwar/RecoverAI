interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
}

function StatCard({
  title,
  value,
  description
}: StatCardProps) {
  return (
    <div className="stat-card">
      <h3>{title}</h3>

      <div className="stat-value">
        {value}
      </div>

      {description && (
        <p>{description}</p>
      )}
    </div>
  );
}

export default StatCard;
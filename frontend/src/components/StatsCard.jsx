const StatsCard = ({ title, value, color = '#2c3e50', trend }) => {
    return (
      <div className="stats-card" style={{ borderTop: `4px solid ${color}` }}>
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
        {trend && (
          <div className="trend-indicator">
            {trend === 'up' ? '↑' : '↓'} 5% from last month
          </div>
        )}
      </div>
    );
  };
  
  export default StatsCard;
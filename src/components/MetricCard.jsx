const MetricCard = ({ title, value, detail, delay }) => (
  <div className="card metric reveal" style={{ '--delay': `${delay}ms` }}>
    <p className="card-title">{title}</p>
    <h4>{value}</h4>
    <span>{detail}</span>
  </div>
)

export default MetricCard

const TransactionRow = ({ title, time, amount, status }) => (
  <div className="transaction-row">
    <div>
      <h5>{title}</h5>
      <p>{time}</p>
    </div>
    <div className="transaction-meta">
      <span>{amount}</span>
      <span className={status === 'Confirmado' ? 'good' : 'warn'}>{status}</span>
    </div>
  </div>
)

export default TransactionRow

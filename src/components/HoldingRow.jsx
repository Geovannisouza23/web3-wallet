const HoldingRow = ({ asset, share, change }) => (
  <div className="holding-row">
    <span>{asset}</span>
    <span>{share}</span>
    <span className={change.startsWith('+') ? 'good' : 'muted'}>{change}</span>
  </div>
)

export default HoldingRow

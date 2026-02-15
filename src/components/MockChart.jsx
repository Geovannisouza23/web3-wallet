import { useMemo } from 'react'

const MockChart = ({ data }) => {
  const path = useMemo(() => {
    if (!data.length) {
      return ''
    }

    const max = Math.max(...data.map((point) => point.value))
    const min = Math.min(...data.map((point) => point.value))
    const range = max - min || 1

    return data
      .map((point, index) => {
        const x = (index / (data.length - 1)) * 100
        const y = 100 - ((point.value - min) / range) * 100
        return `${index === 0 ? 'M' : 'L'} ${x},${y}`
      })
      .join(' ')
  }, [data])

  return (
    <div className="chart-wrapper">
      <svg viewBox="0 0 100 100" className="chart-svg" role="img">
        <path d={path} className="chart-line" />
        <path d={`${path} L 100 100 L 0 100 Z`} className="chart-fill" />
      </svg>
      <div className="chart-labels">
        {data.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>
    </div>
  )
}

export default MockChart

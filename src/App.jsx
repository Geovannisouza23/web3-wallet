import { useMemo, useState } from 'react'
import './App.css'
import {
  mockHoldings,
  mockMetrics,
  mockPerformance,
  mockTransactions,
} from './data/mockData'
import useWallet from './hooks/useWallet'

const formatAddress = (address) => {
  if (!address) {
    return ''
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

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

const WalletModal = ({
  open,
  onClose,
  onSelect,
  isConnecting,
  hasWalletConnect,
}) => {
  if (!open) {
    return null
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Conectar wallet</h3>
          <button className="ghost" onClick={onClose}>
            Fechar
          </button>
        </div>
        <div className="modal-body">
          <button
            className="wallet-option"
            onClick={() => onSelect('metamask')}
            disabled={isConnecting}
          >
            <div>
              <h4>MetaMask</h4>
              <p>Conexao direta via extensao.</p>
            </div>
            <span>→</span>
          </button>
          <button
            className="wallet-option"
            onClick={() => onSelect('walletconnect')}
            disabled={isConnecting || !hasWalletConnect}
          >
            <div>
              <h4>WalletConnect</h4>
              <p>QR code para mobile e multiplas carteiras.</p>
            </div>
            <span>{hasWalletConnect ? '→' : 'ID faltando'}</span>
          </button>
          {!hasWalletConnect && (
            <div className="modal-hint">
              Configure VITE_WALLETCONNECT_PROJECT_ID no .env para ativar.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const MetricCard = ({ title, value, detail, delay }) => (
  <div className="card metric reveal" style={{ '--delay': `${delay}ms` }}>
    <p className="card-title">{title}</p>
    <h4>{value}</h4>
    <span>{detail}</span>
  </div>
)

const HoldingRow = ({ asset, share, change }) => (
  <div className="holding-row">
    <span>{asset}</span>
    <span>{share}</span>
    <span className={change.startsWith('+') ? 'good' : 'muted'}>{change}</span>
  </div>
)

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

function App() {
  const {
    wallet,
    isConnecting,
    error,
    hasWalletConnect,
    connectMetaMask,
    connectWalletConnect,
    disconnect,
    refreshBalance,
  } = useWallet()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const balanceLabel = wallet.connected
    ? `${wallet.balance} ${wallet.nativeSymbol}`
    : '--'

  const handleConnect = async (type) => {
    if (type === 'metamask') {
      await connectMetaMask()
    }

    if (type === 'walletconnect') {
      await connectWalletConnect()
    }

    setIsModalOpen(false)
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">NOVA</span>
          <div>
            <h1>Nebula Vault</h1>
            <p>Portfolio Web3</p>
          </div>
        </div>
        <div className="topbar-center">
          <span>Dashboard</span>
        </div>
        <div className="wallet-area">
          {wallet.connected ? (
            <div className="wallet-card">
              <div>
                <span className="wallet-label">Wallet</span>
                <p>{formatAddress(wallet.address)}</p>
              </div>
              <div>
                <span className="wallet-label">Saldo</span>
                <p>{balanceLabel}</p>
              </div>
              <div className="wallet-actions">
                <button className="ghost" onClick={refreshBalance}>
                  Atualizar
                </button>
                <button className="ghost" onClick={disconnect}>
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <button className="primary" onClick={() => setIsModalOpen(true)}>
              Conectar Wallet
            </button>
          )}
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <nav>
            <span className="nav-label">Menu</span>
            <button className="nav-item active">Overview</button>
            <button className="nav-item">Analytics</button>
            <button className="nav-item">Insights</button>
            <button className="nav-item">Settings</button>
          </nav>
          <div className="sidebar-card">
            <p>Conexao</p>
            <h4>{wallet.connected ? wallet.connector : 'Desconectado'}</h4>
            <span>Network: {wallet.network}</span>
          </div>
        </aside>

        <main className="main">
          <section className="hero">
            <div className="card hero-card reveal" style={{ '--delay': '80ms' }}>
              <p className="card-title">Saldo real da wallet</p>
              <h2>{balanceLabel}</h2>
              <span>
                {wallet.connected
                  ? `Conectado em ${wallet.network}`
                  : 'Conecte sua wallet para ver o saldo on-chain'}
              </span>
              <button
                className="ghost"
                onClick={wallet.connected ? refreshBalance : () => setIsModalOpen(true)}
              >
                {wallet.connected ? 'Atualizar saldo' : 'Conectar agora'}
              </button>
            </div>
            <div className="card hero-card accent reveal" style={{ '--delay': '160ms' }}>
              <p className="card-title">Network conectada</p>
              <h2>{wallet.network}</h2>
              <span>Chain ID: {wallet.chainId ?? '--'}</span>
              <div className="chip">{wallet.nativeSymbol}</div>
            </div>
          </section>

          <section className="grid">
            {mockMetrics.map((metric, index) => (
              <MetricCard key={metric.title} {...metric} delay={220 + index * 80} />
            ))}
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <h3>Performance (mock)</h3>
                <p>Curva simulada do portfolio</p>
              </div>
              <span className="pill">Dados ficticios</span>
            </div>
            <MockChart data={mockPerformance} />
          </section>

          <section className="panel split">
            <div>
              <div className="panel-header">
                <div>
                  <h3>Distribuicao</h3>
                  <p>Alocacao simulada por ativo</p>
                </div>
                <span className="pill">Mock</span>
              </div>
              <div className="holding-list">
                {mockHoldings.map((holding) => (
                  <HoldingRow key={holding.asset} {...holding} />
                ))}
              </div>
            </div>
            <div>
              <div className="panel-header">
                <div>
                  <h3>Transacoes recentes</h3>
                  <p>Historico simulado</p>
                </div>
                <span className="pill">Mock</span>
              </div>
              <div className="transaction-list">
                {mockTransactions.map((transaction) => (
                  <TransactionRow key={transaction.title} {...transaction} />
                ))}
              </div>
            </div>
          </section>

          {error && <div className="error-banner">{error}</div>}
        </main>
      </div>

      <WalletModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleConnect}
        isConnecting={isConnecting}
        hasWalletConnect={hasWalletConnect}
      />
    </div>
  )
}

export default App

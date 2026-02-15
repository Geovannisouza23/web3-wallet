import { useState } from 'react'
import './styles/App.css'
import {
  mockHoldings,
  mockMetrics,
  mockPerformance,
  mockTransactions,
} from './data/mockData'
import HoldingRow from './components/HoldingRow'
import MetricCard from './components/MetricCard'
import MockChart from './components/MockChart'
import TransactionRow from './components/TransactionRow'
import WalletModal from './components/WalletModal'
import useWallet from './hooks/useWallet'

const formatAddress = (address) => {
  if (!address) {
    return ''
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

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
    
    if (type === 'walletconnect') {
      await connectWalletConnect()
    }

    setIsModalOpen(false)
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">web3</span>
          <div>
            <h1>web3 blockchain</h1>
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

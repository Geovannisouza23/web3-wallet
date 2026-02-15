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

export default WalletModal

import { useCallback, useEffect, useRef, useState } from 'react'
import { BrowserProvider } from 'ethers'
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import { formatBalance, getBalance, getNetworkInfo } from '../services/web3'

const WALLETCONNECT_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

const initialState = {
  connected: false,
  address: '',
  chainId: null,
  network: 'Desconhecida',
  balance: '0.0000',
  nativeSymbol: 'ETH',
  connector: 'Nenhuma',
}

const buildWalletConnectProvider = async () => {
  if (!WALLETCONNECT_PROJECT_ID) {
    throw new Error('WalletConnect Project ID nao configurado')
  }

  return EthereumProvider.init({
    projectId: WALLETCONNECT_PROJECT_ID,
    chains: [1, 137, 42161, 10, 8453],
    showQrModal: true,
    methods: ['eth_requestAccounts', 'eth_sendTransaction', 'personal_sign'],
    events: ['accountsChanged', 'chainChanged', 'disconnect'],
    metadata: {
      name: 'Web3 Portfolio Dashboard',
      description: 'Dashboard simples para leitura on-chain',
      url: window.location.origin,
      icons: [],
    },
  })
}

const useWallet = () => {
  const [wallet, setWallet] = useState(initialState)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState('')
  const providerRef = useRef(null)
  const eipProviderRef = useRef(null)
  const connectorRef = useRef('')
  const wcProviderRef = useRef(null)

  const updateWalletState = useCallback(async (provider, addressOverride) => {
    const signer = await provider.getSigner()
    const address = addressOverride ?? (await signer.getAddress())
    const network = await provider.getNetwork()
    const chainId = Number(network.chainId)
    const balanceRaw = await getBalance(provider, address)
    const networkInfo = getNetworkInfo(chainId)

    setWallet({
      connected: true,
      address,
      chainId,
      network: networkInfo.name,
      balance: formatBalance(balanceRaw),
      nativeSymbol: networkInfo.symbol,
      connector: connectorRef.current || 'Carteira',
    })
  }, [])

  const disconnect = useCallback(async () => {
    if (wcProviderRef.current?.disconnect) {
      await wcProviderRef.current.disconnect()
    }

    if (window.ethereum?.removeAllListeners) {
      window.ethereum.removeAllListeners('accountsChanged')
      window.ethereum.removeAllListeners('chainChanged')
      window.ethereum.removeAllListeners('disconnect')
    }

    if (eipProviderRef.current?.removeAllListeners) {
      eipProviderRef.current.removeAllListeners()
    }

    providerRef.current = null
    eipProviderRef.current = null
    connectorRef.current = ''
    wcProviderRef.current = null
    setWallet(initialState)
    setError('')
  }, [])

  const connectMetaMask = useCallback(async () => {
    setIsConnecting(true)
    setError('')

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask nao encontrada')
      }

      const provider = new BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      connectorRef.current = 'MetaMask'
      providerRef.current = provider
      eipProviderRef.current = window.ethereum
      wcProviderRef.current = null
      await updateWalletState(provider)

      window.ethereum.on('accountsChanged', (accounts) => {
        if (!accounts.length) {
          disconnect()
          return
        }
        updateWalletState(provider, accounts[0])
      })

      window.ethereum.on('chainChanged', () => {
        updateWalletState(provider)
      })

      window.ethereum.on('disconnect', () => {
        disconnect()
      })
    } catch (err) {
      setError(err?.message || 'Falha ao conectar MetaMask')
      await disconnect()
    } finally {
      setIsConnecting(false)
    }
  }, [disconnect, updateWalletState])

  const connectWalletConnect = useCallback(async () => {
    setIsConnecting(true)
    setError('')

    try {
      const wcProvider = await buildWalletConnectProvider()
      await wcProvider.connect()

      const provider = new BrowserProvider(wcProvider)
      connectorRef.current = 'WalletConnect'
      providerRef.current = provider
      eipProviderRef.current = wcProvider
      wcProviderRef.current = wcProvider
      await updateWalletState(provider)

      wcProvider.on('accountsChanged', (accounts) => {
        if (!accounts.length) {
          disconnect()
          return
        }
        updateWalletState(provider, accounts[0])
      })

      wcProvider.on('chainChanged', () => {
        updateWalletState(provider)
      })

      wcProvider.on('disconnect', () => {
        disconnect()
      })
    } catch (err) {
      setError(err?.message || 'Falha ao conectar WalletConnect')
      await disconnect()
    } finally {
      setIsConnecting(false)
    }
  }, [disconnect, updateWalletState])

  const refreshBalance = useCallback(async () => {
    if (!providerRef.current || !wallet.address) {
      return
    }

    try {
      const balanceRaw = await getBalance(providerRef.current, wallet.address)
      setWallet((prev) => ({
        ...prev,
        balance: formatBalance(balanceRaw),
      }))
    } catch (err) {
      setError(err?.message || 'Falha ao atualizar saldo')
    }
  }, [wallet.address])

  useEffect(() => () => disconnect(), [disconnect])

  const hasWalletConnect = Boolean(WALLETCONNECT_PROJECT_ID)

  return {
    wallet,
    isConnecting,
    error,
    hasWalletConnect,
    connectMetaMask,
    connectWalletConnect,
    disconnect,
    refreshBalance,
  }
}

export default useWallet

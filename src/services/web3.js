import { formatEther } from 'ethers'

const NETWORKS = {
  1: { name: 'Ethereum', symbol: 'ETH' },
  10: { name: 'Optimism', symbol: 'ETH' },
  56: { name: 'BNB Chain', symbol: 'BNB' },
  137: { name: 'Polygon', symbol: 'MATIC' },
  42161: { name: 'Arbitrum', symbol: 'ETH' },
  8453: { name: 'Base', symbol: 'ETH' },
}

export const getNetworkInfo = (chainId) => {
  if (!chainId) {
    return { name: 'Desconhecida', symbol: 'ETH' }
  }

  return NETWORKS[chainId] ?? { name: `Chain ${chainId}`, symbol: 'ETH' }
}

export const getBalance = async (provider, address) => {
  const balance = await provider.getBalance(address)
  return formatEther(balance)
}

export const formatBalance = (value) => {
  if (!value) {
    return '0.0000'
  }

  const numeric = Number(value)
  if (Number.isNaN(numeric)) {
    return '0.0000'
  }

  return numeric.toFixed(4)
}

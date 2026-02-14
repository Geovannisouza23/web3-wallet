# Web3 Portfolio Dashboard

Dashboard simples com dados mockados e saldo real on-chain da wallet conectada (somente leitura).

## Funcionalidades

- Conexao multi-wallet (MetaMask e WalletConnect)
- Exibe address no header
- Saldo real consultado via RPC
- Cards, metricas e graficos ficticios

## Requisitos

- Node.js 20+

## Setup

1. Configure o WalletConnect Project ID no arquivo .env:

```
VITE_WALLETCONNECT_PROJECT_ID=seu_project_id
```

2. Instale dependencias:

```
npm install
```

3. Rode o app:

```
npm run dev
```

## Scripts

- npm run dev
- npm run build
- npm run preview

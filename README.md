# Web3 Portfolio Dashboard

Simple dashboard with mock data and real on-chain wallet balance (read-only).

## Features

- Multi-wallet connection (WalletConnect)
- Displays address in the header
- Real balance fetched via RPC
- Mock cards, metrics, and charts

## Requirements

- Node.js 20+

## Local setup

1. Set the WalletConnect Project ID in .env:

```
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

2. Install dependencies:

```
npm install
```

3. Run the app:

```
npm run dev
```

## Build and Docker

Vite injects environment variables at build time. For Docker, the Project ID must be passed at build.

```
docker build \
	--build-arg VITE_WALLETCONNECT_PROJECT_ID=your_project_id \
	-t nebula-vault:latest .
```

If you do not pass the build arg, the Dockerfile uses the project .env file.

## Kubernetes

The build must include the Project ID. The Deployment env does not change an already built image.

```
kubectl rollout restart deployment nebula-vault-deployment
kubectl port-forward service/nebula-vault-service 8080:80
```

## Architecture (layers)

UI (Dashboard)
	-> Layout, cards, mock charts, balance display

Wallet Layer
	-> Multi-wallet connection, connected/disconnected state, address/chainId

Web3 Service
	-> On-chain read: getBalance(address) via provider

## Data flow

1) App loads mock data
2) User connects wallet
3) Wallet returns address
4) Web3 service fetches on-chain balance
5) UI updates header and main card

## Folder structure

```
.
├── Dockerfile
├── README.md
├── index.html
├── package.json
├── public/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── assets/
│   ├── components/
│   │   ├── HoldingRow.jsx
│   │   ├── MetricCard.jsx
│   │   ├── MockChart.jsx
│   │   ├── TransactionRow.jsx
│   │   └── WalletModal.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── hooks/
│   │   └── useWallet.js
│   ├── services/
│   │   └── web3.js
│   └── styles/
│       ├── App.css
│       └── index.css
├── vite.config.js
└── deployment.yaml
```

## Scripts

- npm run dev
- npm run build
- npm run preview

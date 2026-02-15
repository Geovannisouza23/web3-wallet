# Etapa 1: build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia dependências
COPY package*.json ./
RUN npm install

# Copia restante do projeto
COPY . .

# Variavel do WalletConnect (Vite precisa no build)
ARG VITE_WALLETCONNECT_PROJECT_ID
RUN if [ -n "$VITE_WALLETCONNECT_PROJECT_ID" ]; then \
	echo "VITE_WALLETCONNECT_PROJECT_ID=$VITE_WALLETCONNECT_PROJECT_ID" > .env; \
fi

# Build do Vite
RUN npm run build


# Etapa 2: nginx
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

# Copia build gerado
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Stateless Treasury System

## Introduction

This project implements a stateless treasury system using Ethereum smart contracts. The system includes a local Ethereum development network, deployment of an ERC-20 contract, and a stateless backend API for managing withdrawal claims.

## Features

- Setup local Ethereum development network
- Deploy ERC-20 token contract
- Deploy Treasury contract
- Create and approve withdrawal claims
- Perform withdrawals with multi-signature approvals
- Stateless backend API with JWT authentication


## Prerequisites

- Docker
- Docker Compose
- Node.js

## Setup

### Step 1: Create a New Ethereum Account

1. Start Geth with account management:

    ```bash
    geth account new
    ```

2. Note down the generated address and password.

3. Copy the keystore file to the `keystore` directory.

### Step 2: Configure Environment Variables

Replace the following placeholders in `docker-compose.yml`:

- `your_password_here`: Your Ethereum account password.
- `0xYourNewAccountAddress`: Your Ethereum account address.
- `your_predefined_jwt_secret`: Your JWT secret.

### Step 3: Build and Start Docker Containers

Rebuild and start the Docker containers:

```bash
docker-compose up -d --build
```

### Step 4: Compile and Deploy Contracts

```bash
node stateless-treasury/scripts/compile-treasury.js
node stateless-treasury/scripts/compile-token.js
```

```bash
node stateless-treasury/scripts/deploy-treasury.js
node stateless-treasury/scripts/deploy-token.js
```

### Step 5: Start the Stateless Treasury Service

```bash
docker-compose up -d stateless-treasury

```

## Usage

### Authentication

***Get a JWT token:***

```bash
curl -X POST http://localhost:3000/auth -H "Content-Type: application/json" -d '{"address": "0xYourNewAccountAddress"}'

```

### Create a Claim

***Create a withdrawal claim:***

```bash
curl -X POST http://localhost:3000/create-claim -H "Content-Type: application/json" -H "Authorization: Bearer <your_jwt_token>" -d '{"amount": 100}'
```

### Approve a Claim

***Approve a withdrawal claim***

```bash
curl -X POST http://localhost:3000/approve-claim -H "Content-Type: application/json" -H "Authorization: Bearer <your_jwt_token>" -d '{"claimId": 1}'

```

### Withdraw Tokens

***Withdraw tokens after getting the necessary approvals:***

```bash
curl -X POST http://localhost:3000/withdraw -H "Content-Type: application/json" -H "Authorization: Bearer <your_jwt_token>" -d '{"claimId": 1}'

```

## API Endpoints

- POST /auth: Authenticate and get a JWT token.
- POST /create-claim: Create a withdrawal claim.
- POST /approve-claim: Approve a withdrawal claim.
- POST /withdraw: Withdraw tokens after getting approvals.
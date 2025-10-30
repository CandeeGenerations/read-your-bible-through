# Read Your Bible Through

[![Validate Branch](https://github.com/CandeeGenerations/read-your-bible-through/actions/workflows/validate-branch.yaml/badge.svg)](https://github.com/CandeeGenerations/read-your-bible-through/actions/workflows/validate-branch.yaml)

Read your Bible through in a year!

## Getting Started

### Prerequisites

- Node.js 22.x
- PNPM 10.x
- [phase.dev](https://docs.phase.dev/quickstart#2-install-the-cli)

### Local Setup

1. Check if you have corepack:
   ```sh
   corepack -v
   ```
1. If not, install it:
   ```sh
   brew install corepack
   ```
1. Enable pnpm
   ```sh
   corepack enable pnpm
   ```
1. Install pnpm
   ```sh
   corepack use pnpm
   ```
1. Install project dependencies
   ```sh
   pnpm run install:all
   ```
1. Configure phase.dev:
   ```sh
   cd client
   phase init
   cd ../server
   phase init
   ```
1. Start the client:
   ```sh
   cd client
   pnpm run dev
   ```
1. Start the server:
   ```sh
   cd server
   pnpm run start
   ```

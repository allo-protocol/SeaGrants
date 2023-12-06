# 🌊 Allo SeaGrants

## Getting Started

This is a grants application for Allo. It is built using
[Spec](https://spec.dev), [Bun](https://bun.sh/) and
[Next.js](https://nextjs.org/).

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18.x.x)
- [Bun](https://bun.sh/) (v1.x)
- Add env vars:

Required
```
process.env.NEXT_PUBLIC_IPFS_READ_GATEWAY=
process.env.NEXT_PUBLIC_PINATA_JWT=
process.env.NEXT_PUBLIC_IPFS_READ_GATEWAY=
process.env.NEXT_PUBLIC_IPFS_WRITE_GATEWAY=
```

Optional
```
process.env.NEXT_PUBLIC_ENVIRONMENT=
process.env.ALCHEMY_ID=
process.env.INFURA_ID=
process.env.NEXT_PUBLIC_GRAPHQL_URL=
```

### Installation

```bash
# Install dependencies
bun install
```

### Development

```bash
# Start the development server
bun dev
```

### Testing

TBD 🤔

### Linting

```bash
# Lint the application
bun lint
```

### Production

```bash
# Build the application
bun build

# Start the production server
bun start
```

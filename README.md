This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Supabase Configuration

```
?pgbouncer=true&connection_limit=1
```
- pgbouncer=true

| Scenario               | Without PgBouncer                          | With PgBouncer (`pgbouncer=true`)        |
|------------------------|--------------------------------------------|------------------------------------------|
| **Connection Overhead** | Each connection occupies a PostgreSQL process | Connection reuse, significantly reducing active processes |
| **High-Concurrency Performance** | Easily hits database connection limits (default: 100) | Supports thousands of short-lived client connections |
| **Serverless Adaptation** | High latency on cold starts | Fast connection reuse (e.g., Vercel/Lambda) |
| **Resource Consumption** | High memory usage | Saves 50%+ memory |

- connection_limit=1

If you directly set connection_limit=1 in PostgreSQL connection parameters (e.g., in a connection string or client configuration), it typically means:

Each client process is limited to a maximum of 1 active database connection.
Suitable for scenarios requiring strict connection restrictions (e.g., preventing resource abuse).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

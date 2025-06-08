# LinkHub: Your Links, Simplified.

Effortlessly collect, organize, and share all your important links in one place. Access them anytime, anywhere.

[![Netlify Status](https://api.netlify.com/api/v1/badges/4927c634-e59c-4b87-b4bf-0c64e03b5947/deploy-status)](https://app.netlify.com/projects/lnchub/deploys)

## Tech Stack List

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [Supabase](https://supabase.com/) - The Open Source Firebase Alternative
- [PostgreSQL](https://www.postgresql.org/) - The World's Most Advanced Open Source Relational Database
- [prisma](https://www.prisma.io/) - Next-generation Node.js and TypeScript ORM
- [shadcn/ui](https://ui.shadcn.com/) - A set of components built with Radix UI and Tailwind CSS
- [@tanstack/query](https://tanstack.com/query/latest/docs/react/overview) - Powerful data fetching and state management for React
- [react-hook-form](https://react-hook-form.com/) - Performant, flexible and extensible forms with easy-to-use validation
- [zod](https://zod.dev/) - TypeScript-first schema declaration and validation library

## Development

### 1. Prepare a Supabase project:
- Create a new Supabase project.
- Set up authentication providers (e.g., email/password, OAuth).

### 2. database
- Create a PostgreSQL database.
- Set up the database schema using Prisma.

#### 2.1 Local PostgreSQL Setup (Recommended for development)

If you develop on your local machine, you can use the :

1. Install PostgreSQL on your local machine, you can refer to the [PostgreSQL documentation](https://www.postgresql.org/download/) for installation instructions.
2. Create a new PostgreSQL database named `linkhub`:
   ```bash
   create database linkhub;
   ```
4. Create a `.env.local` file in the root of your project and add your environment variables:
   ```
   SUPABASE_URL=[YOUR-SUPABASE_URL]
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]]@localhost:5432/linkhub?schema=public
   SUPABASE_ANON_KEY=[YOUR_SUPABASE_ANON_KEY]
   NEXT_PUBLIC_BASE_URL=http://localhost:3001
   ```
5. Install packages:
   ```bash
   pnpm i
   ```
6. Run the following command to generate the Prisma client(Client file will be generated in `node_modules`):
   ```bash
   pnpm dlx prisma generate
7. Run the following command to apply the Prisma schema to your database (This will generate `src/db/migrations` files and apply the migrations to your database):
   ```bash
   # make sure you have a .env.local file with your environment variables 
   pnpm dlx cross-env $(cat .env.local | xargs) prisma migrate dev
   ```
8. (For Windows PowerShell)Run the following command to apply the Prisma schema to your database:
   ```bash
   # First, set environment variables from .env.local
   Get-Content .env.local | ForEach-Object {
    $name, $value = $_ -split '=', 2
    [Environment]::SetEnvironmentVariable($name, $value)
   }
   # Second, run the Prisma migration command
   pnpm dlx prisma generate
   pnpm dlx prisma migrate dev
   ```
9. Run the following command to start the development server:
   ```bash
    pnpm dev
    ```

Open [http://localhost:3001](http://localhost:3000) with your browser to see the result.

##### 2.2 Supabase Database Setup (for production)

Change the DATABASE_URL to your Supabase database connection string, others remain the same above.
```
SUPABASE_URL=[YOUR-SUPABASE_URL]
DATABASE_URL=[YOUR-SUPABASE-TRANSACTION-POOLER-CONNECTION-STRING]
SUPABASE_ANON_KEY=[YOUR_SUPABASE_ANON_KEY]
NEXT_PUBLIC_BASE_URL=http://localhost:3001
```

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


## Deploy on Netlify or Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## References

- https://www.prisma.io/docs/orm/prisma-migrate/workflows/troubleshooting
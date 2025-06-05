import { PrismaClient } from "@/actions/generated/client";
import * as fs from "node:fs";
import path from "path";

if (process.env.NODE_ENV === "production") {
  // 强制包含这个文件让 output tracing 发现它
  fs.existsSync(
    path.resolve(
      process.cwd(),
      "src/actions/generated/client/libquery_engine-rhel-openssl-3.0.x.so.node"
    )
  );
}

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

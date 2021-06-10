import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const crypto = await prisma.crypto.findMany();
  console.log(crypto);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

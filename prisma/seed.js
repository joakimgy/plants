const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.plant.create({
    data: {
      name: "Chinese money plant",
      description: "With cute round leaves.",
      userId: user.id,
    },
  });

  const tulipan = await prisma.plant.create({
    data: {
      name: "Tulipan",
      description: "It's yellow.",
      userId: user.id,
    },
  });

  await prisma.waterEvent.create({
    data: {
      plantId: tulipan.id,
      userId: user.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

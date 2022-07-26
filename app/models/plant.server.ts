import type { User, Plant, WaterEvent } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Plant } from "@prisma/client";

export function getPlant({
  id,
  userId,
}: Pick<Plant, "id"> & {
  userId: User["id"];
}) {
  return prisma.plant.findFirst({
    select: { id: true, name: true, description: true },
    where: { id, userId },
  });
}

export function getPlantListItems({ userId }: { userId: User["id"] }) {
  return prisma.plant.findMany({
    where: { userId },
    select: { id: true, name: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createPlant({
  name,
  description,
  userId,
}: Pick<Plant, "description" | "name"> & {
  userId: User["id"];
}) {
  return prisma.plant.create({
    data: {
      name,
      description,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deletePlant({
  id,
  userId,
}: Pick<Plant, "id"> & { userId: User["id"] }) {
  return prisma.plant.deleteMany({
    where: { id, userId },
  });
}

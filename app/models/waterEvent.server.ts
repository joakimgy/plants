import type { User, Plant, WaterEvent } from "@prisma/client";

import { prisma } from "~/db.server";

export function createWaterEvent({
  plantId,
  userId,
}: {
  plantId: WaterEvent["plantId"];
  userId: User["id"];
}) {
  return prisma.waterEvent.create({
    data: {
      plantId,
      userId: userId,
    },
  });
}

export function deleteWaterEvent({
  id,
  userId,
}: Pick<WaterEvent, "id"> & { userId: User["id"] }) {
  return prisma.waterEvent.deleteMany({
    where: { id, userId },
  });
}

export function getWaterEventListItems({ plantId }: { plantId: Plant["id"] }) {
  return prisma.waterEvent.findMany({
    select: { id: true, createdAt: true },
    where: { plantId },
    orderBy: { updatedAt: "desc" },
  });
}

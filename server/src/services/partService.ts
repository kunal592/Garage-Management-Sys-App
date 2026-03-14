import prisma from '../prisma/client';

export const getAllParts = async () => {
  return prisma.part.findMany({
    orderBy: { name: 'asc' }
  });
};

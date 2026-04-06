import prisma from '../prisma/client';

export const getAllParts = async () => {
  return prisma.part.findMany({
    orderBy: { name: 'asc' }
  });
};

export const createPart = async (data: { name: string; category: string; brand?: string; price: number }) => {
  return prisma.part.create({
    data
  });
};

export const updatePart = async (id: string, data: Partial<{ name: string; category: string; brand: string; price: number }>) => {
  return prisma.part.update({
    where: { id },
    data
  });
};

export const deletePart = async (id: string) => {
  return prisma.part.delete({
    where: { id }
  });
};

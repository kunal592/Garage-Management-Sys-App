import { db } from '../data/mockDb';

export const getAllParts = async () => {
  return db.parts.findMany();
};

import { Request, Response, NextFunction } from 'express';
import * as partService from '../services/partService';

export const getParts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parts = await partService.getAllParts();
    res.json(parts);
  } catch (error) {
    next(error);
  }
};

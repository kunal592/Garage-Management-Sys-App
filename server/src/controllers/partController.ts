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

export const addPart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const part = await partService.createPart(req.body);
    res.status(201).json(part);
  } catch (error) {
    next(error);
  }
};

export const updatePart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const part = await partService.updatePart(id as string, req.body);
    res.json(part);
  } catch (error) {
    next(error);
  }
};

export const removePart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await partService.deletePart(id as string);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

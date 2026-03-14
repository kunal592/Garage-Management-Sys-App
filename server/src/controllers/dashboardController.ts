import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboardService';

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export const getRecentActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activity = await dashboardService.getRecentActivity();
    res.json(activity);
  } catch (error) {
    next(error);
  }
};

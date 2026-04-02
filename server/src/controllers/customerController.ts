import { Request, Response, NextFunction } from 'express';
import * as customerService from '../services/customerService';

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search } = req.query;
    const customers = await customerService.getAllCustomers(search as string);
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const customer = await customerService.getCustomerById(id as string);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    next(error);
  }
};

import { customerSchema } from '../utils/validation';

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = customerSchema.parse(req.body);
    const customer = await customerService.createCustomer(validatedData);
    res.status(201).json(customer);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'A customer with this phone number already exists.' });
    }
    console.error('Create customer error:', error);
    next(error);
  }
};

export const getCustomerByPhone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone } = req.params;
    const customer = await customerService.searchCustomerByPhone(phone as string);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    next(error);
  }
};

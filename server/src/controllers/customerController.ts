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

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, phone, address } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }
    const customer = await customerService.createCustomer({ name, phone, address });
    res.status(201).json(customer);
  } catch (error) {
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

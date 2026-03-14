import { db } from '../data/mockDb';

export const getAllCustomers = async (search?: string) => {
  let customers = db.customers.findMany();
  if (search) {
    const s = search.toLowerCase();
    customers = customers.filter(c => 
      c.name.toLowerCase().includes(s) || 
      c.phone.includes(s)
    );
  }
  return customers;
};

export const getCustomerById = async (id: string) => {
  return db.customers.findUnique(id);
};

export const createCustomer = async (data: { name: string; phone: string; address?: string }) => {
  return db.customers.create(data);
};

export const searchCustomerByPhone = async (phone: string) => {
  return db.customers.findByPhone(phone);
};

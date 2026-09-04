import * as repo from './corporateEnquiry.repository.js';
import { v4 as uuidv4 } from 'uuid';

export const getAll = () => repo.findAll();
export const create = (data: any) => repo.create({ id: uuidv4(), ...data });
export const update = (id: string, data: any) => repo.update(id, data);
export const remove = (id: string) => repo.deleteRecord(id);
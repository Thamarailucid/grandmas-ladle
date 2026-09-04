import * as repo from './festival.repository.js';
import { v4 as uuidv4 } from 'uuid';
import { generateSlug } from '../../utils/slug.js';

export const getAll = () => repo.findAll();
export const create = (data: any) => {
  if (data.name && !data.slug) {
    data.slug = generateSlug(data.name);
  }
  return repo.create({ id: uuidv4(), ...data });
};
export const update = (id: string, data: any) => {
  if (data.name && !data.slug) {
    data.slug = generateSlug(data.name);
  }
  return repo.update(id, data);
};
export const remove = (id: string) => repo.deleteRecord(id);
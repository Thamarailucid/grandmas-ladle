const fs = require('fs');
const path = require('path');

const generateBackendModule = (entityName, entityLower, tableName) => {
  let folderName = entityLower + 's';
  if (entityName === 'ContactEnquiry') folderName = 'contactEnquiries';
  if (entityName === 'CorporateEnquiry') folderName = 'corporateEnquiries';
  
  const baseDir = path.join(__dirname, 'services/api/src/modules', folderName);
  fs.mkdirSync(baseDir, { recursive: true });

  const repoContent = `import { database } from '../../database/connection.js';

export const findAll = async () => {
  const result = await database.query('SELECT * FROM ${tableName} ORDER BY created_at DESC');
  return result.rows.map(row => {
    const dto = {};
    for (const [key, value] of Object.entries(row)) {
      const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
      dto[camelKey] = value;
    }
    return dto;
  });
};

export const create = async (data: any) => {
  const fields = [];
  const values = [];
  const placeholders = [];
  let counter = 1;
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      fields.push(key.replace(/[A-Z]/g, letter => "_" + letter.toLowerCase()));
      values.push(value);
      placeholders.push("$" + counter);
      counter++;
    }
  }
  const query = "INSERT INTO ${tableName} (" + fields.join(', ') + ") VALUES (" + placeholders.join(', ') + ") RETURNING *";
  const result = await database.query(query, values);
  return result.rows[0];
};

export const update = async (id: string, data: any) => {
  const fields = [];
  const values = [];
  let counter = 1;
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      fields.push(key.replace(/[A-Z]/g, letter => "_" + letter.toLowerCase()) + " = $" + counter);
      values.push(value);
      counter++;
    }
  }
  if (fields.length === 0) return null;
  values.push(id);
  const query = "UPDATE ${tableName} SET " + fields.join(', ') + ", updated_at = NOW() WHERE id = $" + counter + " RETURNING *";
  const result = await database.query(query, values);
  return result.rows[0];
};

export const deleteRecord = async (id: string) => {
  await database.query('DELETE FROM ${tableName} WHERE id = $1', [id]);
};
  `;
  fs.writeFileSync(path.join(baseDir, entityLower + '.repository.ts'), repoContent.trim());

  const serviceContent = `import * as repo from './${entityLower}.repository.js';
import { v4 as uuidv4 } from 'uuid';

export const getAll = () => repo.findAll();
export const create = (data: any) => repo.create({ id: uuidv4(), ...data });
export const update = (id: string, data: any) => repo.update(id, data);
export const remove = (id: string) => repo.deleteRecord(id);
  `;
  fs.writeFileSync(path.join(baseDir, entityLower + '.service.ts'), serviceContent.trim());

  const controllerContent = `import { Request, Response, NextFunction } from 'express';
import * as service from './${entityLower}.service.js';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.getAll();
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.remove(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) { next(error); }
};
  `;
  fs.writeFileSync(path.join(baseDir, entityLower + '.controller.ts'), controllerContent.trim());

  const routeContent = `import { Router } from 'express';
import * as controller from './${entityLower}.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/authorize.js';

const router = Router();
router.get('/Get${entityName}s', authenticate, controller.getAll);
router.post('/Create${entityName}', authenticate, authorize('ADMIN', 'MANAGER'), controller.create);
router.put('/Update${entityName}/:id', authenticate, authorize('ADMIN', 'MANAGER'), controller.update);
router.delete('/Delete${entityName}/:id', authenticate, authorize('ADMIN'), controller.remove);
export default router;
  `;
  fs.writeFileSync(path.join(baseDir, entityLower + '.routes.ts'), routeContent.trim());
};

['ContactEnquiry', 'CorporateEnquiry', 'Festival', 'Order'].forEach(entity => {
  let tableName = '';
  if (entity === 'ContactEnquiry') tableName = 'contact_enquiries';
  if (entity === 'CorporateEnquiry') tableName = 'corporate_enquiries';
  if (entity === 'Festival') tableName = 'festivals';
  if (entity === 'Order') tableName = 'orders';
  
  let lower = entity.charAt(0).toLowerCase() + entity.slice(1);
  if (entity === 'ContactEnquiry') lower = 'contactEnquiry'; // need exact match with import paths
  if (entity === 'CorporateEnquiry') lower = 'corporateEnquiry';
  generateBackendModule(entity, lower, tableName);
});
console.log('Backend modules generated');

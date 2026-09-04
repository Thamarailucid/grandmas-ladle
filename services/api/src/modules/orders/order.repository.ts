import { database } from '../../database/connection.js';

export const findAll = async () => {
  const result = await database.query('SELECT * FROM orders ORDER BY created_at DESC');
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
  const query = "INSERT INTO orders (" + fields.join(', ') + ") VALUES (" + placeholders.join(', ') + ") RETURNING *";
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
  const query = "UPDATE orders SET " + fields.join(', ') + ", updated_at = NOW() WHERE id = $" + counter + " RETURNING *";
  const result = await database.query(query, values);
  return result.rows[0];
};

export const deleteRecord = async (id: string) => {
  await database.query('DELETE FROM orders WHERE id = $1', [id]);
};
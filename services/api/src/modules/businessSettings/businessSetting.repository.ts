import { database } from '../../database/connection.js';

export const getSettings = async () => {
  const query = `SELECT * FROM business_settings LIMIT 1`;
  const result = await database.query(query);
  return result.rows[0];
};

export const updateSettings = async (data: any) => {
  const fields: string[] = [];
  const values: any[] = [];
  let counter = 1;

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      fields.push(`${snakeKey} = $${counter}`);
      values.push(value);
      counter++;
    }
  }

  if (fields.length === 0) return null;

  const query = `
    UPDATE business_settings 
    SET ${fields.join(', ')}, updated_at = NOW()
    RETURNING *
  `;
  
  const result = await database.query(query, values);
  return result.rows[0];
};

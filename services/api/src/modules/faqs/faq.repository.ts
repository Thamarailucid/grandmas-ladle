import { database } from '../../database/connection.js';

const mapFaqToDto = (row: any) => ({
  id: row.id,
  question: row.question,
  answer: row.answer,
  isPublished: row.is_published,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const findAllFaqs = async (isPublishedOnly = false) => {
  let query = `SELECT * FROM faqs`;
  if (isPublishedOnly) {
    query += ` WHERE is_published = TRUE`;
  }
  query += ` ORDER BY sort_order ASC`;
  const result = await database.query(query);
  return result.rows.map(mapFaqToDto);
};

export const findFaqById = async (id: string) => {
  const query = `SELECT * FROM faqs WHERE id = $1`;
  const result = await database.query(query, [id]);
  return result.rows[0] ? mapFaqToDto(result.rows[0]) : null;
};

export const createFaq = async (data: any) => {
  const query = `
    INSERT INTO faqs (id, question, answer, is_published, sort_order)
    VALUES ($1, $2, $3, $4, $5) RETURNING *
  `;
  const values = [data.id, data.question, data.answer, data.isPublished ?? false, data.sortOrder ?? 0];
  const result = await database.query(query, values);
  return result.rows[0] ? mapFaqToDto(result.rows[0]) : null;
};

export const updateFaq = async (id: string, data: any) => {
  const fields: string[] = [];
  const values: any[] = [];
  let counter = 1;

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && key !== 'isPublished') { // handle explicitly published status differently or together
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      fields.push(`${snakeKey} = $${counter}`);
      values.push(value);
      counter++;
    }
  }
  
  if (data.isPublished !== undefined) {
      fields.push(`is_published = $${counter}`);
      values.push(data.isPublished);
      counter++;
  }

  if (fields.length === 0) return null;

  values.push(id);
  const query = `
    UPDATE faqs 
    SET ${fields.join(', ')}, updated_at = NOW()
    WHERE id = $${counter}
    RETURNING *
  `;
  
  const result = await database.query(query, values);
  return result.rows[0] ? mapFaqToDto(result.rows[0]) : null;
};

export const updateFaqPublicationStatus = async (id: string, isPublished: boolean) => {
  const query = `
    UPDATE faqs 
    SET is_published = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *
  `;
  const result = await database.query(query, [isPublished, id]);
  return result.rows[0] ? mapFaqToDto(result.rows[0]) : null;
};

export const deleteFaq = async (id: string) => {
  const query = `DELETE FROM faqs WHERE id = $1`;
  await database.query(query, [id]);
};

import { database } from '../../database/connection.js';

const mapReviewToDto = (row: any) => ({
  id: row.id,
  customerName: row.customer_name,
  customerLocation: row.customer_location,
  rating: row.rating,
  content: row.content,
  adminReply: row.admin_reply,
  isPublished: row.is_published,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const findAllReviews = async (isPublishedOnly = false) => {
  let query = `SELECT * FROM reviews WHERE is_deleted = FALSE`;
  if (isPublishedOnly) {
    query += ` AND is_published = TRUE`;
  }
  query += ` ORDER BY sort_order ASC, created_at DESC`;
  const result = await database.query(query);
  return result.rows.map(mapReviewToDto);
};

export const findReviewById = async (id: string) => {
  const query = `SELECT * FROM reviews WHERE id = $1 AND is_deleted = FALSE`;
  const result = await database.query(query, [id]);
  return result.rows[0] ? mapReviewToDto(result.rows[0]) : null;
};

export const createReview = async (data: any) => {
  const query = `
    INSERT INTO reviews (id, customer_name, customer_location, rating, content, admin_reply, is_published, sort_order)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
  `;
  const values = [data.id, data.customerName, data.customerLocation, data.rating, data.content, data.adminReply, data.isPublished ?? false, data.sortOrder ?? 0];
  const result = await database.query(query, values);
  return result.rows[0] ? mapReviewToDto(result.rows[0]) : null;
};

export const updateReview = async (id: string, data: any) => {
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

  values.push(id);
  const query = `
    UPDATE reviews 
    SET ${fields.join(', ')}, updated_at = NOW()
    WHERE id = $${counter} AND is_deleted = FALSE
    RETURNING *
  `;
  
  const result = await database.query(query, values);
  return result.rows[0] ? mapReviewToDto(result.rows[0]) : null;
};

export const updateReviewPublicationStatus = async (id: string, isPublished: boolean) => {
  const query = `
    UPDATE reviews 
    SET is_published = $1, updated_at = NOW()
    WHERE id = $2 AND is_deleted = FALSE
    RETURNING *
  `;
  const result = await database.query(query, [isPublished, id]);
  return result.rows[0] ? mapReviewToDto(result.rows[0]) : null;
};

export const deleteReview = async (id: string) => {
  const query = `
    UPDATE reviews 
    SET is_deleted = TRUE, updated_at = NOW()
    WHERE id = $1
  `;
  await database.query(query, [id]);
};

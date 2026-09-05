import { database } from '../../database/connection.js';

const mapReviewToDto = (row: any) => ({
  id: row.id,
  customerName: row.customer_name,
  customerLocation: row.customer_location,
  rating: Number(row.rating),
  content: row.content,
  adminReply: row.admin_reply,
  isPublished: row.is_published !== false,
  isApproved: row.is_approved !== false,
  isVerified: Boolean(row.is_verified),
  productNames: Array.isArray(row.product_names) ? row.product_names : [],
  sortOrder: row.sort_order ?? 0,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const findAllReviews = async (isPublishedOnly = false) => {
  let query = `SELECT * FROM reviews WHERE is_deleted = FALSE`;
  if (isPublishedOnly) {
    query += ` AND is_published = TRUE AND is_approved = TRUE`;
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
    INSERT INTO reviews (
      id, customer_name, customer_location, rating, content, admin_reply, 
      is_published, is_approved, is_verified, product_names, sort_order
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
    RETURNING *
  `;
  const values = [
    data.id,
    data.customerName,
    data.customerLocation || null,
    data.rating,
    data.content,
    data.adminReply || null,
    data.isPublished ?? false,
    data.isApproved ?? false,
    data.isVerified ?? false,
    Array.isArray(data.productNames) ? data.productNames : [],
    data.sortOrder ?? 0
  ];
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

export const updateReviewApprovalStatus = async (id: string, isApproved: boolean) => {
  const query = `
    UPDATE reviews 
    SET is_approved = $1, updated_at = NOW()
    WHERE id = $2 AND is_deleted = FALSE
    RETURNING *
  `;
  const result = await database.query(query, [isApproved, id]);
  return result.rows[0] ? mapReviewToDto(result.rows[0]) : null;
};

export const updateReviewVerificationStatus = async (id: string, isVerified: boolean) => {
  const query = `
    UPDATE reviews 
    SET is_verified = $1, updated_at = NOW()
    WHERE id = $2 AND is_deleted = FALSE
    RETURNING *
  `;
  const result = await database.query(query, [isVerified, id]);
  return result.rows[0] ? mapReviewToDto(result.rows[0]) : null;
};

export const getReviewStats = async () => {
  const query = `
    SELECT 
      COUNT(*) AS total_reviews,
      COALESCE(ROUND(AVG(rating), 1), 5.0) AS average_rating,
      COUNT(CASE WHEN rating = 5 THEN 1 END) AS count_5,
      COUNT(CASE WHEN rating = 4 THEN 1 END) AS count_4,
      COUNT(CASE WHEN rating = 3 THEN 1 END) AS count_3,
      COUNT(CASE WHEN rating = 2 THEN 1 END) AS count_2,
      COUNT(CASE WHEN rating = 1 THEN 1 END) AS count_1
    FROM reviews
    WHERE is_deleted = FALSE AND is_published = TRUE AND is_approved = TRUE
  `;
  const result = await database.query(query);
  const row = result.rows[0] || {};
  return {
    totalReviews: Number(row.total_reviews || 0),
    averageRating: Number(row.average_rating || 5.0),
    ratingBreakdown: {
      5: Number(row.count_5 || 0),
      4: Number(row.count_4 || 0),
      3: Number(row.count_3 || 0),
      2: Number(row.count_2 || 0),
      1: Number(row.count_1 || 0)
    }
  };
};

export const deleteReview = async (id: string) => {
  const query = `
    UPDATE reviews 
    SET is_deleted = TRUE, updated_at = NOW()
    WHERE id = $1
  `;
  await database.query(query, [id]);
};

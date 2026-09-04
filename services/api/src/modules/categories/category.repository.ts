import { database } from '../../database/connection.js';

const mapCategoryToDto = (row: any) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  imageUrl: row.image_url,
  isActive: row.is_active,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

async function shiftSortOrders(targetOrder: number, idToExclude?: string) {
  if (idToExclude) {
    await database.query(`UPDATE product_categories SET sort_order = sort_order + 1 WHERE sort_order >= $1 AND id != $2`, [targetOrder, idToExclude]);
  } else {
    await database.query(`UPDATE product_categories SET sort_order = sort_order + 1 WHERE sort_order >= $1`, [targetOrder]);
  }
}

export const findAllCategories = async (onlyActive = false) => {
  let query = `SELECT * FROM product_categories`;
  if (onlyActive) {
    query += ` WHERE is_active = TRUE`;
  }
  query += ` ORDER BY sort_order ASC`;
  const result = await database.query(query);
  return result.rows.map(mapCategoryToDto);
};

export const findCategoryById = async (id: string) => {
  const query = `SELECT * FROM product_categories WHERE id = $1`;
  const result = await database.query(query, [id]);
  return result.rows[0] ? mapCategoryToDto(result.rows[0]) : null;
};

export const findCategoryBySlug = async (slug: string) => {
  const query = `SELECT * FROM product_categories WHERE slug = $1`;
  const result = await database.query(query, [slug]);
  return result.rows[0] ? mapCategoryToDto(result.rows[0]) : null;
};

export const createCategory = async (data: any) => {
  if (data.sortOrder !== undefined) {
    await shiftSortOrders(data.sortOrder);
  }
  const query = `
    INSERT INTO product_categories (id, name, slug, description, image_url, sort_order, is_active)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
  `;
  const values = [data.id, data.name, data.slug, data.description, data.imageUrl, data.sortOrder ?? 0, data.isActive ?? true];
  const result = await database.query(query, values);
  return result.rows[0] ? mapCategoryToDto(result.rows[0]) : null;
};

export const updateCategory = async (id: string, data: any) => {
  if (data.sortOrder !== undefined) {
    await shiftSortOrders(data.sortOrder, id);
  }
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
    UPDATE product_categories 
    SET ${fields.join(', ')}, updated_at = NOW()
    WHERE id = $${counter}
    RETURNING *
  `;
  
  const result = await database.query(query, values);
  return result.rows[0] ? mapCategoryToDto(result.rows[0]) : null;
};

export const deleteCategory = async (id: string) => {
  const query = `DELETE FROM product_categories WHERE id = $1`;
  await database.query(query, [id]);
};

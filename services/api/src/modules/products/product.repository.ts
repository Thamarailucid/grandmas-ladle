import { database } from '../../database/connection.js';

const mapProductToDto = (row: any) => ({
  id: row.id,
  categoryId: row.category_id,
  categoryName: row.category_name,
  name: row.name,
  slug: row.slug,
  description: row.description,
  shortDescription: row.short_description,
  price: row.price,
  originalPrice: row.original_price,
  offerPrice: row.offer_price,
  imageUrl: row.image_url,
  isAvailable: row.is_available,
  isVegetarian: row.is_vegetarian,
  isOnSale: row.is_on_sale,
  isListed: row.is_listed !== false,
  spiceLevel: row.spice_level,
  preparationTimeMinutes: row.preparation_time_minutes,
  portionSize: row.portion_size,
  unit: row.unit,
  tag: row.tag,
  offerStartDate: row.offer_start_date,
  offerEndDate: row.offer_end_date,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const findAllProducts = async (params: { categoryId?: string, isAvailable?: boolean, page: number, pageSize: number, offset: number }) => {
  const { categoryId, isAvailable, pageSize, offset } = params;
  let query = `
    SELECT p.*, c.name as category_name 
    FROM products p
    LEFT JOIN product_categories c ON p.category_id = c.id
    WHERE p.is_deleted = FALSE
  `;
  const values: any[] = [];

  if (categoryId) {
    values.push(categoryId);
    query += ` AND p.category_id = $${values.length}`;
  }
  if (isAvailable !== undefined) {
    values.push(isAvailable);
    query += ` AND p.is_available = $${values.length}`;
  }

  query += ` ORDER BY p.sort_order ASC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(pageSize, offset);

  const result = await database.query(query, values);
  return result.rows.map(mapProductToDto);
};

export const countProducts = async (params: { categoryId?: string, isAvailable?: boolean }) => {
  const { categoryId, isAvailable } = params;
  let query = `SELECT COUNT(*) FROM products WHERE is_deleted = FALSE`;
  const values: any[] = [];

  if (categoryId) {
    values.push(categoryId);
    query += ` AND category_id = $${values.length}`;
  }
  if (isAvailable !== undefined) {
    values.push(isAvailable);
    query += ` AND is_available = $${values.length}`;
  }

  const result = await database.query(query, values);
  return parseInt(result.rows[0].count, 10);
};

export const findProductById = async (id: string) => {
  const query = `
    SELECT p.*, c.name as category_name 
    FROM products p
    LEFT JOIN product_categories c ON p.category_id = c.id
    WHERE p.id = $1 AND p.is_deleted = FALSE
  `;
  const result = await database.query(query, [id]);
  return result.rows[0] ? mapProductToDto(result.rows[0]) : null;
};

export const findProductBySlug = async (slug: string) => {
  const query = `
    SELECT p.*, c.name as category_name 
    FROM products p
    LEFT JOIN product_categories c ON p.category_id = c.id
    WHERE p.slug = $1 AND p.is_deleted = FALSE
  `;
  const result = await database.query(query, [slug]);
  return result.rows[0] ? mapProductToDto(result.rows[0]) : null;
};

async function shiftSortOrders(targetOrder: number, idToExclude?: string) {
  if (idToExclude) {
    await database.query(`UPDATE products SET sort_order = sort_order + 1 WHERE sort_order >= $1 AND id != $2 AND is_deleted = FALSE`, [targetOrder, idToExclude]);
  } else {
    await database.query(`UPDATE products SET sort_order = sort_order + 1 WHERE sort_order >= $1 AND is_deleted = FALSE`, [targetOrder]);
  }
}

export const createProduct = async (data: any) => {
  if (data.sortOrder !== undefined) {
    await shiftSortOrders(data.sortOrder);
  }
  const query = `
    INSERT INTO products (
      id, category_id, name, slug, description, short_description,
      price, original_price, offer_price, image_url, is_available, is_vegetarian, is_on_sale, is_listed,
      spice_level, preparation_time_minutes, sort_order, portion_size, unit,
      tag, offer_start_date, offer_end_date
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
    ) RETURNING *
  `;
  const values = [
    data.id, data.categoryId, data.name, data.slug, data.description,
    data.shortDescription, data.price, data.originalPrice, data.offerPrice, data.imageUrl,
    data.isAvailable ?? true, data.isVegetarian ?? true, data.isOnSale ?? false, data.isListed ?? true, data.spiceLevel ?? 0,
    data.preparationTimeMinutes ?? 0, data.sortOrder ?? 0, data.portionSize, data.unit,
    data.tag, data.offerStartDate, data.offerEndDate
  ];
  const result = await database.query(query, values);
  return result.rows[0] ? mapProductToDto(result.rows[0]) : null;
};

export const updateProduct = async (id: string, data: any) => {
  if (data.sortOrder !== undefined) {
    await shiftSortOrders(data.sortOrder, id);
  }
  const fields: string[] = [];
  const values: any[] = [];
  let counter = 1;

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      // Map camelCase to snake_case manually or assume data is already snake_case
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      fields.push(`${snakeKey} = $${counter}`);
      values.push(value);
      counter++;
    }
  }

  if (fields.length === 0) return null;

  values.push(id);
  const query = `
    UPDATE products 
    SET ${fields.join(', ')}, updated_at = NOW()
    WHERE id = $${counter} AND is_deleted = FALSE
    RETURNING *
  `;
  
  const result = await database.query(query, values);
  return result.rows[0] ? mapProductToDto(result.rows[0]) : null;
};

export const updateProductAvailability = async (id: string, isAvailable: boolean) => {
  const query = `
    UPDATE products 
    SET is_available = $1, updated_at = NOW()
    WHERE id = $2 AND is_deleted = FALSE
    RETURNING *
  `;
  const result = await database.query(query, [isAvailable, id]);
  return result.rows[0] ? mapProductToDto(result.rows[0]) : null;
};

export const softDeleteProduct = async (id: string) => {
  const query = `
    UPDATE products 
    SET is_deleted = TRUE, updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;
  const result = await database.query(query, [id]);
  return result.rows[0] ? mapProductToDto(result.rows[0]) : null;
};

import { database } from '../../database/connection.js';

async function shiftSortOrders(targetOrder: number, idToExclude?: string) {
  if (idToExclude) {
    await database.query(`UPDATE hero_slides SET sort_order = sort_order + 1 WHERE sort_order >= $1 AND id != $2`, [targetOrder, idToExclude]);
  } else {
    await database.query(`UPDATE hero_slides SET sort_order = sort_order + 1 WHERE sort_order >= $1`, [targetOrder]);
  }
}

export const getHeroSlides = async () => {
  const query = `SELECT * FROM hero_slides ORDER BY sort_order ASC, created_at DESC`;
  const result = await database.query(query);
  return result.rows.map(mapToDTO);
};

export const getPublicHeroSlides = async () => {
  const query = `SELECT * FROM hero_slides WHERE is_active = true ORDER BY sort_order ASC, created_at DESC`;
  const result = await database.query(query);
  return result.rows.map(mapToDTO);
};

export const getHeroSlideById = async (id: string) => {
  const query = `SELECT * FROM hero_slides WHERE id = $1`;
  const result = await database.query(query, [id]);
  return result.rows[0] ? mapToDTO(result.rows[0]) : null;
};

export const createHeroSlide = async (data: any) => {
  if (data.sortOrder !== undefined) {
    await shiftSortOrders(data.sortOrder);
  }

  const query = `
    INSERT INTO hero_slides (image_url, title, subtitle, cta_text, cta_link, secondary_cta_text, secondary_cta_link, is_image_only, image_fit, is_clickable, sort_order, is_active)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *
  `;
  const values = [
    data.imageUrl, 
    data.title, 
    data.subtitle, 
    data.ctaText, 
    data.ctaLink, 
    data.secondaryCtaText,
    data.secondaryCtaLink,
    data.isImageOnly ?? false, 
    data.imageFit ?? 'cover-center',
    data.isClickable ?? false,
    data.sortOrder ?? 0, 
    data.isActive ?? true
  ];
  const result = await database.query(query, values);
  return mapToDTO(result.rows[0]);
};

export const updateHeroSlide = async (id: string, data: any) => {
  if (data.sortOrder !== undefined) {
    await shiftSortOrders(data.sortOrder, id);
  }

  const fields: string[] = [];
  const values: any[] = [];
  let counter = 1;

  const mapping: Record<string, string> = {
    imageUrl: 'image_url',
    title: 'title',
    subtitle: 'subtitle',
    ctaText: 'cta_text',
    ctaLink: 'cta_link',
    secondaryCtaText: 'secondary_cta_text',
    secondaryCtaLink: 'secondary_cta_link',
    isImageOnly: 'is_image_only',
    imageFit: 'image_fit',
    isClickable: 'is_clickable',
    sortOrder: 'sort_order',
    isActive: 'is_active'
  };

  for (const [key, dbCol] of Object.entries(mapping)) {
    if (data[key] !== undefined) {
      fields.push(`${dbCol} = $${counter}`);
      values.push(data[key]);
      counter++;
    }
  }

  if (fields.length === 0) return getHeroSlideById(id);

  values.push(id);
  const query = `
    UPDATE hero_slides
    SET ${fields.join(', ')}
    WHERE id = $${counter}
    RETURNING *
  `;
  
  const result = await database.query(query, values);
  return result.rows[0] ? mapToDTO(result.rows[0]) : null;
};

export const deleteHeroSlide = async (id: string) => {
  const query = `DELETE FROM hero_slides WHERE id = $1 RETURNING *`;
  const result = await database.query(query, [id]);
  return result.rowCount ? result.rowCount > 0 : false;
};

const mapToDTO = (row: any) => ({
  id: row.id,
  imageUrl: row.image_url,
  title: row.title,
  subtitle: row.subtitle,
  ctaText: row.cta_text,
  ctaLink: row.cta_link,
  secondaryCtaText: row.secondary_cta_text,
  secondaryCtaLink: row.secondary_cta_link,
  isImageOnly: row.is_image_only,
  imageFit: row.image_fit || 'cover-center',
  isClickable: row.is_clickable ?? false,
  sortOrder: row.sort_order,
  isActive: row.is_active,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

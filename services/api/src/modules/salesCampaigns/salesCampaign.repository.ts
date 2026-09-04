import { database } from '../../database/connection.js';

export const mapCampaignToDto = (row: any) => ({
  id: row.id,
  name: row.name,
  announcementText: row.announcement_text,
  announcementLink: row.announcement_link,
  isAnnouncementActive: row.is_announcement_active,
  isGlobalSaleActive: row.is_global_sale_active,
  isSaleWidgetActive: row.is_sale_widget_active,
  preVisibilityDays: row.pre_visibility_days,
  postVisibilityDays: row.post_visibility_days,
  startDate: row.start_date,
  endDate: row.end_date,
  productIds: row.product_ids || [],
  isActive: row.is_active,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const findAllCampaigns = async () => {
  const query = "SELECT * FROM sales_campaigns ORDER BY created_at DESC";
  const result = await database.query(query);
  return result.rows.map(mapCampaignToDto);
};

export const findCampaignById = async (id: string) => {
  const query = "SELECT * FROM sales_campaigns WHERE id = $1";
  const result = await database.query(query, [id]);
  return result.rows[0] ? mapCampaignToDto(result.rows[0]) : null;
};

export const createCampaign = async (data: any) => {
  const query = "INSERT INTO sales_campaigns (name, announcement_text, announcement_link, is_announcement_active, is_global_sale_active, is_sale_widget_active, pre_visibility_days, post_visibility_days, start_date, end_date, product_ids, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12) RETURNING *";
  const values = [
    data.name,
    data.announcementText,
    data.announcementLink,
    data.isAnnouncementActive ?? false,
    data.isGlobalSaleActive ?? false,
    data.isSaleWidgetActive ?? false,
    data.preVisibilityDays ?? 1,
    data.postVisibilityDays ?? 0,
    data.startDate,
    data.endDate,
    JSON.stringify(data.productIds || []),
    data.isActive ?? true
  ];
  const result = await database.query(query, values);
  return result.rows[0] ? mapCampaignToDto(result.rows[0]) : null;
};

export const updateCampaign = async (id: string, data: any) => {
  const fields: string[] = [];
  const values: any[] = [];
  let counter = 1;

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      const snakeKey = key.replace(/[A-Z]/g, letter => "_" + letter.toLowerCase());
      if (key === 'productIds') {
        fields.push(snakeKey + " = $" + counter + "::jsonb");
        values.push(JSON.stringify(value));
      } else {
        fields.push(snakeKey + " = $" + counter);
        values.push(value);
      }
      counter++;
    }
  }

  if (fields.length === 0) return null;

  fields.push("updated_at = NOW()");
  values.push(id);

  const query = "UPDATE sales_campaigns SET " + fields.join(', ') + " WHERE id = $" + counter + " RETURNING *";

  const result = await database.query(query, values);
  return result.rows[0] ? mapCampaignToDto(result.rows[0]) : null;
};

export const deleteCampaign = async (id: string) => {
  const query = "DELETE FROM sales_campaigns WHERE id = $1";
  await database.query(query, [id]);
  return true;
};

export const getActiveCampaign = async () => {
  const query = "SELECT * FROM sales_campaigns WHERE is_active = TRUE ORDER BY updated_at DESC LIMIT 1";
  const result = await database.query(query);
  return result.rows[0] ? mapCampaignToDto(result.rows[0]) : null;
};

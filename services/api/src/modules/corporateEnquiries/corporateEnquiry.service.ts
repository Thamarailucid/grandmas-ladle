import * as repo from './corporateEnquiry.repository.js';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../../utils/mailer.js';
import dayjs from 'dayjs';

export const getAll = () => repo.findAll();

export const create = async (data: any) => {
  const result = await repo.create({ id: uuidv4(), ...data });
  
  // Send email notification
  await sendEmail({
    subject: `🏢 New Corporate Enquiry from ${data.company}`,
    html: `
      <h2>New Corporate Enquiry</h2>
      <p><strong>Company:</strong> ${data.company}</p>
      <p><strong>Contact Person:</strong> ${data.name} ${data.designation ? `(${data.designation})` : ''}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Number of People:</strong> ${data.numberOfPeople}</p>
      <p><strong>Date Required:</strong> ${data.dateRequired ? dayjs(data.dateRequired).format('DD MMM YYYY') : 'N/A'}</p>
      <p><strong>Budget per Person:</strong> ₹${data.budgetPerPerson || 'N/A'}</p>
      <p><strong>Items Interested In:</strong></p>
      <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #ccc;">${data.itemsInterestedIn || 'N/A'}</blockquote>
      <p><strong>Special Requirements:</strong></p>
      <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #ccc;">${data.specialRequirements || 'N/A'}</blockquote>
      <p><em>Log in to the Admin Panel to reply.</em></p>
    `
  });

  return result;
};

export const update = (id: string, data: any) => repo.update(id, data);
export const remove = (id: string) => repo.deleteRecord(id);
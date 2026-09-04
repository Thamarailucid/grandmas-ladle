import * as repo from './contactEnquiry.repository.js';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../../utils/mailer.js';

export const getAll = () => repo.findAll();

export const create = async (data: any) => {
  const result = await repo.create({ id: uuidv4(), ...data });
  
  // Send email notification
  await sendEmail({
    subject: `🔔 New Contact Enquiry from ${data.name}`,
    html: `
      <h2>New Contact Enquiry</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
      <p><strong>Subject:</strong> ${data.subject || 'N/A'}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #ccc;">${data.message}</blockquote>
      <p><em>Log in to the Admin Panel to reply.</em></p>
    `
  });

  return result;
};

export const update = (id: string, data: any) => repo.update(id, data);
export const remove = (id: string) => repo.deleteRecord(id);
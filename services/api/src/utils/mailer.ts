import nodemailer from 'nodemailer';
import { database } from '../database/connection.js';
import { decrypt } from './crypto.js';

interface EmailPayload {
  to?: string;
  subject: string;
  html: string;
}

export const sendEmail = async (payload: EmailPayload) => {
  try {
    // 1. Fetch latest business settings for SMTP config
    const { rows } = await database.query('SELECT * FROM business_settings LIMIT 1');
    const settings = rows[0];

    if (!settings) {
      console.log('Mail skipped: No business settings found.');
      return false;
    }

    if (!settings.enable_email_notifications) {
      console.log('Mail skipped: Email notifications are disabled in settings.');
      return false;
    }

    const { smtp_host, smtp_port, smtp_user, smtp_password, notification_email } = settings;

    if (!smtp_host || !smtp_user || !smtp_password) {
      console.log('Mail skipped: SMTP credentials are not fully configured.');
      return false;
    }

    // 2. Configure transporter
    const transporter = nodemailer.createTransport({
      host: smtp_host,
      port: smtp_port || 587,
      secure: smtp_port === 465, // true for 465, false for other ports
      auth: {
        user: smtp_user,
        pass: decrypt(smtp_password),
      },
    });

    // 3. Send mail
    const to = payload.to || notification_email || smtp_user;
    
    if (!to) {
      console.log('Mail skipped: No recipient email provided or configured.');
      return false;
    }

    const info = await transporter.sendMail({
      from: `"Grandma's Ladle System" <${smtp_user}>`,
      to,
      subject: payload.subject,
      html: payload.html,
    });

    console.log(`Email sent successfully: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

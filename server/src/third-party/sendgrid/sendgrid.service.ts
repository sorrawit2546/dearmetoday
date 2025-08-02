import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SendgridService {
  constructor() {
    try {
      const apiKey = process.env.SENDGRID_API_KEY;
      if (!apiKey) {
        console.warn('SENDGRID_API_KEY is not set');
        return;
      }

      if (!apiKey.startsWith('SG.')) {
        console.warn(
          'SENDGRID_API_KEY format is invalid. Should start with SG.',
        );
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      sgMail.setApiKey(apiKey);
      console.log('SendGrid API key configured successfully');
    } catch (error) {
      console.warn('Failed to set SendGrid API key:', error);
    }
  }

  // sendgrid.service.ts

  async sendPositiveNoteEmail(
    toEmail: string,
    imageUrls: string[],
    message: string,
  ) {
    // ตรวจสอบ environment variables
    const mailFrom = process.env.MAIL_FROM;
    if (!mailFrom) {
      throw new Error('MAIL_FROM environment variable is not set');
    }

    // ตรวจสอบ email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mailFrom)) {
      throw new Error(
        `MAIL_FROM "${mailFrom}" is not a valid email address. Must contain @ symbol and valid domain.`,
      );
    }

    const attachments = [];

    for (let i = 0; i < imageUrls.length; i++) {
      // ใช้ path ที่ถูกต้องสำหรับ Docker container
      const imagePath = path.join(
        process.cwd(),
        'uploads',
        path.basename(imageUrls[i]),
      );

      try {
        const buffer = fs.readFileSync(imagePath);
        const base64Image = buffer.toString('base64');

        attachments.push(
          {
            content: base64Image,
            filename: `image-${i + 1}.jpg`,
            type: 'image/jpeg',
            disposition: 'attachment',
          },
          {
            content: base64Image,
            filename: `image-${i + 1}-inline.jpg`,
            type: 'image/jpeg',
            disposition: 'inline',
            content_id: `img${i}`,
          },
        );
      } catch (error) {
        console.error(`Failed to read image file: ${imagePath}`, error);
        // ข้ามไฟล์ที่อ่านไม่ได้
        continue;
      }
    }

    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const msg = {
      to: toEmail,
      from: mailFrom,
      subject: `Your Positive Note on (${today})`,
      text: `
        ข้อความ Positive Note ของคุณ:

        "${message}"

        ภาพประกอบของคุณ:
        ${imageUrls.map((_, i) => `รูปภาพ ${i + 1} แนบมาด้วย`).join('\n')}

        -- 
        ส่งจาก DearMeToday App
        `,
        html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 24px; background-color: #ffffff; color: #333;">
          <h2 style="color: #2c3e50; font-size: 20px; margin-bottom: 12px;">🌱 Your Positive Note</h2>
          
          <blockquote style="font-style: italic; background: #f9f9f9; padding: 16px; border-left: 4px solid #7f8c8d; margin-bottom: 24px; line-height: 1.6;">
            ${message}
          </blockquote>
          
          <h3 style="font-size: 16px; color: #2c3e50; margin-bottom: 8px;">📸 Attached Image${imageUrls.length > 1 ? 's' : ''}</h3>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${imageUrls.map((_, i) => `<img src="cid:img${i}" width="100%" style="max-width: 300px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);" alt="Image ${i + 1}" />`).join('')}
          </div>
      
          <p style="font-size: 12px; color: #888; margin-top: 32px;">
            Sent via <strong>DearMeToday App</strong><br/>
            If you did not request this note, please ignore this email.
          </p>
        </div>
      `,
      attachments,
    };

    console.log('Sending email with details:', {
      to: toEmail,
      from: mailFrom,
      subject: msg.subject,
      attachmentsCount: attachments.length,
    });

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await sgMail.send(msg);
      console.log('Email sent successfully to:', toEmail);
    } catch (sendError) {
      console.error('Failed to send email:', sendError);
      throw sendError;
    }
  }
}

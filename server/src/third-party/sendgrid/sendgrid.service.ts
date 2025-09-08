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
    message2: string,
    message3: string,
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
        "${message2}"
        "${message3}"

        ภาพประกอบของคุณ:
        ${imageUrls.map((_, i) => `รูปภาพ ${i + 1} แนบมาด้วย`).join('\n')}

        -- 
        ส่งจาก DearMeToday App
        `,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 640px; 
            margin: auto; 
            padding: 32px; 
            background-color: #eaf4fb; 
            background-image: linear-gradient(180deg, #f0f6fb, #eaf4fb);
            color: #2c3e50;
            border-radius: 16px;
            box-shadow: 0 6px 16px rgba(0,0,0,0.1);">

  <!-- Envelope flap -->
  <div style="width: 0; height: 0; 
              border-left: 320px solid transparent; 
              border-right: 320px solid transparent; 
              border-bottom: 120px solid #b3d3eb; 
              margin: -32px auto 0 auto; 
              border-radius: 8px 8px 0 0;">
  </div>

  <!-- Letter body -->
  <div style="background: #ffffff; 
              padding: 28px; 
              border-radius: 12px; 
              border: 1px solid #d0e3f0;
              margin-top: -60px;
              box-shadow: 0 4px 10px rgba(0,0,0,0.08);">

    <h2 style="color: #2c3e50; font-size: 22px; margin-bottom: 20px; text-align: center;">
      ✉️ Dear Me, Today
    </h2>
    
    <h3 style="color: #2c3e50; font-size: 18px; margin-bottom: 10px;">🌱 เรื่องราวดี ๆ ที่อยากขอบคุณ...</h3>
    <blockquote style="font-style: italic; background: #f9fbfd; padding: 16px; border-left: 4px solid #4a90e2; margin-bottom: 24px; line-height: 1.6; border-radius: 6px;">
      ${message}
    </blockquote>
    
    <h3 style="color: #2c3e50; font-size: 18px; margin-bottom: 10px;">🌱 สิ่งเล็ก ๆ ที่ทำให้คุณยิ้มได้...</h3>
    <blockquote style="font-style: italic; background: #f9fbfd; padding: 16px; border-left: 4px solid #4a90e2; margin-bottom: 24px; line-height: 1.6; border-radius: 6px;">
      ${message2}
    </blockquote>
    
    <h3 style="color: #2c3e50; font-size: 18px; margin-bottom: 10px;">🌱 เรื่องราวที่ทำให้คุณภูมิใจ...</h3>
    <blockquote style="font-style: italic; background: #f9fbfd; padding: 16px; border-left: 4px solid #4a90e2; margin-bottom: 24px; line-height: 1.6; border-radius: 6px;">
      ${message3}
    </blockquote>

    <h3 style="font-size: 16px; color: #2c3e50; margin-bottom: 8px;">📸 ภาพประกอบ</h3>
    <div style="display: flex; flex-direction: column; gap: 16px; align-items: center;">
      ${imageUrls.map((_, i) => `<img src="cid:img${i}" width="100%" style="max-width: 320px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.15);" alt="Image ${i + 1}" />`).join('')}
    </div>
    
    <p style="font-size: 12px; color: #555; margin-top: 32px; text-align: center;">
      Sent with warmth ❄️ via <strong>DearMeToday App</strong><br/>
      If you did not request this note, please ignore this email.
    </p>
  </div>
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
      await sgMail.send(msg);
      console.log('Email sent successfully to:', toEmail);
    } catch (sendError) {
      console.error('Failed to send email:', sendError);
      throw sendError;
    }
  }
}

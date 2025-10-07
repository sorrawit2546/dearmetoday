import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import type { Attachment } from 'resend';

@Injectable()
export class ResendService {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  private readonly resend = new Resend(process.env.RESEND_API_KEY);
  private readonly logger = new Logger(ResendService.name);
  private readonly mailFrom = process.env.MAIL_FROM;

  async sendPositiveNoteEmail(
    toEmail: string,
    imageUrls: string[],
    message: string,
    message2: string,
    message3: string,
  ) {
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // ✅ แนบไฟล์จาก Supabase (ไม่จำเป็น แต่เผื่ออยากดาวน์โหลด)
    const attachments: Attachment[] = [];
    for (let i = 0; i < imageUrls.length; i++) {
      try {
        const url = imageUrls[i];
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch image: ${url}`);
        const buffer = Buffer.from(await response.arrayBuffer());
        attachments.push({
          filename: `image-${i + 1}.${url.split('.').pop()?.toLowerCase() ?? 'jpg'}`,
          content: buffer.toString('base64'),
        });
      } catch (error) {
        this.logger.warn(`⚠️ Failed to attach image ${imageUrls[i]}: ${error}`);
      }
    }

    // ✅ HTML Cozy Envelope Style
    const html = `
      <div style="
        font-family: 'Segoe UI', 'Noto Sans Thai', sans-serif;
        max-width: 640px;
        margin: 40px auto;
        background-color: #fdfcf8;
        border-radius: 24px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        overflow: hidden;
      ">

        <!-- Envelope flap -->
        <div style="
          width: 0; height: 0;
          border-left: 320px solid transparent;
          border-right: 320px solid transparent;
          border-bottom: 100px solid #e3d5ca;
          margin: 0 auto;
          border-radius: 8px 8px 0 0;
        "></div>

        <!-- Letter body -->
        <div style="
          background: #fffaf4;
          padding: 28px 32px;
          border: 1px solid #e6e2d3;
          border-radius: 16px;
          margin-top: -60px;
        ">
          <h2 style="
            text-align: center;
            font-size: 22px;
            color: #5b4636;
            margin-bottom: 16px;
          ">
            ✉️ Dear Me, Today
          </h2>

          <p style="color:#6b4f3f;font-size:15px;line-height:1.6;">
            🌿 <strong>เรื่องราวดี ๆ ที่อยากขอบคุณ:</strong>
          </p>
          <blockquote style="
            font-style: italic;
            background: #fcf8f3;
            border-left: 4px solid #d5bda5;
            padding: 12px 16px;
            margin: 8px 0 20px 0;
            border-radius: 6px;
          ">
            ${message}
          </blockquote>

          <p style="color:#6b4f3f;font-size:15px;line-height:1.6;">
            ☀️ <strong>สิ่งเล็ก ๆ ที่ทำให้คุณยิ้มได้:</strong>
          </p>
          <blockquote style="
            font-style: italic;
            background: #fcf8f3;
            border-left: 4px solid #d5bda5;
            padding: 12px 16px;
            margin: 8px 0 20px 0;
            border-radius: 6px;
          ">
            ${message2}
          </blockquote>

          <p style="color:#6b4f3f;font-size:15px;line-height:1.6;">
            🍃 <strong>เรื่องราวที่ทำให้คุณภูมิใจ:</strong>
          </p>
          <blockquote style="
            font-style: italic;
            background: #fcf8f3;
            border-left: 4px solid #d5bda5;
            padding: 12px 16px;
            margin: 8px 0 28px 0;
            border-radius: 6px;
          ">
            ${message3}
          </blockquote>

          ${
            imageUrls.length
              ? `
              <h3 style="color:#5b4636;font-size:16px;margin-bottom:8px;">📸 ภาพประกอบ</h3>
              <div style="
                display:grid;
                grid-template-columns:repeat(auto-fit,minmax(160px,1fr));
                gap:10px;
                margin-top:12px;
              ">
                ${imageUrls
                  .map(
                    (url) => `
                      <div style="border-radius:12px;overflow:hidden;box-shadow:0 3px 10px rgba(0,0,0,0.1);">
                        <img src="${url}" alt="note image"
                          style="width:100%;height:100%;object-fit:cover;display:block;">
                      </div>
                    `,
                  )
                  .join('')}
              </div>
            `
              : ''
          }

          <p style="
            font-size:12px;
            color:#8b7b6f;
            margin-top:32px;
            text-align:center;
          ">
            ✨ Sent with warmth & kindness via <strong>DearMeToday</strong><br/>
            (${today})
          </p>
        </div>
      </div>
    `;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const { data, error } = await this.resend.emails.send({
        from: this.mailFrom,
        to: toEmail,
        subject: `Your Positive Note on (${today})`,
        html,
        attachments,
      });

      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (error) throw error;

      this.logger.log(
        `✅ Resend sent cozy email to ${toEmail} with ${attachments.length} image(s)`,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return data;
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`❌ Failed to send email via Resend: ${err.message}`);
      throw err;
    }
  }
}

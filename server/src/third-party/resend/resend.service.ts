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
        background-color: #faf8f4;
        border-radius: 24px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        overflow: hidden;
      ">

  <!-- Christmas flap -->
  <div style="
          width: 0; height: 0;
          border-left: 320px solid transparent;
          border-right: 320px solid transparent;
          border-bottom: 100px solid #b22222; /* Christmas red */
          margin: 0 auto;
          border-radius: 8px 8px 0 0;
        "></div>

  <!-- Letter body -->
  <div style="
          background: #fffdf9;
          padding: 28px 32px;
          border: 1px solid #e6e2d3;
          border-radius: 16px;
          margin-top: -60px;
        ">

    <h2 style="
            text-align: center;
            font-size: 22px;
            color: #8b1e22;
            margin-bottom: 16px;
          ">
      🎄 Dear Me, Today
    </h2>

    <p style="color:#5c3d2e;font-size:15px;line-height:1.6;">
      🌟 <strong>เรื่องราวดี ๆ ที่อยากขอบคุณ (Christmas Edition):</strong>
    </p>
    <blockquote style="
            font-style: italic;
            background: #faf5ef;
            border-left: 4px solid #2e8b57; /* Christmas green */
            padding: 12px 16px;
            margin: 8px 0 20px 0;
            border-radius: 6px;
          ">
      ${message}
    </blockquote>

    <p style="color:#5c3d2e;font-size:15px;line-height:1.6;">
      ❄️ <strong>สิ่งเล็ก ๆ ที่ทำให้คุณยิ้มได้:</strong>
    </p>
    <blockquote style="
            font-style: italic;
            background: #faf5ef;
            border-left: 4px solid #2e8b57;
            padding: 12px 16px;
            margin: 8px 0 20px 0;
            border-radius: 6px;
          ">
      ${message2}
    </blockquote>

    <p style="color:#5c3d2e;font-size:15px;line-height:1.6;">
      🎁 <strong>เรื่องราวที่ทำให้คุณภูมิใจ:</strong>
    </p>
    <blockquote style="
            font-style: italic;
            background: #faf5ef;
            border-left: 4px solid #2e8b57;
            padding: 12px 16px;
            margin: 8px 0 28px 0;
            border-radius: 6px;
          ">
      ${message3}
    </blockquote>

    ${
      imageUrls.length
        ? `
        <h3 style="color:#8b1e22;font-size:16px;margin-bottom:8px;">📸 ภาพประกอบวันนี้</h3>
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
      🎄 Sending warmth & gentle cheer via <strong>DearMeToday</strong><br/>
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

  async sendReminderEmail(toEmail: string, name: string) {
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const html = `
      <div style="
        font-family: 'Segoe UI', 'Noto Sans Thai', sans-serif;
        max-width: 640px;
        margin: 40px auto;
        background-color: #faf8f4;
        border-radius: 24px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        overflow: hidden;
      ">

  <!-- Christmas Top Accent -->
  <div style="
          width: 0; height: 0;
          border-left: 320px solid transparent;
          border-right: 320px solid transparent;
          border-bottom: 100px solid #c0392b;
          margin: 0 auto;
          border-radius: 8px 8px 0 0;
        "></div>

  <div style="
          background: #fffdf9;
          padding: 28px 32px;
          border: 1px solid #e6e2d3;
          border-radius: 16px;
          margin-top: -60px;
        ">

    <h2 style="
            text-align: center;
            font-size: 22px;
            color: #8b1e22; 
            margin-bottom: 20px;
          ">
      🎄 Gentle Reminder from Dear Me,Today
    </h2>

    <p style="color:#5c3d2e;font-size:15px;line-height:1.7;">
      สวัสดี <strong>${name}</strong> 🎁💛<br/><br/>
      ตอนนี้เลยเวลา <strong>สามทุ่ม</strong> มาแล้วนะ!<br/>
      และวันนี้คุณยังไม่ได้เขียน <strong>Gratitude Journal</strong> เลย 🎄
    </p>

    <p style="color:#5c3d2e;font-size:15px;line-height:1.7;margin-top:12px;">
      ลองเขียนสั้น ๆ สัก 1 นาทีเหมือนเป็น “ของขวัญให้ตัวเอง”  
      เรื่องเล็ก ๆ ที่ทำให้คุณรู้สึกดี… มีค่ามากเสมอในช่วงเทศกาลอบอุ่นแบบนี้ 💛
    </p>

    <!-- CTA Button -->
    <div style="text-align:center; margin:22px 0 12px 0;">
      <a href="https://dearme.today" target="_blank"
         style="
            background:#c0392b;
            color:#fff;
            padding:12px 22px;
            border-radius:8px;
            text-decoration:none;
            font-size:14px;
            font-weight:bold;
            display:inline-block;
         ">
        ✨ เขียน Gratitude Journal ตอนนี้
      </a>
    </div>

    <div style="
            background:#faf5ef;
            padding:16px 18px;
            border-left:4px solid #2e8b57;
            border-radius:8px;
            margin:24px 0;
            color:#5c3d2e;
            font-size:15px;
          ">
      ✏️ <strong>คำถามช่วยเริ่มต้น (Christmas Edition):</strong><br/>
      – วันนี้มีเรื่องไหนที่คุณรู้สึก “โชคดีเหมือนได้รับของขวัญ”?<br/>
      – อะไรที่ทำให้คุณยิ้มเหมือนได้ยินเพลงคริสต์มาส?<br/>
      – คุณภูมิใจอะไรในตัวเองวันนี้ แม้จะเป็นเรื่องเล็ก ๆ? 🎁
    </div>

    <p style="
            font-size:12px;
            color:#8b7b6f;
            margin-top:32px;
            text-align:center;
          ">
      การทบทวนวันของตัวเองช่วงปลายปี  
      คือหนึ่งในของขวัญที่ดีที่สุดที่คุณจะให้กับ “ตัวคุณในปีหน้า” 🎄<br/><br/>

      ✨ With warmth & kindness via 
      <strong>
        <a href="https://dearmetoday.com" 
           style="color:#8b1e22; text-decoration:none; font-weight:bold;" 
           target="_blank">
           DearMeToday
        </a>
      </strong><br/>

      (${today})
    </p>

  </div>
</div>


    `;

    try {
      const { data, error } = await this.resend.emails.send({
        from: this.mailFrom,
        to: toEmail,
        subject: `Gentle Reminder | Have you written your Gratitude Journal today?`,
        html,
      });

      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (error) throw error;

      this.logger.log(`📨 Reminder email sent to ${toEmail} (${name})`);
      return data;
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`❌ Failed to send reminder email: ${err.message}`);
      throw err;
    }
  }
}

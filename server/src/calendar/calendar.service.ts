import { Injectable } from '@nestjs/common';
import { calendar_v3, google } from 'googleapis';

@Injectable()
export class CalendarService {
  async createPositiveNoteEvent(
    accessToken: string,
    note: { line1: string; mood: string; imageUrl: string[] },
  ): Promise<calendar_v3.Schema$Event> {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const start = new Date();
    const end = new Date(start.getTime() + 30 * 60000);

    const event = {
      summary: `Positive Note - ${note.mood}`,
      description: `💡 ${note.line1}`,
      start: { dateTime: start.toISOString(), timeZone: 'Asia/Bangkok' },
      end: { dateTime: end.toISOString(), timeZone: 'Asia/Bangkok' },
      attachments: note.imageUrl.map((url, i) => ({
        fileUrl: url,
        title: `Positive Note Image ${i + 1}`,
      })),
    };

    const tokenInfo = await oauth2Client.getTokenInfo(accessToken);
    console.log('Google Token Scopes:', tokenInfo.scopes);

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      supportsAttachments: true,
    });

    console.log('Calendar API Response:', response.data);
    return response.data;
  }
}

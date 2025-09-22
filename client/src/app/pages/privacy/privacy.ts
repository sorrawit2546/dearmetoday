import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-3xl mx-auto p-6 text-gray-800 leading-relaxed">
      <h1 class="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p class="mb-4">
        Dearme.Today collects only the information necessary to provide our service,
        including name, email, and profile picture obtained from Google Login.
      </p>

      <p class="mb-4">
        This data is used solely to authenticate users and enhance their journaling experience.
        We do not sell, rent, or share your personal information with third parties.
      </p>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Google Calendar Integration</h2>
      <p class="mb-4">
        When you connect your Google Account, Dearme.Today may request access to your Google Calendar.
        This is only used to create calendar events based on the notes you write in the app.
      </p>

      <p class="mb-4">
        For example, if you write a Positive Note, the system may add it to your Google Calendar
        as an event that helps you track your reflections over time.
        We only request the minimum scope
        (<code>https://www.googleapis.com/auth/calendar.events</code>)
        to insert events; we do not read, modify, or delete unrelated calendar data.
      </p>

      <p class="mb-4">
        Users may revoke access at any time through their Google Account settings.
      </p>

      <p class="mb-4">
        For any questions or data deletion requests, please contact us at
        <a href="mailto:contact@dearmetoday.com" class="text-blue-600 underline">
          contact@dearmetoday.com
        </a>
      </p>

      <p class="text-sm text-gray-500">
        Last updated: {{ today | date:'longDate' }}
      </p>
    </div>
  `,
})
export class PrivacyComponent {
  today = new Date();
}

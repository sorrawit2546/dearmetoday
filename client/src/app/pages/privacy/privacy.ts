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
        including your name, email, and profile picture obtained from Google Login.
      </p>

      <p class="mb-4">
        This information is used solely to authenticate users and enhance their journaling experience.
        We do not sell, rent, or share your personal information with third parties,
        except with essential service providers (e.g., email delivery services) that help us operate the app.
      </p>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Google Calendar Integration</h2>
      <p class="mb-4">
        When you connect your Google Account, Dearme.Today may request access to your Google Calendar.
        This is used only to create calendar events based on the notes you write in the app
        and to allow you to view the events that were created by Dearme.Today.
      </p>

      <p class="mb-4">
        We request the minimum necessary scopes:
        <code>https://www.googleapis.com/auth/calendar.events</code> (to insert and manage events you create with the app)
        and <code>https://www.googleapis.com/auth/calendar.events.readonly</code> (to allow you to view events created by Dearme.Today).
        We do not read, modify, or delete unrelated calendar data or settings.
      </p>

      <p class="mb-4">
        Users may revoke access at any time through their Google Account settings.
      </p>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Data Storage</h2>
      <p class="mb-4">
        Positive Notes and related information may be stored securely in our database
        to provide you with access to your past entries. This data is retained only as long as your account remains active.
        If you delete your account, we will remove your associated data from our systems.
      </p>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Policy Updates</h2>
      <p class="mb-4">
        We may update this Privacy Policy from time to time.
        If we make material changes in how we use your data,
        we will notify you through our website or via email.
      </p>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
      <p class="mb-4">
        For any questions, concerns, or data deletion requests, please contact us at
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

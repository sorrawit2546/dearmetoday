import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-3xl mx-auto p-6 text-gray-800 leading-relaxed">
      <h1 class="text-3xl font-bold mb-6">Terms of Service</h1>

      <p class="mb-4">
        By accessing or using Dearme.Today ("the Service"), you agree to the following terms and conditions.
        Please read them carefully.
      </p>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Use of Service</h2>
      <p class="mb-4">
        Dearme.Today is provided for personal journaling and reflection purposes.
        You agree not to misuse the Service or use it for unlawful activities.
      </p>

      <h2 class="text-2xl font-semibold mt-8 mb-4">User Accounts</h2>
      <p class="mb-4">
        You may be required to log in with your Google Account to use certain features.
        You are responsible for maintaining the confidentiality of your account and ensuring its proper use.
      </p>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Privacy</h2>
      <p class="mb-4">
        Your use of the Service is also governed by our
        <a routerLink="/privacy" class="text-blue-600 underline">Privacy Policy</a>.
        Please review it to understand how we collect, use, and protect your data.
      </p>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Service Availability</h2>
      <p class="mb-4">
        The Service is provided "as is" without warranties of availability, reliability, or uninterrupted access.
        We may modify, suspend, or discontinue the Service at any time without prior notice.
      </p>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Limitation of Liability</h2>
      <p class="mb-4">
        Dearme.Today and its operators are not liable for any direct, indirect, incidental, or consequential damages
        arising from your use of the Service, including but not limited to loss of data.
      </p>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Changes to Terms</h2>
      <p class="mb-4">
        We may update these Terms of Service from time to time.
        Continued use of the Service after updates constitutes acceptance of the revised terms.
      </p>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Contact</h2>
      <p class="mb-4">
        For questions, concerns, or support, please contact us at
        <a href="mailto:contact@dearmetoday.com" class="text-blue-600 underline">contact@dearmetoday.com</a>.
      </p>

      <p class="text-sm text-gray-500">
        Last updated: {{ today | date:'longDate' }}
      </p>
    </div>
  `,
})
export class TermsComponent {
  today = new Date();
}

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
        By using Dearme.Today, you agree to the following terms:
      </p>

      <ol class="list-decimal ml-6 mb-6 space-y-2">
        <li>
          You will use the service responsibly and only for personal journaling purposes.
        </li>
        <li>
          The service is provided "as is" without warranties of availability, reliability, or data retention.
        </li>
        <li>
          We may update these terms at any time. Continued use of the service indicates acceptance of the updated terms.
        </li>
        <li>
          For support or questions, contact us at
          <a href="mailto:support@dearme.today" class="text-blue-600 underline">support@dearmetoday.com</a>
        </li>
      </ol>

      <p class="text-sm text-gray-500">
        Last updated: {{ today | date:'longDate' }}
      </p>
    </div>
  `,
})
export class TermsComponent {
  today = new Date();
}

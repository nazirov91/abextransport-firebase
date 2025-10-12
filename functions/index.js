const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = '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';
const RECIPIENT_EMAIL = 'contact@abextransport.com';
const FALLBACK_FROM_EMAIL = 'no-reply@sales.abextransport.com';

sgMail.setApiKey(SENDGRID_API_KEY);

exports.submitContactForm = onRequest({ cors: true, region: 'us-central1' }, async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name, email, phone, subject, message } = req.body || {};

  if (!name || !email || !phone || !subject || !message) {
    res.status(400).json({ error: 'Missing required form data' });
    return;
  }

  const plainTextMessage = [
    `New contact request from Abex Transport (abextransport.com)`,
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Subject: ${subject}`,
    '',
    'Message:',
    message,
  ].join('\n');

  const htmlMessage = `
    <h2>New contact request from Abex Transport landing page</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
  `;

  try {
    await sgMail.send({
      to: RECIPIENT_EMAIL,
      from: FALLBACK_FROM_EMAIL,
      replyTo: email,
      subject: `[Contact Form - abextransport.com] ${subject}`,
      text: plainTextMessage,
      html: htmlMessage,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Failed to send contact form email via SendGrid', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

function escapeHtml(input) {
  return String(input).replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#039;';
      default:
        return char;
    }
  });
}

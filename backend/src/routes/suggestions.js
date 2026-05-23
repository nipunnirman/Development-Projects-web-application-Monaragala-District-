import express from 'express';
import nodemailer from 'nodemailer';
import Suggestion from '../models/Suggestion.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, contactInfo, suggestion } = req.body;

    if (!contactInfo || !suggestion) {
      return res.status(400).json({ success: false, message: 'Contact info and suggestion text are required' });
    }

    // 1. Save to Database
    const newSuggestion = new Suggestion({ name, contactInfo, suggestion });
    await newSuggestion.save();

    // 2. Email Forwarding
    const recipient = process.env.RECIPIENT_EMAIL || 'dccmonaragala@gmail.com';
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    let emailSent = false;
    let emailError = null;

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465, // true for 465, false for other ports
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const mailOptions = {
          from: `"Monaragala Dev Projects" <${smtpUser}>`,
          to: recipient,
          subject: 'New Suggestion / Feedback Received (යෝජනාවක් ලැබී ඇත)',
          html: `
            <div style="font-family: sans-serif; padding: 20px; line-height: 1.6; max-width: 600px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <h2 style="color: #0F172A; border-bottom: 2px solid #C9A84C; padding-bottom: 8px;">New Suggestion Received</h2>
              <p style="margin: 16px 0;"><strong>Name (නම):</strong> ${name || 'Anonymous (නොදනී)'}</p>
              <p style="margin: 16px 0;"><strong>Contact Info (දුරකථන / විද්‍යුත් තැපෑල):</strong> ${contactInfo}</p>
              <div style="background-color: #F8FAFC; border-left: 4px solid #C9A84C; padding: 16px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; font-weight: bold;">Suggestion (යෝජනාව):</p>
                <p style="margin: 8px 0 0 0; white-space: pre-wrap;">${suggestion}</p>
              </div>
              <p style="font-size: 12px; color: #64748B; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 12px;">
                Submitted on: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })} (Sri Lanka Time)
              </p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        emailSent = true;
        console.log(`✉️ Email successfully forwarded to ${recipient}`);
      } catch (err) {
        emailError = err.message;
        console.error('❌ Failed to send suggestion email:', err);
      }
    } else {
      console.warn('⚠️ SMTP credentials not configured in environment. Skipping email sending.');
    }

    res.status(201).json({
      success: true,
      message: 'Suggestion submitted successfully',
      data: newSuggestion,
      emailSent,
      emailError
    });
  } catch (error) {
    console.error('❌ Error handling suggestion:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;

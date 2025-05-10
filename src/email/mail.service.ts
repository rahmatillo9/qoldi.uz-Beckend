import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Gmail SMTP server
      auth: {
        user: process.env.MAIL_USER, // Gmail manzilingiz
        pass: process.env.MAIL_PASS, // Gmail App Password
      },
      debug: true, // Debug rejimi yoqiladi
      logger: true, // Loglarni ko‘rsatis
    });
  }

  // Email yuborish metodi
  async sendEmail(to: string, subject: string, text: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"U BOX" <${process.env.MAIL_USER}>`,
        to,
        subject,
        text,
      });

      console.log(`✅ Email yuborildi: ${info.messageId}`);
      console.log(`📩 SMTP Response:`, info.response);
    } catch (error) {
      console.error(`❌ Email jo‘natishda xatolik:`, error);
    }
  }

  // Tasdiqlash kodi yuborish funksiyasi
  async sendVerificationEmail(to: string, code: string) {
    const subject = 'Tasdiqlash kodi';
    const text = `Sizning tasdiqlash kodingiz: ${code}`;
    await this.sendEmail(to, subject, text);
  }



}

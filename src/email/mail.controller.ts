// mail.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('send')
  async send(@Query('to') to: string, @Query('code') code: string) {
    await this.mailService.sendVerificationEmail(to, code);
    return { message: 'Email yuborildi' };
  }
}

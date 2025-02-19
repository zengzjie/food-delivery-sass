import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

type MailOptions = {
  to: string; // list of receivers
  subject: string; // Subject line
  template: string; // The path to the template file
  name: string; // Sender name
  activationCode: string; // Activation code
};

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail({ to, subject, template, name, activationCode }: MailOptions) {
    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context: {
        name,
        activationCode,
      },
    });
  }
}

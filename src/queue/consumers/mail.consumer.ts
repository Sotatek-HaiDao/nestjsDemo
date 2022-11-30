import { Processor, Process, OnQueueActive, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import queueConfig from 'src/config/queue.config';
import { SendgridService } from '../../services/sensdgrid.service';

@Processor(queueConfig().queue_name.send_mail)
export class MailConsumer {
  constructor(
    private readonly mailerService: MailerService,
    private readonly sendgridService: SendgridService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(job.data)}`)
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.logger.debug(`Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(result)}`)
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any) {
    this.logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`, error.stack)
  }

  @Process('invite_user')
  async sendInviteEmail(job: Job<{
    subject: string,
    email: string,
    redirectUrl: string,
    companyName: string,
    inviterName: string,
    message: string,
  }>) {
    try {
      return await this.sendgridService.sendInviteUserEmail(
        job.data.subject,
        job.data.email,
        {
          clientVerifyUrl: job.data.redirectUrl,
          companyName: job.data.companyName,
          inviterName: job.data.inviterName,
          message: job.data.message,
        }
      );
    } catch (error) {
      this.logger.error(`Failed to send invite email to '${job.data.email}'`, error.stack)
    }
  }

 
}
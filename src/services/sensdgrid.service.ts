const sgMail = require('@sendgrid/mail');
import {Inject, Injectable, Logger} from "@nestjs/common";
import {WINSTON_MODULE_PROVIDER} from "nest-winston";
import { ConfigType } from '@nestjs/config';
require('dotenv').config();
import sendgridConfig from 'src/config/sendgrid.config';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

@Injectable()
export class SendgridService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @Inject(sendgridConfig.KEY) private sendGridConfigure: ConfigType<typeof sendgridConfig>,
    ) {}

    async sendInviteUserEmail(
      subject: string,
      to: string,
      data: {
        clientVerifyUrl: string,
        companyName: string,
        inviterName: string,
        message: string,
      }
    ) {
        const sendData = {
            to: to,
            from: this.sendGridConfigure.inviteUser.sender,
            templateId: this.sendGridConfigure.inviteUser.templateId,
            dynamicTemplateData: {
                subject: subject,
                clientVerifyUrl: data.clientVerifyUrl,
                companyName: data.companyName,
                inviterName: data.inviterName,
                message: data.message,
                email: to
            },
            hideWarnings: true,
            mail_settings: {
                sandbox_mode: {
                    enable: this.sendGridConfigure.sandboxMode,
                }
            }
        };

        await sgMail.send(sendData);
    }

    async sendOfferEmail( 
        subject: string,
        to: string,
        data: {
          clientVerifyUrl: string,
          companyName: string,
          inviterName: string,
          message: string,
        }) {
            const sendData = {
                to: to,
                from: this.sendGridConfigure.offerTalent.sender,
                subject: subject,
                text: data.clientVerifyUrl,
                // templateId: this.sendGridConfigure.offerTalent.templateId,
                // dynamicTemplateData: {
                //     subject: subject,
                //     clientVerifyUrl: data.clientVerifyUrl,
                //     companyName: data.companyName,
                //     inviterName: data.inviterName,
                //     message: data.message,
                //     email: to
                // },
                hideWarnings: true,
                mail_settings: {
                    sandbox_mode: {
                        enable: this.sendGridConfigure.sandboxMode,
                    }
                }
            };
    
            await sgMail.send(sendData);
        }

        async sendInviteTalentEmail( subject: string,
            to: string,
            data: {
              clientVerifyUrl: string,
              companyName: string,
              inviterName: string,
              message: string,
            }) {
                const sendData = {
                    to: to,
                    from: this.sendGridConfigure.offerTalent.sender,
                    subject: subject,
                    text: data.clientVerifyUrl,
                    // templateId: this.sendGridConfigure.offerTalent.templateId,
                    // dynamicTemplateData: {
                    //     subject: subject,
                    //     clientVerifyUrl: data.clientVerifyUrl,
                    //     companyName: data.companyName,
                    //     inviterName: data.inviterName,
                    //     message: data.message,
                    //     email: to
                    // },
                    hideWarnings: true,
                    mail_settings: {
                        sandbox_mode: {
                            enable: this.sendGridConfigure.sandboxMode,
                        }
                    }
                };
        
                await sgMail.send(sendData);
            }
}
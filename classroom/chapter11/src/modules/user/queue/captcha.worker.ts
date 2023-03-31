import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job, Worker } from 'bullmq';
import chalk from 'chalk';
import { omit } from 'lodash';
import { Repository } from 'typeorm';

import { Configure } from '@/modules/core/configure';
import { SmsService, SmtpService } from '@/modules/core/providers';
import { RedisConfig, SmtpSendParams } from '@/modules/core/types';

import { EMAIL_CAPTCHA_JOB, SEND_CAPTCHA_QUEUE, SMS_CAPTCHA_JOB } from '../constants';
import { CaptchaEntity } from '../entities/captcha.entity';
import { EmailCaptchaOption, SendCaptchaQueueJob, SmsCaptchaOption } from '../types';

/**
 * 发信任务消费者
 */
@Injectable()
export class CaptchaWorker {
    constructor(
        @InjectRepository(CaptchaEntity)
        private captchaRepository: Repository<CaptchaEntity>,
        private readonly sms: SmsService,
        private readonly mailer: SmtpService,
        protected configure: Configure,
    ) {}

    async addWorker() {
        const redisConf = (await this.configure.get<RedisConfig>('redis')) ?? [];
        const connection = redisConf.find(({ name }) => name === 'default');
        return new Worker(
            SEND_CAPTCHA_QUEUE,
            async (job: Job<SendCaptchaQueueJob>) => this.sendCode(job),
            { concurrency: 10, connection },
        );
    }

    /**
     * 发送验证码
     * @param job
     */
    protected async sendCode(job: Job<SendCaptchaQueueJob>) {
        const { captcha } = job.data;
        try {
            if (job.name === SMS_CAPTCHA_JOB || job.name === EMAIL_CAPTCHA_JOB) {
                if (job.name === SMS_CAPTCHA_JOB) {
                    await this.sendSms(job.data);
                } else if (job.name === EMAIL_CAPTCHA_JOB) {
                    await this.sendEmail(job.data);
                }
                return await this.captchaRepository.save(
                    omit(captcha, ['created_at', 'updated_at']),
                );
            }
            return false;
        } catch (err) {
            console.log(chalk.red(err));
            throw new Error(err as string);
        }
    }

    /**
     * 发送短信验证码
     * @param data
     */
    protected async sendSms(data: SendCaptchaQueueJob) {
        const {
            captcha: { value, code },
            option,
            otherVars,
        } = data;
        const { template } = option as SmsCaptchaOption;
        const result = await this.sms.send({
            numbers: [value],
            template,
            vars: otherVars ? { code, ...otherVars } : { code },
        });
        return result;
    }

    /**
     * 发送邮件验证码
     * @param data
     */
    protected async sendEmail(data: SendCaptchaQueueJob) {
        const {
            captcha: { action, value, code },
            option,
        } = data;
        const { template, subject } = option as EmailCaptchaOption;
        return this.mailer.send<SmtpSendParams & { template?: string }>({
            name: action,
            subject,
            template,
            html: !template,
            to: [value],
            vars: { code },
        });
    }
}

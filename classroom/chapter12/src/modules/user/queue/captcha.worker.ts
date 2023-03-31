import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job, Worker } from 'bullmq';
import chalk from 'chalk';
import { omit } from 'lodash';
import { Repository } from 'typeorm';

import { Configure } from '@/modules/core/configure';

import { RedisConfig } from '@/modules/redis/types';
import { SmsService, SmtpService } from '@/modules/sender/services';

import { SmtpSendParams } from '@/modules/sender/types';

import { EMAIL_CAPTCHA_JOB, PHONE_CAPTCHA_JOB, SEND_CAPTCHA_QUEUE } from '../constants';
import { CaptchaEntity } from '../entities/captcha.entity';
import { EmailCaptchaOption, PhoneCaptchaOption, SendCaptchaQueueJob } from '../types';

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
            if (job.name === PHONE_CAPTCHA_JOB || job.name === EMAIL_CAPTCHA_JOB) {
                if (job.name === PHONE_CAPTCHA_JOB) {
                    await this.sendPhone(job.data);
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
    protected async sendPhone(data: SendCaptchaQueueJob) {
        const {
            captcha: { value, code },
            option,
            otherVars,
        } = data;
        const { template } = option as PhoneCaptchaOption;
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

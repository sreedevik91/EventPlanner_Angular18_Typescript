import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import { IEmailService } from '../interfaces/userInterface'

dotenv.config()


export class EmailService implements IEmailService {

    async sendMail(name: string, email: string, content: string, subject: string): Promise<boolean> {

        return new Promise((resolve, reject) => {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // TLS
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_APP_PASSWORD
                },
                connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 5000, // 5 seconds
            })

            let mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: `${subject}`,
                html: `
                <div>
                <p>Dear ${name}, </p>
                <p></p>
                <p>${content}</p>
                <p></p>
                <p>Warm Regards,</p>
                <p>Admin</p>
                <p>Dream Events</p>
                </div>
                `
            }

            transporter.sendMail(mailOptions, (error, info) => {
                // console.log(error)
                if (error) {
                    // console.log('Email send error: ', error);
                    console.error('Email send error:', {
                        message: error.message,
                        stack: error.stack,
                        error:error
                      });
                    resolve(false)
                } else {
                    console.log('Email sent:', info.response);
                    resolve(true)
                }

            })

        })

    }
}
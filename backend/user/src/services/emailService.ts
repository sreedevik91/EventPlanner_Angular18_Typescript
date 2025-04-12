import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import { Resend } from 'resend';
import { IEmailService } from '../interfaces/userInterface'

dotenv.config()

const resend = new Resend(process.env.RESEND_APIKEY);

export class EmailService implements IEmailService {

    async sendMail(name: string, email: string, content: string, subject: string): Promise<boolean> {

        return new Promise(async (resolve, reject) => {
            // const transporter = nodemailer.createTransport({
            //     // service: 'gmail',
            //     // // host: 'smtp.gmail.com',
            //     // // port: 587,
            //     // // secure: false, // TLS
            //     // auth: {
            //     //     user: process.env.EMAIL_USER,
            //     //     pass: process.env.EMAIL_APP_PASSWORD
            //     // },
            //     // // connectionTimeout: 10000, // 10 seconds
            //     // // greetingTimeout: 5000, // 5 seconds

            //     host: 'localhost', // Point to the local machine running the tunnel/;
            //     // host:'111.92.78.138',
            //     port: 2525, // Match the tunnel port
            //     secure: false, // TLS negotiated
            //     auth: {
            //         user: process.env.EMAIL_USER,
            //         pass: process.env.EMAIL_APP_PASSWORD,
            //     },
            //     connectionTimeout: 10000,
            //     greetingTimeout: 5000,
            //     debug: true,
            // })

            let mailOptions = {
                // from: process.env.EMAIL_USER,
                from: process.env.RESEND_EMAIL!,
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
            
            // transporter.sendMail(mailOptions, (error, info) => {
            //     // console.log(error)
            //     if (error) {
            //         // console.log('Email send error: ', error);
            //         console.error('Email send error:', {
            //             message: error.message,
            //             stack: error.stack,
            //             error: error
            //         });
            //         resolve(false)
            //     } else {
            //         console.log('Email sent:', info.response);
            //         resolve(true)
            //     }
            // })

            try {
                const data = await resend.emails.send(mailOptions);
            
                console.log('Email sent:', data);
                resolve(true)
              } catch (error) {
                console.error('Error:', error);
                resolve(false)
              }

        })

    }
}



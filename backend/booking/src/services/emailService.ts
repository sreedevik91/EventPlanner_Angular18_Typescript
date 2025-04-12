import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { Resend } from 'resend';
import { IEmailService } from '../interfaces/bookingInterfaces'

dotenv.config()

const resend = new Resend(process.env.RESEND_APIKEY);

export class EmailService implements IEmailService {

    async sendMail(name: string, email: string, content: string, subject: string): Promise<boolean> {

        return new Promise(async (resolve, reject) => {
            // const transporter = nodemailer.createTransport({
            //     service: 'gmail',
            //     auth: {
            //         user: process.env.EMAIL_USER,
            //         pass: process.env.EMAIL_APP_PASSWORD
            //     }
            // })

            // let mailOptions = {
            //     from: process.env.EMAIL_USER,
            //     to: email,
            //     subject: `${subject}`,
            //     html: `
            //     <div>
            //     <p>Dear ${name}, </p>
            //     <p></p>
            //     <p>${content}</p>
            //     <p></p>
            //     <p>Warm Regards,</p>
            //     <p>Admin</p>
            //     <p>Dream Events</p>
            //     </div>
            //     `
            // }

            // transporter.sendMail(mailOptions, (error, info) => {
            //     // console.log(error)
            //     if (error) {
            //         console.log(error);
            //         resolve(false)
            //     } else {
            //         resolve(true)
            //     }

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
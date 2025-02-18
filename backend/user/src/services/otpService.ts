import { IEmailService, IOtpService, IUserDb, IUserRepository } from "../interfaces/userInterface"
import otpGenerator from 'otp-generator'


export class OtpService implements IOtpService {

    constructor(
        private userRepository: IUserRepository,
        private emailService: IEmailService
    ) { }

    async sendOtp(user:IUserDb) {

        try {

            const {name,email,_id:userId}= user

            let otp = otpGenerator.generate(4, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
            let otpData = {
                otp,
                expiresIn: Date.now() + (60 * 1000)
            }

            let content = `
                <p>Please find below OTP for verification</p>
                <p>${otp}</p>
                `
            let subject = "Verification OTP !"

            let response = await this.emailService.sendMail(name, email, content, subject)
            console.log('send otp response: ', response);

            if (!response) {
                console.log('OTP not sent to email');
                return false
            }

            const updatedUser = await this.userRepository.updateUser(userId, { otpData: otpData })

            if(!updatedUser){
                console.log('Could not update OTP');
                return false
            }

            console.log('OTP sent to email');
            return true
        }  catch (error: unknown) {
            error instanceof Error ? console.log('Error message from sendOtp service: ', error.message) : console.log('Unknown error from sendOtp service: ', error)
            return null
        }

    }

    async verifyOtp(inputOtp: string, user:IUserDb) {
        try {
            const {_id:userId,otpData}=user
            console.log('dbTime: ', otpData?.expiresIn);
            console.log('timeNow: ', Date.now());
            let expiry = Number(otpData?.expiresIn)
            if (Date.now() > expiry) {
                console.log('otp expired');
                return false
            }

            if (inputOtp === otpData?.otp) {
                console.log('otp matched');
                return true

            } else {
                console.log('otp not matched');
                return false
            }

        }  catch (error: unknown) {
            error instanceof Error ? console.log('Error message from verifyOtp service: ', error.message) : console.log('Unknown error from verifyOtp service: ', error)
            return null
        }

    }

}
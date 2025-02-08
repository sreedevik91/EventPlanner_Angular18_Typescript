import bcrypt from 'bcryptjs'
import { log } from 'console'
import { IPasswordService } from '../interfaces/userInterface';

export class PasswordService implements IPasswordService{
    async hashPassword(password: string) {
        try {
            const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10))
            return hashedPassword
        } catch (error:any) {
            console.log('hashPassword error: ',error.message);
            return null
        }
    }

    async verifyPassword(inputPassword: string, userPassword: string) {
        try {
            const isPAsswordMatch = await bcrypt.compare(inputPassword, userPassword)
            console.log('isPAsswordMatch: ',isPAsswordMatch);
            return isPAsswordMatch
        } catch (error:any) {
            console.log('verifyPassword error: ',error.message);
            return null
        }
    }
}
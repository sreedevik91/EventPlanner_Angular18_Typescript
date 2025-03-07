"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const otp_generator_1 = __importDefault(require("otp-generator"));
class OtpService {
    constructor(userRepository, emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    sendOtp(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, _id: userId } = user;
                let otp = otp_generator_1.default.generate(4, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
                let otpData = {
                    otp,
                    expiresIn: Date.now() + (60 * 1000)
                };
                let content = `
                <p>Please find below OTP for verification</p>
                <p>${otp}</p>
                `;
                let subject = "Verification OTP !";
                let response = yield this.emailService.sendMail(name, email, content, subject);
                console.log('send otp response: ', response);
                if (!response) {
                    console.log('OTP not sent to email');
                    return false;
                }
                const updatedUser = yield this.userRepository.updateUser(userId, { otpData: otpData });
                if (!updatedUser) {
                    console.log('Could not update OTP');
                    return false;
                }
                console.log('OTP sent to email');
                return true;
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from sendOtp service: ', error.message) : console.log('Unknown error from sendOtp service: ', error);
                return null;
            }
        });
    }
    verifyOtp(inputOtp, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id: userId, otpData } = user;
                console.log('dbTime: ', otpData === null || otpData === void 0 ? void 0 : otpData.expiresIn);
                console.log('timeNow: ', Date.now());
                let expiry = Number(otpData === null || otpData === void 0 ? void 0 : otpData.expiresIn);
                if (Date.now() > expiry) {
                    console.log('otp expired');
                    return false;
                }
                if (inputOtp === (otpData === null || otpData === void 0 ? void 0 : otpData.otp)) {
                    console.log('otp matched');
                    return true;
                }
                else {
                    console.log('otp not matched');
                    return false;
                }
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from verifyOtp service: ', error.message) : console.log('Unknown error from verifyOtp service: ', error);
                return null;
            }
        });
    }
}
exports.OtpService = OtpService;

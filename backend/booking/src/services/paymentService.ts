import Razorpay from "razorpay";
import { config } from "dotenv";
import { IPaymentService, IRazorpayResponse } from "../interfaces/bookingInterfaces";
import crypto from 'crypto'

config()

export class PaymentService implements IPaymentService {

    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_SECRET!
    })

    async createOrder(bookingId: string, amount: number) {

        try {
            const order = await this.razorpay.orders.create({
                amount: amount * 100,
                currency: 'INR',
                receipt: bookingId.toString()
            })

            console.log('razorpay order: ', order);

            return order.id

        } catch (error) {
            console.log('razorpay create order error: ', error);
            return null
        }
    }

    async verifyOrder(razorpayResponse: IRazorpayResponse) {

        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = razorpayResponse
            const generatedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_SECRET!)
                .update(razorpay_order_id + '|' + razorpay_payment_id)
                .digest('hex');

            if (generatedSignature !== razorpay_signature) {
                return false
            }
            return true
            
        } catch (error) {
            console.log('razorpay create order error: ', error);
            return false
        }

    }

}


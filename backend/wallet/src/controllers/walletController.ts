import { NextFunction, Request, Response } from "express"
// import bookingServices from "../services/bookingServices";
import { CONTROLLER_RESPONSES, HttpStatusCodes, IWalletController, IWalletService } from "../interfaces/walletInterfaces";
import { AppError } from "../utils/appError";
import { ResponseHandler } from "../middlewares/responseHandler";


export class WalletController implements IWalletController {

    constructor(
        private walletServices: IWalletService
    ) { }

    async getWalletById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params
            const walletData = await this.walletServices.getWalletById(id)
            console.log('getWalletById controller response: ', walletData);
            walletData?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, walletData) : next(new AppError(walletData))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getWalletById controller: ', error.message) : console.log('Unknown error from getWalletById controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))
        }
    }

    async getWalletByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.params
            const userWalletData = await this.walletServices.getWalletByUserId(userId)
            console.log('getWalletByUserId controller response: ', userWalletData);
            userWalletData?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, userWalletData) : next(new AppError(userWalletData))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getWalletByUserId controller: ', error.message) : console.log('Unknown error from getWalletByUserId controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))
        }
    }

    async updateWalletById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params
            const { data } = req.body
            const updatedWallet = await this.walletServices.updateWalletById(id, data)
            console.log('updateWalletById controller response: ', updatedWallet);
            updatedWallet?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, updatedWallet) : next(new AppError(updatedWallet))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from updateWalletById controller: ', error.message) : console.log('Unknown error from updateWalletById controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))
        }
    }

    async deleteWalletById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params
            const deleteWallet = await this.walletServices.deleteWalletById(id)
            console.log('deleteWalletById controller response: ', deleteWallet);
            deleteWallet?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, deleteWallet) : next(new AppError(deleteWallet))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from deleteWalletById controller: ', error.message) : console.log('Unknown error from deleteWalletById controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))
        }
    }

    async createWallet(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { data } = req.body
            const newWallet = await this.walletServices.createWallet(data)
            console.log('createWallet controller response: ', newWallet);
            newWallet?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, newWallet) : next(new AppError(newWallet))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from createWallet controller: ', error.message) : console.log('Unknown error from createWallet controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))
        }
    }
    

    // async getTotalBookings(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const bookingCount = await this.bookingServices.totalBookings()
    //         console.log('getTotalServices controller response: ', bookingCount);
    //         bookingCount?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, bookingCount) : next(new AppError(bookingCount))

    //     } catch (error: unknown) {
    //         error instanceof Error ? console.log('Error message from getTotalServices controller: ', error.message) : console.log('Unknown error from getTotalServices controller: ', error)
    //         next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))
    //     }

    // }

    // async createBooking(req: Request, res: Response, next: NextFunction) {

    //     try {

    //         console.log('new booking to create from frontend: ', req.body);

    //         const newBooking = await this.bookingServices.addBooking(req.body)
    //         console.log('createService controller response: ', newBooking);
    //         newBooking?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, newBooking) : next(new AppError(newBooking))

    //     } catch (error: unknown) {
    //         error instanceof Error ? console.log('Error message from createService controller: ', error.message) : console.log('Unknown error from createService controller: ', error)

    //         next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

    //     }

    // }

    // async getAllBookings(req: Request, res: Response, next: NextFunction) {

    //     try {
    //         let bookings = await this.bookingServices.getBookings(req.query)
    //         bookings?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, bookings) : next(new AppError(bookings))

    //     } catch (error: unknown) {
    //         error instanceof Error ? console.log('Error message from getAllBookings controller: ', error.message) : console.log('Unknown error from getAllBookings controller: ', error)
    //         next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

    //     }

    // }

    // async deleteBooking(req: Request, res: Response, next: NextFunction) {

    //     try {
    //         let deleteBooking = await this.bookingServices.deleteBooking(req.params.id)

    //         deleteBooking?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, deleteBooking) : next(new AppError(deleteBooking))

    //     } catch (error: unknown) {
    //         error instanceof Error ? console.log('Error message from deleteBooking controller: ', error.message) : console.log('Unknown error from deleteBooking controller: ', error)

    //         next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

    //     }

    // }

    // async deleteBookedServices(req: Request, res: Response, next: NextFunction) {

    //     try {

    //         const { bookingId, serviceName, serviceId } = req.params

    //         let deleteBookedServices = await this.bookingServices.deleteBookedServices(bookingId, serviceName, serviceId)

    //         deleteBookedServices?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, deleteBookedServices) : next(new AppError(deleteBookedServices))

    //     } catch (error: unknown) {
    //         error instanceof Error ? console.log('Error message from deleteBookedServices controller: ', error.message) : console.log('Unknown error from deleteBookedServices controller: ', error)

    //         next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

    //     }

    // }

    // async getBookingById(req: Request, res: Response, next: NextFunction) {

    //     try {
    //         let booking = await this.bookingServices.getBookingById(req.params.id)

    //         booking?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, booking) : next(new AppError(booking))

    //     } catch (error: unknown) {
    //         error instanceof Error ? console.log('Error message from getBookingById controller: ', error.message) : console.log('Unknown error from getBookingById controller: ', error)

    //         next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

    //     }

    // }

    // async getBookingByUserId(req: Request, res: Response, next: NextFunction) {

    //     try {
    //         let bookingsByUserId = await this.bookingServices.getBookingByUserId(req.params.id)

    //         bookingsByUserId?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, bookingsByUserId) : next(new AppError(bookingsByUserId))

    //     } catch (error: unknown) {
    //         error instanceof Error ? console.log('Error message from getBookingByUserId controller: ', error.message) : console.log('Unknown error from getBookingByUserId controller: ', error)

    //         next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

    //     }

    // }

    // async getBookingsByProvider(req: Request, res: Response, next: NextFunction) {

    //     try {
    //         let bookingsByProvider = await this.bookingServices.getBookingsByProvider(req.params.providerId)

    //         bookingsByProvider?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, bookingsByProvider) : next(new AppError(bookingsByProvider))

    //     } catch (error: unknown) {
    //         error instanceof Error ? console.log('Error message from getBookingsByProvider controller: ', error.message) : console.log('Unknown error from getBookingsByProvider controller: ', error)

    //         next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))
    //     }

    // }

    // async editBooking(req: Request, res: Response, next: NextFunction) {

    //     try {
    //         const { id } = req.params
    //         console.log('event details to update: ', id, req.body);

    //         const { name, img, services } = req.body

    //         // const file: Express.Multer.File | undefined = req.file
    //         // let imgNew = file ? file.filename : img

    //         const newData = {
    //             name,
    //             // img: imgNew,
    //             services: JSON.parse(services)
    //         }

    //         const newServiceResponse = await this.bookingServices.editBooking(id, newData)

    //         newServiceResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, newServiceResponse) : next(new AppError(newServiceResponse))

    //     } catch (error: unknown) {

    //         error instanceof Error ? console.log('Error message from editBooking controller: ', error.message) : console.log('Unknown error from editBooking controller: ', error)

    //         next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

    //     }

    // }

    // async editStatus(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const { id } = req.body

    //         const newStatusResponse = await this.bookingServices.editStatus(id)

    //         newStatusResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, newStatusResponse) : next(new AppError(newStatusResponse))

    //     } catch (error: unknown) {

    //         error instanceof Error ? console.log('Error message from editStatus controller: ', error.message) : console.log('Unknown error from editStatus controller: ', error)

    //         next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

    //     }
    // }

    // async getEventService(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const { name, providerId } = req.params
    //         console.log('event name to get service', req.params.name);
    //         const service = await this.bookingServices.getService(name, providerId)

    //         service?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, service) : next(new AppError(service))

    //     } catch (error: unknown) {

    //         error instanceof Error ? console.log('Error message from getEventService controller: ', error.message) : console.log('Unknown error from getEventService controller: ', error)

    //         next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

    //     }
    // }

    // async getAllEvents(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const events = await this.bookingServices.getAllEvents()

    //         events?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, events) : next(new AppError(events))

    //     } catch (error: unknown) {

    //         error instanceof Error ? console.log('Error message from getAllEvents controller: ', error.message) : console.log('Unknown error from getAllEvents controller: ', error)

    //         next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

    //     }
    // }

    // async getServiceByEvent(req: Request, res: Response, next: NextFunction) {
    //     try {

    //         const { name } = req.params

    //         const events = await this.bookingServices.getServiceByEvent(name)

    //         events?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, events) : next(new AppError(events))

    //     } catch (error: unknown) {

    //         error instanceof Error ? console.log('Error message from getServiceByEvent controller: ', error.message) : console.log('Unknown error from getServiceByEvent controller: ', error)

    //         next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

    //     }
    // }

    // async confirmBooking(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const { bookingId } = req.body

    //         console.log('booking id to confirm booking:', bookingId);

    //         const confirmationResponse = await this.bookingServices.confirmBooking(bookingId)

    //         confirmationResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, confirmationResponse) : next(new AppError(confirmationResponse))

    //     } catch (error) {
    //         error instanceof Error ? console.log('Error message from confirmBooking controller: ', error.message) : console.log('Unknown error from confirmBooking controller: ', error)
    //         next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

    //     }
    // }

    // async verifyPayment(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body

    //         console.log('razorpay_order_id:', razorpay_order_id, ' ,razorpay_payment_id: ', razorpay_payment_id, ' ,razorpay_signature: ', razorpay_signature, ' ,bookingId: ', bookingId);

    //         const veryfyPaymentResponse = await this.bookingServices.verifyPayment(req.body)

    //         veryfyPaymentResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, veryfyPaymentResponse) : next(new AppError(veryfyPaymentResponse))

    //     } catch (error) {
    //         error instanceof Error ? console.log('Error message from verifyPayment controller: ', error.message) : console.log('Unknown error from verifyPayment controller: ', error)
    //         next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

    //     }
    // }

    // async getSalesData(req: Request, res: Response, next: NextFunction) {

    //     try {

    //         const salesResponse = await this.bookingServices.getSalesData(req.query)

    //         salesResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, salesResponse) : next(new AppError(salesResponse))

    //     } catch (error) {
    //         error instanceof Error ? console.log('Error message from getSalesData controller: ', error.message) : console.log('Unknown error from getSalesData controller: ', error)
    //         next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

    //     }
    // }

    // async getProviderSales(req: Request, res: Response, next: NextFunction) {

    //     try {

    //         const salesResponse = await this.bookingServices.getProviderSales(req.query)

    //         salesResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, salesResponse) : next(new AppError(salesResponse))

    //     } catch (error) {
    //         error instanceof Error ? console.log('Error message from getProviderSales controller: ', error.message) : console.log('Unknown error from getProviderSales controller: ', error)
    //         next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

    //     }
    // }

    // async getAdminBookingData(req: Request, res: Response, next: NextFunction) {

    //     try {

    //         const adminBookingData = await this.bookingServices.getAdminBookingData()

    //         adminBookingData?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, adminBookingData) : next(new AppError(adminBookingData))

    //     } catch (error) {
    //         error instanceof Error ? console.log('Error message from getAdminBookingData controller: ', error.message) : console.log('Unknown error from getAdminBookingData controller: ', error)
    //         next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

    //     }
    // }

    // async getAdminChartData(req: Request, res: Response, next: NextFunction) {

    //     try {

    //         const { filter } = req.params
    //         console.log('get chart data filter value: ', filter);

    //         const chartData = await this.bookingServices.getAdminChartData(filter)

    //         chartData?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, chartData) : next(new AppError(chartData))

    //     } catch (error) {
    //         error instanceof Error ? console.log('Error message from getAdminChartData controller: ', error.message) : console.log('Unknown error from getAdminChartData controller: ', error)
    //         next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

    //     }
    // }

    // async getProviderChartData(req: Request, res: Response, next: NextFunction) {

    //     try {

    //         const { filter, name } = req.params
    //         console.log('get chart data filter value: ', filter);

    //         const chartData = await this.bookingServices.getProviderChartData(filter, name)

    //         chartData?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, chartData) : next(new AppError(chartData))

    //     } catch (error) {
    //         error instanceof Error ? console.log('Error message from getProviderChartData controller: ', error.message) : console.log('Unknown error from getProviderChartData controller: ', error)
    //         next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

    //     }
    // }

    // async getAdminPaymentList(req: Request, res: Response, next: NextFunction) {

    //     try {

    //         const paymentList = await this.bookingServices.getAdminPaymentList()

    //         paymentList?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, paymentList) : next(new AppError(paymentList))

    //     } catch (error) {
    //         error instanceof Error ? console.log('Error message from getAdminPaymentList controller: ', error.message) : console.log('Unknown error from getAdminPaymentList controller: ', error)
    //         next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))
    //     }
    // }

}
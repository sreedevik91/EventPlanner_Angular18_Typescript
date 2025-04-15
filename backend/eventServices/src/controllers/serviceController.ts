import { NextFunction, Request, Response } from "express"
// import serviceServices from "../services/serviceServices"
import { CONTROLLER_RESPONSES, HttpStatusCodes, IChoice, IServiceController, IServicesService } from "../interfaces/serviceInterfaces";
import { getImgUrl } from "../utils/cloudinary";
import { ResponseHandler } from "../utils/responseHandler";
import { AppError } from "../utils/appError";


export class ServiceController implements IServiceController {

    constructor(private serviceServices: IServicesService) { }

    async getAdminServices(req: Request, res: Response, next: NextFunction): Promise<void> {
          try {
            let adminServices = await this.serviceServices.getAdminServices()
           
            adminServices?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, adminServices) : next(new AppError(adminServices))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getAllServices controller: ', error.message) : console.log('Unknown error from getAllServices controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }
    }
    async addAdminService(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
        const data=req.body.services
        console.log('admin service data to add: ', data);
        
        const newAdminService = await this.serviceServices.addAdminService(data)
        console.log('addAdminService controller response: ', newAdminService);

        newAdminService?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, newAdminService) : next(new AppError(newAdminService))

    } catch (error: unknown) {
        error instanceof Error ? console.log('Error message from addAdminService controller: ', error.message) : console.log('Unknown error from addAdminService controller: ', error)
        next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

    }
    }
    async deleteAdminService(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let deleteAdminServices = await this.serviceServices.deleteAdminService(req.params.name)
           
            deleteAdminServices?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, deleteAdminServices) : next(new AppError(deleteAdminServices))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from deleteService controller: ', error.message) : console.log('Unknown error from deleteService controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }
    } 

    async getAvailableEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let availableEvents = await this.serviceServices.getAvailableEvents()
           
            availableEvents?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, availableEvents) : next(new AppError(availableEvents))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from deleteService controller: ', error.message) : console.log('Unknown error from deleteService controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }
    } 

    async getTotalServices(req: Request, res: Response, next: NextFunction) {
        try {
            const servicesCount = await this.serviceServices.totalServices()
            console.log('getTotalServices controller response: ', servicesCount);

            servicesCount?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, servicesCount) : next(new AppError(servicesCount))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getTotalServices controller: ', error.message) : console.log('Unknown error from getTotalServices controller: ', error)
           
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }

    }

    async createService(req: Request, res: Response, next: NextFunction) {

        try {
            console.log('new service to register from angular: ', req.body);

            console.log('new service images to register: ', req.files);
            const { name, events, provider, choices } = req.body
            const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

            let imgName: string = files?.img ? files?.img[0].filename : ''
            let imgPath = files?.img ? files?.img[0].path : ''

            let cloudinaryImgData = await getImgUrl(imgPath, { public_id: imgName, type: "authenticated", sign_url: true })
            let img = cloudinaryImgData.data?.imgUrl
            let choicesArray = JSON.parse(choices)
            let choicesWithImg = await Promise.all(choicesArray.map(async (choice: IChoice, index: number) => {
                const choiceImgFile = files?.choiceImg
                console.log('choiceImgFileName: ', files?.choiceImg[index]?.filename);
                const { choiceImgCategory, ...rest } = choice

                for (let img of choiceImgFile!) {
                    if (choiceImgCategory === img.originalname) {
                        let cloudinaryImgData = await getImgUrl(img.path, { public_id: img.filename, type: "authenticated", sign_url: true })
                        let imgUrl = cloudinaryImgData.data?.imgUrl
                        rest.choiceImg = imgUrl!
                    }
                }

                return rest
            }))

            const data = {
                name,
                img,
                events: JSON.parse(events),
                provider,
                choices: choicesWithImg
            }
            console.log('new service to register: ', data);

            const newService = await this.serviceServices.addService(data)
            console.log('createService controller response: ', newService);

            newService?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.CREATED, newService) : next(new AppError(newService))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from createService controller: ', error.message) : console.log('Unknown error from createService controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }

    }

    async getAllServices(req: Request, res: Response, next: NextFunction) {

        try {
            let services = await this.serviceServices.getServices(req.query)
           
            services?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, services) : next(new AppError(services))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getAllServices controller: ', error.message) : console.log('Unknown error from getAllServices controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }

    }

    async deleteService(req: Request, res: Response, next: NextFunction) {

        try {
            let deleteServices = await this.serviceServices.deleteService(req.params.id)
           
            deleteServices?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, deleteServices) : next(new AppError(deleteServices))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from deleteService controller: ', error.message) : console.log('Unknown error from deleteService controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }

    }

    async getServiceById(req: Request, res: Response, next: NextFunction) {

        try {
            let service = await this.serviceServices.getServiceById(req.params.id)
           
            service?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, service) : next(new AppError(service))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getServiceById controller: ', error.message) : console.log('Unknown error from getServiceById controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))


        }

    }

    async editService(req: Request, res: Response, next: NextFunction) {

        try {
            const { id } = req.params
            console.log('service details to update: ', id, req.body);

            const { name, img, events, provider, choices } = req.body

            const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
            console.log('service images to update: ', files);
            console.log('service choices to update: ', JSON.parse(choices));

            let choicesWithImg = JSON.parse(choices)
            let imgNew = img

            if (files && Object.keys(files).length > 0) {

                let imgName = files?.img ? files?.img[0].filename : ''
                let imgPath = files?.img ? files?.img[0].path : ''

                if (!imgPath) {
                    console.warn('No valid image file path provided for upload.');
                    imgNew = img;
                } else {
                    let cloudinaryImgData = await getImgUrl(imgPath, { public_id: imgName, type: "authenticated", sign_url: true })
                    imgNew = cloudinaryImgData.data?.imgUrl || img
                }

                let parsedArray = JSON.parse(choices)
                choicesWithImg = await Promise.all(parsedArray.map(async (choice: IChoice, index: number) => {
                    const choiceImgFile = files?.choiceImg
                    console.log('choiceImgFileName: ', files?.choiceImg[index]?.filename);
                    const { choiceImgCategory, ...rest } = choice

                    for (let img of choiceImgFile) {

                        if (!img?.path) {
                            console.warn(`No valid path for choice image at index ${index}.`);
                            continue;
                        }

                        let cloudinaryImgData = await getImgUrl(img.path, { public_id: img.filename, type: "authenticated", sign_url: true })
                        let imgUrl = cloudinaryImgData.data?.imgUrl
                        rest.choiceImg = imgUrl!
                    }

                    return rest
                })
                )
            }

            console.log('choicesWithImg: ', choicesWithImg);

            const newData = {
                name,
                img: imgNew,
                events: JSON.parse(events),
                provider,
                choices: choicesWithImg
            }

            console.log('final service data to edit: ', newData);

            const updatedServiceResponse = await this.serviceServices.editService(id, newData)
           
            updatedServiceResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, updatedServiceResponse) : next(new AppError(updatedServiceResponse))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from editService controller: ', error.message) : console.log('Unknown error from editService controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }

    }

    async editStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.body

            const newStatusResponse = await this.serviceServices.editStatus(id)
            
            newStatusResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, newStatusResponse) : next(new AppError(newStatusResponse))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from editStatus controller: ', error.message) : console.log('Unknown error from editStatus controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }
    }

    async approveService(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.body
            console.log('id to verify', req.body);
            const approveServiceResponse = await this.serviceServices.approveService(id)
           
            approveServiceResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, approveServiceResponse) : next(new AppError(approveServiceResponse))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from approveService controller: ', error.message) : console.log('Unknown error from approveService controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }
    }

    async getServiceByName(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.params
            console.log('name to get service', req.params.name);
            const serviceByName = await this.serviceServices.getServiceByName(name)
          
            serviceByName?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, serviceByName) : next(new AppError(serviceByName))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getServiceByName controller: ', error.message) : console.log('Unknown error from getServiceByName controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }
    }

}

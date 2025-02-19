import { Request, Response } from "express"
// import serviceServices from "../services/serviceServices"
import { HttpStatusCodes, IChoice, IServiceController, IServicesService } from "../interfaces/serviceInterfaces";
import { getImgUrl } from "../utils/cloudinary";
import { ResponseHandler } from "../utils/responseHandler";


export class ServiceController implements IServiceController {

    constructor(private serviceServices: IServicesService) { }

    async getTotalServices(req: Request, res: Response) {
        try {
            const servicesCount = await this.serviceServices.totalServices()
            console.log('getTotalServices controller response: ', servicesCount);

            // servicesCount?.success ? res.status(200).json(servicesCount) : res.status(400).json(servicesCount)
            servicesCount?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, servicesCount) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, servicesCount)
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getTotalServices controller: ', error.message) : console.log('Unknown error from getTotalServices controller: ', error)
            // res.status(500).json(error.message)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })
        }

    }

    async createService(req: Request, res: Response) {

        try {
            // const {name,provider,events,choices}= req.body
            console.log('new service to register from angular: ', req.body);

            console.log('new service images to register: ', req.files);
            const { name, events, provider, choices } = req.body
            // const files: { [fieldname: string]: Express.Multer.File[]; } | Express.Multer.File[] | undefined = req.files
            const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

            let imgName:string = files?.img ? files?.img[0].filename : ''
            let imgPath = files?.img ? files?.img[0].path : ''

            // let imgFiles = files?.img ?? []; // Ensure imgFiles is always an array
            // let imgName = imgFiles.length > 0 ? imgFiles[0].filename : '';
            // let imgPath = imgFiles.length > 0 ? imgFiles[0].path : '';

            // let cloudinaryImgData = await cloudinary.uploader.upload(imgPath, { public_id: imgName ,type:"authenticated",sign_url: true})

            let cloudinaryImgData = await getImgUrl(imgPath, { public_id: imgName ,type:"authenticated",sign_url: true})
            let img = cloudinaryImgData.data?.imgUrl
            let choicesArray = JSON.parse(choices)
            let choicesWithImg = await Promise.all(choicesArray.map(async (choice: IChoice, index: number) => {
                const choiceImgFile = files?.choiceImg
                console.log('choiceImgFileName: ', files?.choiceImg[index]?.filename);
                const { choiceImgCategory, ...rest } = choice

                for (let img of choiceImgFile!) {
                    if (choiceImgCategory === img.originalname) {
                        let cloudinaryImgData = await getImgUrl(img.path, { public_id: img.filename,type:"authenticated",sign_url: true })
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

            // response?.success ? res.status(201).json(response) : res.status(400).json(response)
            newService?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.CREATED, newService) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, newService)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from createService controller: ', error.message) : console.log('Unknown error from createService controller: ', error)
            // res.status(500).json(error.message)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })
        }

    }

    async getAllServices(req: Request, res: Response) {

        try {
            let services = await this.serviceServices.getServices(req.query)
            // services?.success ? res.status(200).json(services) : res.status(400).json(services)
            services?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, services) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, services)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getAllServices controller: ', error.message) : console.log('Unknown error from getAllServices controller: ', error)
            // res.status(500).json(error.message)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })
        }

    }

    async deleteService(req: Request, res: Response) {

        try {
            let deleteServices = await this.serviceServices.deleteService(req.params.id)
            // deleteServices?.success ? res.status(200).json(deleteServices) : res.status(400).json(deleteServices)
            deleteServices?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, deleteServices) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, deleteServices)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from deleteService controller: ', error.message) : console.log('Unknown error from deleteService controller: ', error)
            // res.status(500).json(error.message)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })
        }

    }

    async getServiceById(req: Request, res: Response) {

        try {
            let service = await this.serviceServices.getServiceById(req.params.id)
            // services?.success ? res.status(200).json(services) : res.status(400).json(services)
            service?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, service) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, service)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getServiceById controller: ', error.message) : console.log('Unknown error from getServiceById controller: ', error)
            // res.status(500).json(error.message)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })

        }

    }

    async editService(req: Request, res: Response) {

        try {
            const { id } = req.params
            // const { data } = req.body
            console.log('service details to update: ', id, req.body);

            const { name, img, events, provider, choices } = req.body

            // const files: any = req.files
            const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
            console.log('service images to update: ', files);
            console.log('service choices to update: ', JSON.parse(choices));

            let choicesWithImg = JSON.parse(choices)
            let imgNew = img

            if (files && Object.keys(files).length > 0) {

                let imgName = files?.img ? files?.img[0].filename : ''
                let imgPath = files?.img ? files?.img[0].path : ''

                // if (imgPath) {
                //     try {
                //         let cloudinaryImgData = await cloudinary.uploader.upload(imgPath, { public_id: imgName })
                //         imgNew = cloudinaryImgData.url || img
                //     } catch (error: unknown) {
                //         console.error('Error uploading service image to cloudinary:', error.message);
                //     }
                // }

                if (!imgPath) {
                    console.warn('No valid image file path provided for upload.');
                    imgNew = img;
                } else {
                    let cloudinaryImgData = await getImgUrl(imgPath, { public_id: imgName,type:"authenticated",sign_url: true })
                    imgNew = cloudinaryImgData.data?.imgUrl || img
                }


                // imgNew = files?.img ? files?.img[0].filename : img
                let parsedArray = JSON.parse(choices)
                choicesWithImg = await Promise.all(parsedArray.map(async (choice: IChoice, index: number) => {
                    const choiceImgFile = files?.choiceImg
                    console.log('choiceImgFileName: ', files?.choiceImg[index]?.filename);
                    const { choiceImgCategory, ...rest } = choice

                    // choiceImgFile.forEach((img: any) => {
                    //     if (choiceImgCategory === img.originalname) {
                    //         rest.choiceImg = img.filename
                    //     }
                    // })

                    for (let img of choiceImgFile) {

                        // if (img?.path) {
                        //     try {
                        //         let cloudinaryImgData = await cloudinary.uploader.upload(img.path, { public_id: img.filename })
                        //         let imgUrl = cloudinaryImgData.url
                        //         rest.choiceImg = imgUrl
                        //     } catch (error: unknown) {
                        //         console.error('Error uploading service image to cloudinary:', error.message);

                        //     }
                        // }

                        if (!img?.path) {
                            console.warn(`No valid path for choice image at index ${index}.`);
                            continue;
                        }

                        let cloudinaryImgData = await getImgUrl(img.path, { public_id: img.filename,type:"authenticated",sign_url: true })
                        let imgUrl = cloudinaryImgData.data?.imgUrl
                        rest.choiceImg = imgUrl!
                    }

                    return rest
                })
                )
            }
            // else {
            //     imgNew = img
            //     choicesWithImg = JSON.parse(choices)
            // }


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
            // newServiceResponse?.success ? res.status(200).json(newServiceResponse) : res.status(400).json(newServiceResponse)
            updatedServiceResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, updatedServiceResponse) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, updatedServiceResponse)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from editService controller: ', error.message) : console.log('Unknown error from editService controller: ', error)
            // res.status(500).json(error.message)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })
        }

    }

    async editStatus(req: Request, res: Response) {
        try {
            const { id } = req.body
            // console.log('id to edit user',id);

            const newStatusResponse = await this.serviceServices.editStatus(id)
            // newStatusResponse?.success ? res.status(200).json(newStatusResponse) : res.status(400).json(newStatusResponse)
            newStatusResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, newStatusResponse) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, newStatusResponse)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from editStatus controller: ', error.message) : console.log('Unknown error from editStatus controller: ', error)
            // res.status(500).json(error.message)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })
        }
    }

    async approveService(req: Request, res: Response) {
        try {
            const { id } = req.body
            console.log('id to verify', req.body);
            const approveServiceResponse = await this.serviceServices.approveService(id)
            // approveServiceResponse?.success ? res.status(200).json(approveServiceResponse) : res.status(400).json(approveServiceResponse)
            approveServiceResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, approveServiceResponse) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, approveServiceResponse)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from approveService controller: ', error.message) : console.log('Unknown error from approveService controller: ', error)
            // res.status(500).json(error.message)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })
        }
    }

    async getServiceByName(req: Request, res: Response) {
        try {
            const { name } = req.params
            console.log('name to get service', req.params.name);
            const serviceByName = await this.serviceServices.getServiceByName(name)
            // getServiceByName?.success ? res.status(200).json(getServiceByName) : res.status(400).json(getServiceByName)
            serviceByName?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, serviceByName) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, serviceByName)


        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getServiceByName controller: ', error.message) : console.log('Unknown error from getServiceByName controller: ', error)
            // res.status(500).json(error.message)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })
        }
    }

}

// export default new ServiceController()
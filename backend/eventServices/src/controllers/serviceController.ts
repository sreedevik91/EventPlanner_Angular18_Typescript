import { Request, Response } from "express"
import serviceServices from "../services/serviceServices"
import { IChoice } from "../interfaces/serviceInterfaces";
import fs from 'fs'
import cloudinary from "../utils/cloudinary";


class ServiceController {

    async getTotalServices(req: Request, res: Response) {
        try {
            const response = await serviceServices.totalServices()
            console.log('getTotalServices controller response: ', response);

            response?.success ? res.status(200).json(response) : res.status(400).json(response)

        } catch (error: any) {
            console.log('Error from getTotalServices controller: ', error.message);
            res.status(500).json(error.message)
        }

    }

    async createService(req: Request, res: Response) {

        try {
            // const {name,provider,events,choices}= req.body
            console.log('new service to register from angular: ', req.body);

            console.log('new service images to register: ', req.files);
            const { name, events, provider, choices } = req.body
            const files: any = req.files

            let imgName = files?.img ? files?.img[0].filename : ''
            let imgPath = files?.img ? files?.img[0].path : ''
            let cloudinaryImgData = await cloudinary.uploader.upload(imgPath, { public_id: imgName })
            let img = cloudinaryImgData.url
            let choicesArray = JSON.parse(choices)
            let choicesWithImg = await Promise.all(choicesArray.map(async (choice: any, index: number) => {
                const choiceImgFile = files?.choiceImg
                console.log('choiceImgFileName: ', files?.choiceImg[index]?.filename);
                const { choiceImgCategory, ...rest } = choice

                for (let img of choiceImgFile) {
                    if (choiceImgCategory === img.originalname) {
                    let cloudinaryImgData = await cloudinary.uploader.upload(img.path, { public_id: img.filename })
                    let imgUrl = cloudinaryImgData.url
                    rest.choiceImg = imgUrl
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

            const response = await serviceServices.addService(data)
            console.log('createService controller response: ', response);

            response?.success ? res.status(200).json(response) : res.status(400).json(response)

        } catch (error: any) {
            console.log('Error from createService controller: ', error.message);
            res.status(500).json(error.message)
        }

    }


    async getAllServices(req: Request, res: Response) {

        try {
            let services = await serviceServices.getServices(req.query)
            services?.success ? res.status(200).json(services) : res.status(400).json(services)

        } catch (error: any) {
            console.log('Error from getAllServices : ', error.message);
            res.status(500).json(error.message)

        }

    }


    async deleteService(req: Request, res: Response) {

        try {
            let deleteServices = await serviceServices.deleteService(req.params.id)
            deleteServices?.success ? res.status(200).json(deleteServices) : res.status(400).json(deleteServices)

        } catch (error: any) {
            console.log('Error from deleteService : ', error.message);
            res.status(500).json(error.message)

        }

    }

    async getServiceById(req: Request, res: Response) {

        try {
            let services = await serviceServices.getServiceById(req.params.id)
            services?.success ? res.status(200).json(services) : res.status(400).json(services)

        } catch (error: any) {
            console.log('Error from getServiceById : ', error.message);
            res.status(500).json(error.message)

        }

    }

    async editService(req: Request, res: Response) {

        try {
            const { id } = req.params
            // const { data } = req.body
            console.log('service details to update: ', id, req.body);

            const { name, img, events, provider, choices } = req.body

            const files: any = req.files
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
                //     } catch (error: any) {
                //         console.error('Error uploading service image to cloudinary:', error.message);
                //     }
                // }

                if (!imgPath) {
                    console.warn('No valid image file path provided for upload.');
                    imgNew = img;
                }else{
                    let cloudinaryImgData = await cloudinary.uploader.upload(imgPath, { public_id: imgName })
                    imgNew = cloudinaryImgData.url || img
                }


                // imgNew = files?.img ? files?.img[0].filename : img
                let parsedArray = JSON.parse(choices)
                choicesWithImg = await Promise.all(parsedArray.map(async (choice: any, index: number) => {
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
                        //     } catch (error: any) {
                        //         console.error('Error uploading service image to cloudinary:', error.message);

                        //     }
                        // }

                        if (!img?.path) {
                            console.warn(`No valid path for choice image at index ${index}.`);
                            continue;
                        }

                        let cloudinaryImgData = await cloudinary.uploader.upload(img.path, { public_id: img.filename })
                        let imgUrl = cloudinaryImgData.url
                        rest.choiceImg = imgUrl
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

            const newServiceResponse = await serviceServices.editService(id, newData)
            newServiceResponse?.success ? res.status(200).json(newServiceResponse) : res.status(400).json(newServiceResponse)

        } catch (error: any) {
            console.log('Error from edit service : ', error, error.message);
            res.status(500).json(error.message)

        }

    }

    async editStatus(req: Request, res: Response) {
        try {
            const { id } = req.body
            // console.log('id to edit user',id);

            const newStatusResponse = await serviceServices.editStatus(id)
            newStatusResponse?.success ? res.status(200).json(newStatusResponse) : res.status(400).json(newStatusResponse)

        } catch (error: any) {
            console.log('Error from edit status : ', error.message);
            res.status(500).json(error.message)

        }
    }

    async approveService(req: Request, res: Response) {
        try {
            const { id } = req.body
            console.log('id to verify', req.body);
            const approveServiceResponse = await serviceServices.approveService(id)
            approveServiceResponse?.success ? res.status(200).json(approveServiceResponse) : res.status(400).json(approveServiceResponse)

        } catch (error: any) {
            console.log('Error from approveServiceResponse : ', error.message);
            res.status(500).json(error.message)

        }
    }

    async getServiceByName(req: Request, res: Response) {
        try {
            const { name } = req.params
            console.log('name to get service', req.params.name);
            const getServiceByName = await serviceServices.getServiceByName(name)

            getServiceByName?.success ? res.status(200).json(getServiceByName) : res.status(400).json(getServiceByName)

        } catch (error: any) {
            console.log('Error from getServiceByName : ', error.message);
            res.status(500).json(error.message)

        }
    }

}

export default new ServiceController()
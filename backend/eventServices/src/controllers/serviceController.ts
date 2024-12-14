import { Request, Response } from "express"
import serviceServices from "../services/serviceServices"


class ServiceController{

    async getTotalServices(req:Request,res:Response){
        try {
            const response=await serviceServices.totalServices()
            console.log('getTotalServices controller response: ',response);

            response?.success ? res.status(200).json(response) : res.status(400).json(response)

        } catch (error: any) {
            console.log('Error from getTotalServices controller: ', error.message);
            res.status(500).json(error.message)
        }
     
    }

    async createService(req:Request,res:Response){

        try {
            const data= req.body

            // const {name,provider,events,choices}= req.body

            console.log('new service to register: ',data);
            
            
            const response=await serviceServices.addService(data)
            console.log('createService controller response: ',response);
            
            response?.success ? res.status(200).json(response) : res.status(400).json(response)

        } catch (error: any) {
            console.log('Error from createService controller: ', error.message);
            res.status(500).json(error.message)
        }
    
    }

    
    async getAllServices(req:Request,res:Response){

        try {
            let services = await serviceServices.getServices(req.query)
            services?.success ? res.status(200).json(services) : res.status(400).json(services)

        } catch (error: any) {
            console.log('Error from getAllServices : ', error.message);
            res.status(500).json(error.message)

        }
    
    }

    
    async deleteService(req:Request,res:Response){

        try {
            let deleteServices = await serviceServices.deleteService(req.params.id)
            deleteServices?.success ? res.status(200).json(deleteServices) : res.status(400).json(deleteServices)

        } catch (error: any) {
            console.log('Error from deleteService : ', error.message);
            res.status(500).json(error.message)

        }
    
    } 

    async getServiceById(req:Request,res:Response){

        try {
            let services = await serviceServices.getServiceById(req.params.id)
            services?.success ? res.status(200).json(services) : res.status(400).json(services)

        } catch (error: any) {
            console.log('Error from getServiceById : ', error.message);
            res.status(500).json(error.message)

        }
    
    } 

    async editService(req:Request,res:Response){

        try {
            const { id } = req.params
            const { data } = req.body
            console.log('service details to update: ', id, data);

            const newServiceResponse = await serviceServices.editService(id, data)
            newServiceResponse?.success ? res.status(200).json(newServiceResponse) : res.status(400).json(newServiceResponse)

        } catch (error: any) {
            console.log('Error from edit service : ', error.message);
            res.status(500).json(error.message)

        }
    
    } 

    async editStatus(req: Request, res: Response) {
        try {
            const { id } = req.params
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
            const { id } = req.params
            console.log('id to verify', req.params.id);
            const approveServiceResponse = await serviceServices.approveService(id)
            approveServiceResponse?.success ? res.status(200).json(approveServiceResponse) : res.status(400).json(approveServiceResponse)

        } catch (error: any) {
            console.log('Error from approveServiceResponse : ', error.message);
            res.status(500).json(error.message)

        }
    }

}

export default new ServiceController()
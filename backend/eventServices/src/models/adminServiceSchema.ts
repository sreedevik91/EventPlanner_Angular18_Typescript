import mongoose, { model, Schema } from "mongoose";
import { IAdminService } from "../interfaces/serviceInterfaces";


const AdminServiceSchema: Schema<IAdminService> = new Schema<IAdminService>({
    name: {
        type: String,
        default: 'Admin Services'
    },
    services: [{
        type: String,
        required: true
    }],

},
    {
        timestamps: true
    }
);


const AdminService = model<IAdminService>('adminService', AdminServiceSchema)
export default AdminService


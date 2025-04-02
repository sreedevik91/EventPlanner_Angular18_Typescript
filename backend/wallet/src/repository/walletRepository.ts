import { DeleteResult, FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { IWallet, IWalletRepository } from "../interfaces/walletInterfaces";
import Wallet from "../models/walletSchema";
import { BaseRepository } from "./baseRepository";
import { format } from "path";

export class WalletRepository extends BaseRepository<IWallet> implements IWalletRepository {

    constructor() {
        super(Wallet)
    }
   
    async getWalletByUserId(userId: string): Promise<IWallet | null> {
        try {
            return await this.model.findOne({ userId })
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from WalletRepository: ', error.message) : console.log('Unknown error from WalletRepository: ', error)
            return null
        }
    }

    async updateWalletByUserId(userId: string, data: UpdateQuery<IWallet>): Promise<IWallet | null> {

        try {
            console.log('update query from updateWalletByUserId repository:', data);

            const updateQuery: UpdateQuery<IWallet> = {}
            if (data.$set) {
                updateQuery.$set = data.$set
            } 
            if (data.$push) {
                updateQuery.$push = data.$push
            }
            console.log('new update query from updateWalletByUserId repository:', updateQuery);
            
            return await this.model.findOneAndUpdate({ userId }, updateQuery, { new: true })
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from wallet Repository: ', error.message) : console.log('Unknown error from wallet Repository: ', error)
            return null
        }
    }

}

import { Model, FilterQuery, UpdateQuery, Document, DeleteResult, QueryOptions } from "mongoose";
import { IRepository } from "../interfaces/walletInterfaces";


export abstract class BaseRepository<T extends Document> implements IRepository<T> {

    protected model: Model<T> // 'protected' will make this property available for the child classes, if private is used it would be available only for this class

    constructor(model: Model<T>) {
        this.model = model
    }
    async createWallet(WalletData: Partial<T>): Promise<T | null> {
         try {
            const wallet = new this.model(WalletData)
            return await wallet.save()
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from Wallet BaseRepository: ', error.message) : console.log('Unknown error from Wallet BaseRepository: ', error)
            return null
        }
    }
    async getWalletById(walletId: string): Promise<T | null> {
         try {
            return await this.model.findById(walletId)
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from wallet BaseRepository: ', error.message) : console.log('Unknown error from wallet BaseRepository: ', error)
            return null
        }
    }
    async updateWallet(walletId: string, data: UpdateQuery<T>): Promise<T | null> {
    
         try {
            const updateQuery:UpdateQuery<T>={}
            if(data.$set){
                updateQuery.$set=data.$set
            }else if(data.$push){
                updateQuery.$push=data.$push
            }
            return await this.model.findOneAndUpdate({_id:walletId}, updateQuery, {new:true})
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from wallet BaseRepository: ', error.message) : console.log('Unknown error from wallet BaseRepository: ', error)
            return null
        }
    }
    async deleteWallet(walletId: string): Promise<DeleteResult | null> {
         try {
            return await this.model.findByIdAndDelete(walletId)
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from wallet BaseRepository: ', error.message) : console.log('Unknown error from wallet BaseRepository: ', error)
            return null
        }
    }

    // async createwallet(walletData: Partial<T>): Promise<T | null> {
    //     try {
    //         const wallet = new this.model(walletData)
    //         return await wallet.save()
    //     } catch (error: unknown) {
    //         error instanceof Error ? console.log('Error message from wallet BaseRepository: ', error.message) : console.log('Unknown error from wallet BaseRepository: ', error)
    //         return null
    //     }

    // }

    // async getwalletById(walletId: string): Promise<T | null> {
    //     try {
    //         return await this.model.findById(walletId)
    //     } catch (error: unknown) {
    //         error instanceof Error ? console.log('Error message from wallet BaseRepository: ', error.message) : console.log('Unknown error from wallet BaseRepository: ', error)
    //         return null
    //     }
    // }

    // async getAllwallet(query: FilterQuery<T> = {}, options: QueryOptions = {}): Promise<T[] | null> {
    //     try {
    //         const { sort, limit, skip } = options
    //         return await this.model.find(query).sort(sort).limit(limit!).skip(skip!)
    //     } catch (error: unknown) {
    //         error instanceof Error ? console.log('Error message from wallet BaseRepository: ', error.message) : console.log('Unknown error from wallet BaseRepository: ', error)
    //         return null
    //     }
    // }

    // async updatewallet(walletId: string, data: UpdateQuery<T>): Promise<T | null> {
    //     try {
    //         const updateQuery: UpdateQuery<T> = {}
    //         if (data.$push) {
    //             updateQuery.$push = data.$push
    //         }
    //         if (data.$pull) {
    //             updateQuery.$pull = data.$pull
    //         }
    //         if (data.$set) {
    //             updateQuery.$set = data.$set
    //         }
    //         return await this.model.findOneAndUpdate({ _id: walletId }, updateQuery, { new: true })
    //     } catch (error: unknown) {
    //         error instanceof Error ? console.log('Error message from wallet BaseRepository: ', error.message) : console.log('Unknown error from wallet BaseRepository: ', error)
    //         return null
    //     }
    // }

    // async deletewallet(walletId: string): Promise<DeleteResult | null> {
    //     try {
    //         return await this.model.findByIdAndDelete(walletId)
    //     } catch (error: unknown) {
    //         error instanceof Error ? console.log('Error message from wallet BaseRepository: ', error.message) : console.log('Unknown error from wallet BaseRepository: ', error)
    //         return null
    //     }
    // }


}
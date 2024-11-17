const userModel = require('../models/userModel')

class UserRepository {

    async createUser(userData) {
        const user = new userModel(userData)
        return await user.save()
    }

    async getAllUsers() {
        const users = await userModel.find()
        return users
    }

    async getUser(value) {
        const user = await userModel.findOne(value)
        return user
    }

    async updateUser(filter, value) {
        // filter is query object ({_id:id}) value is an object of key and value to be updated ({email:"someValue"})
        // {returnOriginal:false} When false, returns the updated document rather than the original. The default is true.

        const user = await userModel.findOneAndUpdate(filter, value)
        return user
    }

    async updatePassword(id, value) {

        let user = await this.getUser({ _id: id })
        console.log('updatePassword: ', user);

        if (user) {
            user.password = value
            await user.save()
        }

        return user
    }

}

module.exports = new UserRepository()
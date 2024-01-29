import User from '../models/user.models.js';


const create = async (data,next) => {
    try {
        return await User.create(data);
    } catch (error) {
        next(error)
    }
}


export const userMethods = {
    create
}
import User from '../models/user.models.js';


const create = async (data) => {
    try {
        return await User.create(data);
    } catch (error) {
        return error
    }
}


export const userMethods = {
    create
}
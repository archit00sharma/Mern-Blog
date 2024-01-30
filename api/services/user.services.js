import User from '../models/user.models.js';


const create = async (data, next) => {
    try {
        return await User.create(data);
    } catch (error) {
        next(error)
    }
};
const read = async (cond, next) => {
    try {
        return await User.findOne(cond);
    } catch (error) {
        next(error)
    }
}


export const userMethods = {
    create,
    read
}
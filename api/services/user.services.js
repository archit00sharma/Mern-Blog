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
};
const update = async (id, data, next) => {
    try {
        return await User.findOneAndUpdate({ _id: id }, { $set: data }, { new: true });
    } catch (error) {
        next(error)
    }
};
const remove = async (cond, next) => {
    try {
        return await User.findOneAndDelete(cond, { new: true });
    } catch (error) {
        next(error)
    }
};


export const userMethods = {
    create,
    read,
    update,
    remove
}
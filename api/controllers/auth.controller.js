import { userMethods } from '../services/user.services.js'
import bcrypt from "bcrypt";
import { responseHandler } from '../utils/response.js';



export const signup = async (req, res, next) => {
    try {
        const { password } = req.body;

        const hash = bcrypt.hashSync(password, 10);
        req.body.password = hash;

        const user = await userMethods.create(req.body, next);
        delete user.password;

        responseHandler(res, 201, 'user created successfully', user)
    } catch (error) {
        next(error)
    };
};
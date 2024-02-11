import { userMethods } from '../services/user.services.js'
import bcrypt from "bcrypt";
import { errorHandler, responseHandler } from '../utils/response.js';



export const updateUser = async (req, res, next) => {
    try {
        const { password } = req.body;
        const { id } = req.params;

        if (id !== req.user._id) return next(errorHandler('401', 'User Not Found'));

        if (password) {
            const hash = bcrypt.hashSync(password, 10);
            req.body.password = hash;
        };

        const user = await userMethods.update(id, req.body, next);
        delete user.password;

        responseHandler(res, 201, 'user updated successfully', user)
    } catch (error) {
        next(error)
    };
};

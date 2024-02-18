import express from 'express';
import { validateToken } from '../helpers/jwt.js'
import { updateUser,deleteUser } from '../controllers/user.controller.js';

const router = express.Router();


router.put('/update/:id', validateToken, updateUser)
router.delete('/delete/:id', validateToken, deleteUser)



export default router
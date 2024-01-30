import express from 'express';
import { ajvValidations } from '../helpers/ajv.js'
import { signup, signin } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', ajvValidations.signup, signup);
router.post('/signin', ajvValidations.signin, signin);

export default router
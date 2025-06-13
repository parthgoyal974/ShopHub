import express from 'express'
import { userRegister, userLogin, home} from "../controllers/authControllers.js"
import { verifyTokenMiddleware } from '../services/authServices.js'
const router=express.Router()

router.post('/register',userRegister)

router.post('/login',userLogin)

router.get('/home',verifyTokenMiddleware, home)

export default router;
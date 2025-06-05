import express from 'express'
import { userRegister, userLogin, verifyToken, home} from "../controllers/controllers.js"

const router=express.Router()

router.post('/register',userRegister)

router.post('/login',userLogin)

router.get('/home',verifyToken, home)

export default router;
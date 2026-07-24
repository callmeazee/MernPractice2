import { Request, Response } from "express";
import AuthModel from "../model/auth.model";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";

interface PayloadInterface {
     id: mongoose.Types.ObjectId,
     fullname: string,
     email: string, 
     mobile: string 

}
const accessTokenExpiry = '10m'

const generateToken = (payload: PayloadInterface) => {
     const accessToken = jwt.sign(payload, process.env.AUTH_SECRET!, { expiresIn: accessTokenExpiry })
     
     return accessToken

}

export const signup = async(req: Request, res: Response) => {
     try {
          await AuthModel.create(req.body)
          res.json({message: "Signup success"})
         
     } catch (err : any) {
          res.status(500).json({message: err.message})
    }

}

export const login = async(req: Request, res: Response) => {
     try {
          const { email, password } = req.body
          const user = await AuthModel.findOne({ email })
          if (!user)
               throw new Error("Please signup first")
          const isLogin = await bcrypt.compare(password, user.password)
          if (!isLogin)
               throw new Error("Invalid credential")

          const payload = {
               id: user._id,
               fullname: user.fullname,
               email: user.email,
               mobile: user.mobile
          }

          const options = {
               httpOnly: true,
               maxAge: 10 * 60 * 1000,
               secure: false,
               domain: "localhost",
          }

          const accessToken = generateToken(payload)
          res.cookie("accessToken",accessToken, options)
          res.json({message: 'login success'})

          
     } catch (err : any ) {
          res.status(500).json({message: err.message})
     }
}

export const getSession = (req: Request, res: Response) => {
     try {
          const accessToken = req.cookies.accessToken 
          
          if (!accessToken)
               throw new Error("invalid request")

          const session = jwt.verify(accessToken, process.env.AUTH_SECRET!)
          res.json(session)
        
     } catch (err: any) {
          res.status(500).json({message: err.message})
   }
}

export const forgotPassword = async(res: Response) => {
     try {
          await AuthModel.create()
          
     } catch (err : any) {
          res.status(500).json({message: err.message})
     }
}


//export contant autpassword //
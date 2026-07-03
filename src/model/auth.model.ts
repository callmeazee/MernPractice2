import  { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'


interface AuthInterface {
     fullname: string 
     mobile: string 
     email: string 
     password: string | null
}

const authSchema = new Schema ({
     fullname: {
          type: String, 
          trim: true,
          lowercase: true,
          required: [true, 'Please enter your fullname']
     },
     mobile: {
          type: String, 
          unique: [true, "mobile number already exist"],
          required: [true, "please enter your mobile number"]
          
     },
     email: {
          type: String, 
          unique: [true, 'email already exist'],
          required: [true, "please enter your email"],
          trim: true, 
          lowercase: true
          
     },
     password: {
          type: String,
          required: [true, 'please enter your password'],
          trim: true
          
     }

}, { timestamps: true })


authSchema.pre('save', async function () {
     if(!this.isModified('password')) return 
  this.password = await bcrypt.hash(this.password, 12)
})




const AuthModel = model('Auth', authSchema)

export default AuthModel
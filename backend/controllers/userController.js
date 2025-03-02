import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
//API to register user

const registerUser = async (req, res) => {

    try {
        const {name, email, password } = req.body

        if(!name || !password || !email) {
            return res.json({success: false, message: "Missing Credentials"})
        }

        //validating correct email
        if (!validator.isEmail(email)) {
            return res.json({success: false, message: "Enter a Valid Email"})
        }
        //validating strong password
        if(password.length < 8) {
            return res.json({successs: false, message:"Enter a Strong Password"})
        }

        //Now we have the name,email and password , we have vaildated the email and password //Next we can add the user in database so firts we have to decrypt the password

        //Let's have password and decrypt hashing user password 

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //next we have to save the hashed password in database

        const userData =  {
            name,
            email,
            password: hashedPassword
        }

        const newUser =  userModel(userData)
        const user = await newUser.save() //by using this method the user will be saved in the database
        
        //in the user object we will get one _id property using this property we are going to create one token so that user can login on the website

        //to create token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET) // we have to provide JWT Secret to encrypt this token
        res.json({success:true, token}) // now we generate the the response so that we can send this token to the user
    }
    catch(error){
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

export {registerUser}
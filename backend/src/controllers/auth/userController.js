import asyncHandler from "express-async-handler";
import  User from "../../models/auth/user.model.js"
import generateToken from "../../helpers/generateToken.js";
import bcrypt from "bcrypt";


//register new user
export const registerUser = asyncHandler (async(req , res) => {
   const {name, email, password} = req.body;

   // validation
   if(!name || !email || !password){
    return res.status(400).json({message: "All fields are required !"})
   }

   // check password
   if(password.length<6){
    return res.status(400).json({message: "Password shold alteast 6 characters !"})
   }

   // check if User exist
   const userExists = await User.findOne({email});

   if(userExists){
    // bad request
    return res.status(400).json({message : "User is already exist"})
   }

   // create new user

   const user = await User.create({
    name,
    email,
    password
   });

   // generate token with user id
    const token = generateToken(user._id);
    
   // return user data with token
   res.cookie("token", token, {
    path : "/",
    httpOnly : true,
    maxAge : 30 * 24 * 60 * 60 * 1000,
    sameSite : "none",
    secure : true
   });


   // send back the user token in the response to the client 
   if(user){
     const {_id, name, email, role, photo, bio, isVerified} = user;

    // 201 created
    res.status(201).json({
        _id,
        name,
        email,
        role,
        photo,
        bio,
        isVerified ,
       token
    });
   }else{
    return res.status(400).json({message : "Invalid user data"});
   }
})

// user login 

export const loginUser = asyncHandler (async (req, res) => {
    const { email, password }= req.body ;

    if(!email || !password){
    res.status(400).json({message : "All fields are required !"})
    }

    const userExists = await User.findOne({email});
    
    if(!userExists){
        res.status(400).json({message: " User not found, sign up!"})
    }

    const isMatch = await bcrypt.compare(password, userExists.password );

    if(!isMatch){
        res.status(400).json({message: "Invalid credentials"})
    }

    // generate token with user id
    const token = generateToken(userExists._id);

    if(userExists && isMatch){
    const {_id, name, email, role, bio, isVerified}= userExists;
    
    // set the token in the cookie
   res.cookie("token", token,{
    path: "/",
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: true,
    secure: true
   })

   // send back to the user
   res.status(200).json({
    _id,
    name,
    email,
    role,
    bio,
    isVerified,
    token
   });
    }else{
        res.status(400).json({message: "Invalid email or password"})
    }
} )
    



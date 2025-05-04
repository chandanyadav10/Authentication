import asyncHandler from "express-async-handler";
import User from "../../models/auth/user.model.js";


export const deleteUser = asyncHandler(async (req, res, next) => {
    const {id} =req.params;

    // attempt to find and delete user

    try {
        const user = await User.findByIdAndDelete(id);
        if(user){
            res.status(200).json({
                messege : "user deleted"
            })
        }else{
            res.status(404).json({
                messege : "user not found"
            })
        }
        
    } catch (error) {
        res.status(500).json({
            messege : "cannot delete user"
        })
    }
})
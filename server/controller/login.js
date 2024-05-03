const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require('../models/User');


module.exports = async(req,res)=>{
    const {email, password} = req.body;
    const dbUser = await User.findOne({email}).exec()
    if(dbUser){
        const match = await bcrypt.compare(password, dbUser.password)
        if(match){
            const token = jwt.sign({
                _id: dbUser._id,
                name: dbUser.name,
                email
            },
            process.env.JWT_LOGIN_TOKEN,
            { expiresIn: "1d" }
            );
            res.json({
                message : "login Sucessful",
                token
            })
        }else{
            res.status(400).json({
                message : "username and password is inncorect"
            });
        }
    }else{
        res.status(400).json({
            message : "no user found"
        });
    }
}
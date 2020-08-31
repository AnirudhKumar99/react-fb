const jwt = require('jsonwebtoken');
require('dotenv').config()
const expressJwt=require('express-jwt');
const User = require('../models/user')

exports.signup = async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email })
    if (userExists) return res.status(403).json({
        error: "Email is taken"
    })
    const user = await new User(req.body)
    await user.save()
    res.status(200).json({
        message: "Signup success please login!"
    })
};

exports.signin = (req, res) => {
    // Find the user based on email
    const { email, password } = req.body
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({
                error: 'User with that email does not exist. Please signin'
            })
        }
        // if user is found make sure the email and password match
        // create authenticate method in model to use here
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password do not match'
            })
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.cookie('t', token, { expire: new Date() + 9999 })

        const { _id, name, email } = user
        return res.json({ token, user: { _id, email, name } })
    })
    // if error or not user

    // if user,authenticate

    // generate a token with user id and secret

    // persist the toen as 't' in cookie with expiry date

    // return respnse with user and token to frontend client
}


exports.signout=(req,res)=>{
    res.clearCookie("t")
    return res.json({message:"Signout successful"})
}


exports.requireSignin=expressJwt({
    // if the token is valid, exprewss jwt appends the verified users id
    // in an auth key to the request object
    secret:process.env.JWT_SECRET,
    userProperty:"auth"
})
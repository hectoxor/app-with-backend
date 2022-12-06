const {Router} = require ('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()


// /api/auth/register
router.post(
    '/register',
    [
        check('email' , 'Email is wrong').isEmail(),
        check('password', 'Min length is 6 chars')
            .isLength({min:6})
    ],
    async(req,res) =>{

    try{
       // console.log('body:',req.body)
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array(),
                message: 'Invalid data'
            })
        }

        const {email, password} = req.body

        const candidate = await User.findOne({ email })

        if(candidate){
            return res.status(400).json({message: 'The user is already registered'})
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({email,password: hashedPassword})

        await user.save()

        res.status(201).json({message: "The account has been created"})



    }
    catch(e){
      res.status(500).json({message : "smth went wrong"});
    }
})


// /api/auth/login
router.post(
    '/login',
    [
      check('email', 'type correct email').normalizeEmail().isEmail(),
      check('password', 'Type a password').exists()
    ],
    async(req,res) =>{
        try{
            const errors = validationResult(req)

            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors:errors.array(),
                    message: 'Invalid data to system'
                })
            }

            const {email, password} = req.body

            const user = await User.findOne({ email })

            if(!user){
                return res.status(400).json({message: "can't find the user"})
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if(!isMatch){
                return res.status(400).json({message: 'incorrect password,try again'})
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )

            res.json({ token, userId: user.id })


        }
        catch(e){
            res.status(500).json({message : "smth went wrong"});
        }
})

module.exports = router
const router = require('express').Router();
const User = require("../model/User");
const { verifyToken, verifyandAuthentication, verifyAndAdmin } = require('./verifyToken');
const bcrypt = require('bcryptjs')


router.put('/:id', verifyandAuthentication, async(req,res) => {
    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashPass;
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        res.status(201).json(updatedUser)
    } catch(err){
        res.status(500).json(err)
    }
});

router.delete('/:id', verifyandAuthentication, async(req,res) => {
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(201).json("user Deleted!")
    }catch(err){
        res.status(500).json(err)
    }
})

router.get('/find/:id', verifyandAuthentication, async(req,res) => {
    try{
        const user = await User.findById(req.params.id)
        const {password, ...other} = user._doc;
        res.status(201).json(other)
    } catch(err){
        res.status(500).json(err)
    }
})

router.get('/',verifyAndAdmin, async(req,res)=> {
    const query = req.query.new;
    try{
        const users = query? await User.find().sort({_id: -1}).limit(5) : await User.find()
        res.status(201).json(users)
    }catch(err){
        res.status(500).json(err)
    }
});

router.get('/stats', verifyAndAdmin, async(req,res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try{
        const data = await User.aggregate([
            {$match: {createdAt: {$gte: lastYear}}},
            {$project:{
                month: {$month: "$createdAt"},
            }},
            {
                $group: {
                    _id: "$month",
                    total: {$sum: 1},
                },
            },
        ])
        res.status(201).json(data)
    }catch(err){
        res.status(500)
    }
})




module.exports = router
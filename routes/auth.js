const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.password, salt);
  req.body.password = hash;
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (user) {
      const validity = await bcrypt.compare(password, user.password);
      if (!validity) {
        res.status(401).json("Wrong Password!");
      } else {
        const { password, ...other } = user._doc;
        const token = jwt.sign({
          id: user._id,
          isAdmin: user.isAdmin,
        },process.env.JWTKEY,
        {expiresIn: "5d"}
        );
        res.status(201).json({...other,token});
      }
    } else {
      res.status(404).json("User not found!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

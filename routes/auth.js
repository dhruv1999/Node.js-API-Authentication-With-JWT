const router = require("express").Router();
const User = require("../model/User");
const joi = require("@hapi/joi");
const { registervalidation, loginvalidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { error } = registervalidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //check user in database

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send("Email already exists");
  }

  //hash passwords
  const salt = await bcrypt.genSalt(10);

  const hashedpassword = await bcrypt.hash(req.body.password, salt);

  //Creatae new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedpassword
  });

  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

//login
router.post("/login", async (req, res) => {
  const { error } = loginvalidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //checking if email exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Email already exists");
  }

  //password coorect

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(400).send("Invalid password");
  }

  //create token

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
  res.send("Success");
});

module.exports = router;

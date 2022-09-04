const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");
require("dotenv").config();

// Create a User using: POST "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const HashPass = await bcrypt.hash(req.body.password, salt);
      // Create a new user
      user = await User.create({
        name: req.body.name,
        password: HashPass,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const jwt_token = process.env.JWT_SECRET 

      const AuthToken = jwt.sign(data, 'hhhhhh');
      res.json({ AuthToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error occured");
    }
  }

  //   async(req, res) =>{
  //     const {name, email, password} = req.body

  //     try {
  //         const user = await User.create({name, email, password})
  //         res.status(200).json(user)
  //     } catch (error) {
  //         res.status(400).json({err : error.message})
  //     }
  // }
);

// login user

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "enter valid password").exists().isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "wrong credentials" });
      }

      const ComparePassword = await bcrypt.compare(password, user.password);

      if (!ComparePassword) {
        return res.status(400).json({ error: "wrong credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const AuthToken = await jwt.sign(data, "hhhhhh");

      res.json({ AuthToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error occured");
    }
  }
); 

// user detail route

router.post('/getuser', fetchUser,  async (req, res) => {

  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

module.exports = router;

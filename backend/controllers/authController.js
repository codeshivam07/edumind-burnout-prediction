const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
console.log("User model:", User);

// REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    console.log("Register request received:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    console.log("User saved to MongoDB");

    res.json({
      message: "User registered successfully"
    });

  } catch (error) {

    console.error("Registration Error:", error);

    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
};

// LOGIN USER
exports.loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {

    console.error("Login Error:", error);

    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
};
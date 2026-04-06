// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const validator = require("validator");
// const rateLimit = require("express-rate-limit");

// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 20,
//   message: "Too many login attempts, please try again later.",
// });

// // Password policy validation
// const isValidPassword = (password) => {
//   const minLength = 8;
//   const maxLength = 20; // Maximum length set to 20 characters
//   const hasUpperCase = /[A-Z]/.test(password);
//   const hasLowerCase = /[a-z]/.test(password);
//   const hasDigits = /\d/.test(password);
//   const hasSpecialChars = /[!@#$%^&*]/.test(password);

//   return (
//     password.length >= minLength &&
//     password.length <= maxLength && // Check for maximum length
//     hasUpperCase &&
//     hasLowerCase &&
//     hasDigits &&
//     hasSpecialChars
//   );
// };

// const isValidEmailDomain = (email) => {
//   return email.endsWith("@gmail.com") || email.endsWith("@yahoo.com");
// };

// // //REGISTER
// // router.post("/register", async (req, res) => {
// //   try {
// //     const { username, email, password } = req.body;
// //     const sanitizedUsername = validator.escape(username);
// //     const sanitizedEmail = validator.normalizeEmail(email);
// //     const sanitizedPassword = validator.escape(password);

// //     if (!isValidPassword(sanitizedPassword)) {
// //       return res
// //         .status(400)
// //         .json("Password does not meet complexity requirements.");
// //     }

// //     const prohibitedPasswords = ["password", "123456", "qwerty"];
// //     if (prohibitedPasswords.includes(sanitizedPassword)) {
// //       return res.status(400).json("Password is too common.");
// //     }

// //     if (!isValidEmailDomain(sanitizedEmail)) {
// //       return res
// //         .status(400)
// //         .json("Only @gmail.com and @yahoo.com email addresses are allowed.");
// //     }

// //     const salt = await bcrypt.genSalt(10);
// //     const hashedPassword = await bcrypt.hash(sanitizedPassword, salt);
// //     const newUser = new User({
// //       username: sanitizedUsername,
// //       email: sanitizedEmail,
// //       password: hashedPassword,
// //     });
// //     const savedUser = await newUser.save();
// //     res.status(200).json(savedUser);
// //   } catch (err) {
// //     res.status(500).json(err);
// //   }
// // });

// //REGISTER
// router.post("/register", async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     const sanitizedUsername = validator.escape(username);
//     const sanitizedEmail = validator.normalizeEmail(email);
//     const sanitizedPassword = validator.escape(password);

//     if (!isValidPassword(sanitizedPassword)) {
//       return res
//         .status(400)
//         .json(
//           "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character."
//         );
//     }

//     const prohibitedPasswords = ["password", "123456", "qwerty"];
//     if (prohibitedPasswords.includes(sanitizedPassword)) {
//       return res.status(400).json("Password is too common.");
//     }

//     if (!isValidEmailDomain(sanitizedEmail)) {
//       return res
//         .status(400)
//         .json("Only @gmail.com and @yahoo.com email addresses are allowed.");
//     }

//     // Check for duplicate username
//     const existingUsername = await User.findOne({
//       username: sanitizedUsername,
//     });
//     if (existingUsername) {
//       return res.status(400).json("Username already exists.");
//     }

//     // Check for duplicate email
//     const existingEmail = await User.findOne({ email: sanitizedEmail });
//     if (existingEmail) {
//       return res.status(400).json("Email already exists.");
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(sanitizedPassword, salt);
//     const newUser = new User({
//       username: sanitizedUsername,
//       email: sanitizedEmail,
//       password: hashedPassword,
//     });
//     const savedUser = await newUser.save();
//     res.status(200).json(savedUser);
//   } catch (err) {
//     res.status(500).json("Internal server error.");
//   }
// });
// //LOGIN
// // router.post("/login", loginLimiter, async (req, res) => {
// //   try {
// //     const user = await User.findOne({ email: req.body.email });

// //     if (!user) {
// //       return res.status(404).json("User not found!");
// //     }
// //     const match = await bcrypt.compare(req.body.password, user.password);

// //     if (!match) {
// //       return res.status(401).json("Wrong credentials!");
// //     }

// //     const token = jwt.sign(
// //       { _id: user._id, username: user.username, email: user.email },
// //       process.env.SECRET,
// //       {
// //         expiresIn: "3d",
// //       }
// //     );
// //     const { password, ...info } = user._doc;
// //     res.cookie("token", token).status(200).json(info);
// //   } catch (err) {
// //     res.status(500).json(err);
// //   }
// // });

// // LOGIN
// // LOGIN
// router.post("/login", loginLimiter, async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });

//     if (!user) {
//       return res.status(404).json("User not found!");
//     }

//     // Check if the account is locked
//     if (user.isLocked) {
//       const unlockTime = new Date(user.lockUntil);
//       const options = { hour: "2-digit", minute: "2-digit", hour12: true };
//       const formattedTime = unlockTime.toLocaleTimeString([], options);
//       return res
//         .status(403)
//         .json(
//           `Your account is temporarily locked due to multiple failed login attempts. Please try again after ${formattedTime}.`
//         );
//     }

//     const match = await bcrypt.compare(req.body.password, user.password);

//     if (!match) {
//       user.failedLoginAttempts += 1; // Increment failed login attempts

//       // Lock account if failed attempts exceed limit (e.g., 5 attempts)
//       if (user.failedLoginAttempts >= 5) {
//         user.isLocked = true;
//         user.lockUntil = Date.now() + 2 * 60 * 1000; // Lock for 2 minutes
//       }

//       await user.save(); // Save the user with updated attempts and lock status
//       return res.status(401).json("Wrong credentials!");
//     }

//     // Reset failed attempts on successful login
//     user.failedLoginAttempts = 0;
//     user.isLocked = false; // Unlock account on successful login
//     user.lockUntil = undefined; // Clear lock time
//     await user.save();

//     const token = jwt.sign(
//       { _id: user._id, username: user.username, email: user.email },
//       process.env.SECRET,
//       {
//         expiresIn: "3d",
//       }
//     );

//     const { password, ...info } = user._doc;
//     res.cookie("token", token).status(200).json(info);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// //LOGOUT
// router.get("/logout", async (req, res) => {
//   try {
//     res
//       .clearCookie("token", { sameSite: "none", secure: true })
//       .status(200)
//       .send("User logged out successfully!");
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// //REFETCH USER
// router.get("/refetch", (req, res) => {
//   const token = req.cookies.token;
//   jwt.verify(token, process.env.SECRET, {}, async (err, data) => {
//     if (err) {
//       return res.status(404).json(err);
//     }
//     res.status(200).json(data);
//   });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const rateLimit = require("express-rate-limit");

const LOCKOUT_THRESHOLD = 5; // Set the threshold for failed login attempts
const LOCKOUT_TIME = 30; // Lockout time in minutes

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again later.",
});

// Password policy validation
const isValidPassword = (password) => {
  const minLength = 8;
  const maxLength = 20; // Maximum length set to 20 characters
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigits = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*]/.test(password);

  return (
    password.length >= minLength &&
    password.length <= maxLength && // Check for maximum length
    hasUpperCase &&
    hasLowerCase &&
    hasDigits &&
    hasSpecialChars
  );
};

const isValidEmailDomain = (email) => {
  return email.endsWith("@gmail.com") || email.endsWith("@yahoo.com");
};

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const sanitizedUsername = validator.escape(username);
    const sanitizedEmail = validator.normalizeEmail(email);
    const sanitizedPassword = validator.escape(password);

    if (!isValidPassword(sanitizedPassword)) {
      return res
        .status(400)
        .json(
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character."
        );
    }

    const prohibitedPasswords = ["password", "123456", "qwerty"];
    if (prohibitedPasswords.includes(sanitizedPassword)) {
      return res.status(400).json("Password is too common.");
    }

    if (!isValidEmailDomain(sanitizedEmail)) {
      return res
        .status(400)
        .json("Only @gmail.com and @yahoo.com email addresses are allowed.");
    }

    // Check for duplicate username
    const existingUsername = await User.findOne({
      username: sanitizedUsername,
    });
    if (existingUsername) {
      return res.status(400).json("Username already exists.");
    }

    // Check for duplicate email
    const existingEmail = await User.findOne({ email: sanitizedEmail });
    if (existingEmail) {
      return res.status(400).json("Email already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(sanitizedPassword, salt);
    const newUser = new User({
      username: sanitizedUsername,
      email: sanitizedEmail,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json("Internal server error.");
  }
});

// LOGIN
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    // Check if the account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingLockTime = Math.round(
        (user.lockUntil - Date.now()) / 1000
      ); // seconds
      const minutes = Math.floor(remainingLockTime / 60);
      const seconds = remainingLockTime % 60;
      return res
        .status(403)
        .json(
          `Your account is temporarily locked for ${minutes} minute(s) and ${seconds} second(s). Please try again later.`
        );
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        // Lock account after 5 failed attempts
        user.lockUntil = Date.now() + 120 * 1000; // Lock for 2 minutes
      }
      await user.save();
      return res.status(401).json("Wrong credentials!");
    }

    // Reset failed attempts and lock time on successful login
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined; // Clear lock time
    await user.save();

    const token = jwt.sign(
      { _id: user._id, username: user.username, email: user.email },
      process.env.SECRET,
      {
        expiresIn: "3d",
      }
    );
    const { password, ...info } = user._doc;
    res.cookie("token", token).status(200).json(info);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGOUT
router.get("/logout", async (req, res) => {
  try {
    res
      .clearCookie("token", { sameSite: "none", secure: true })
      .status(200)
      .send("User logged out successfully!");
  } catch (err) {
    res.status(500).json(err);
  }
});

// REFETCH USER
router.get("/refetch", (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.SECRET, {}, async (err, data) => {
    if (err) {
      return res.status(404).json(err);
    }
    res.status(200).json(data);
  });
});

module.exports = router;

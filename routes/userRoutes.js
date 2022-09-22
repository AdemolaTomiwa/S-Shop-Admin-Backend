import express from 'express';
import bcrypt from 'bcryptjs';
import { auth } from '../middleware/auth.js';

const router = express.Router();

import User from '../model/userModel.js';
import generateToken from '../utils/generateToken.js';
import CustomerUser from '../model/customerModel.js';
import SellerUser from '../model/sellerModel.js';
import Product from '../model/productModel.js';

// // Create a new User
// // POST @/api/users
// // Public
// router.post('/', async (req, res) => {
//    try {
//       const {
//          firstName,
//          lastName,
//          email,
//          phoneNumber,
//          retypePassword,
//          password,
//       } = req.body;

//       if (
//          !firstName ||
//          !lastName ||
//          !email ||
//          !phoneNumber ||
//          !password ||
//          !retypePassword
//       )
//          return res
//             .status(400)
//             .json({ msg: 'Please enter all asterisked fields!' });

//       if (phoneNumber.length !== 11 || phoneNumber.charAt(0) !== '0')
//          return res
//             .status(409)
//             .json({ msg: 'Please enter a valid phone number!' });

//       if (password !== retypePassword)
//          return res.status(409).json({ msg: 'Password does not match!' });

//       if (password.length <= 5)
//          return res.status(409).json({
//             msg: 'Password should be at least 6 character long!',
//          });

//       //   Check is user exist
//       const userExist = await User.findOne({ email });

//       if (userExist)
//          return res.status(409).json({
//             msg: 'Account already exist! Please login!',
//          });

//       const newUser = new User({
//          firstName,
//          lastName,
//          email,
//          phoneNumber,
//          password,
//          retypePassword,
//       });

//       // Hash password
//       bcrypt.genSalt(14, (err, salt) => {
//          bcrypt.hash(newUser.password, salt, (err, hash) => {
//             if (err) throw err;

//             // Set new user's password to hash
//             newUser.password = hash;

//             // Save new user
//             newUser.save().then((user) => {
//                // Generate JWT Tokem
//                const token = generateToken(user);

//                res.status(201).json({
//                   token,
//                   user: {
//                      id: user._id,
//                      firstName: user.firstName,
//                      lastName: user.lastName,
//                      email: user.email,
//                      phoneNumber: user.phoneNumber,
//                      isSShopAdmin: user.isSShopAdmin,
//                   },
//                });
//             });
//          });
//       });
//    } catch (err) {
//       res.status(500).json({ msg: 'An error occured!' });
//    }
// });

// Update user
// PUT /@api/users
// private
router.put('/', auth, async (req, res) => {
   try {
      const { firstName, lastName, phoneNumber } = req.body;

      const user = await User.findById(req.user.id);

      if (!user)
         return res
            .status(404)
            .json({ msg: 'Seller does not exist! An error occured!' });

      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.phoneNumber = phoneNumber || user.phoneNumber;

      if (phoneNumber.length !== 11 || phoneNumber.charAt(0) !== '0')
         return res
            .status(409)
            .json({ msg: 'Please enter a valid phone number!' });

      const savedUser = await user.save();

      const token = generateToken(savedUser);

      res.status(201).json({
         token,
         user: {
            id: savedUser._id,
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            email: savedUser.email,
            phoneNumber: savedUser.phoneNumber,
            isSShopAdmin: savedUser.isSShopAdmin,
         },
      });
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

// Update user login details
// PUT /@api/users/passwords
// Private
router.put('/passwords', auth, async (req, res) => {
   try {
      const { newPassword, currentPassword, retypePassword } = req.body;

      const user = await User.findById(req.user.id);

      if (!user)
         return res
            .status(404)
            .json({ msg: 'Seller does not exist! An error occured!' });

      if (!currentPassword || !newPassword || !retypePassword)
         return res.status(409).json({ msg: 'Please enter all fields!' });

      bcrypt.compare(currentPassword, user.password).then((isMatch) => {
         if (!isMatch)
            return res.status(409).json({ msg: 'Invalid current password!' });

         if (newPassword.length <= 5)
            return res.status(400).json({
               msg: 'New password should be at least 6 character long!',
            });

         if (newPassword !== retypePassword)
            return res.status(409).json({ msg: 'Passwords do not match!' });

         user.password = newPassword;

         //   Hash user password
         bcrypt.genSalt(14, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
               if (err) throw err;

               // Setting newUser password to the hash password
               user.password = hash;

               // Save new user to DB
               user
                  .save()
                  .then((savedUser) => {
                     // Generate JWT Tokem
                     const token = generateToken(savedUser);
                     res.status(201).json({
                        token,
                        user: {
                           id: savedUser._id,
                           firstName: savedUser.firstName,
                           lastName: savedUser.lastName,
                           email: savedUser.email,
                           phoneNumber: savedUser.phoneNumber,
                           isSShopAdmin: savedUser.isSShopAdmin,
                        },
                     });
                  })
                  .catch(() =>
                     res
                        .status(500)
                        .json({ msg: 'An error occured! Please try again!' })
                  );
            });
         });
      });
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

// Get all users
// GET @/api/users
// Private
router.get('/', auth, async (req, res) => {
   try {
      const keyword = req.query.keyword
         ? {
              $or: [
                 {
                    firstName: {
                       $regex: req.query.keyword,
                       $options: 'i',
                    },
                 },
                 {
                    lastName: {
                       $regex: req.query.keyword,
                       $options: 'i',
                    },
                 },
                 {
                    email: {
                       $regex: req.query.keyword,
                       $options: 'i',
                    },
                 },
              ],
           }
         : {};

      const users = await CustomerUser.find({
         ...keyword,
      }).sort({
         createdAt: -1,
      });

      res.status(200).json(users);
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

// Get all sellers
// GET @/api/users/sellers
// Private
router.get('/sellers', auth, async (req, res) => {
   try {
      const keyword = req.query.keyword
         ? {
              $or: [
                 {
                    firstName: {
                       $regex: req.query.keyword,
                       $options: 'i',
                    },
                 },
                 {
                    lastName: {
                       $regex: req.query.keyword,
                       $options: 'i',
                    },
                 },
                 {
                    email: {
                       $regex: req.query.keyword,
                       $options: 'i',
                    },
                 },
                 {
                    brandName: {
                       $regex: req.query.keyword,
                       $options: 'i',
                    },
                 },
              ],
           }
         : {};

      const sellers = await SellerUser.find({
         ...keyword,
      }).sort({
         createdAt: -1,
      });

      res.status(200).json(sellers);
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

// Get seller's details
// Get @/api/users/seller/:id
// Private
router.get('/seller/:id', auth, async (req, res) => {
   try {
      const seller = await SellerUser.findById(req.params.id).select(
         '-password'
      );

      if (!seller)
         return res
            .status(404)
            .json({ msg: 'Seller not found! An error occured!' });

      const products = await Product.find({
         sellerId: req.params.id,
      }).sort({
         createdAt: -1,
      });

      res.status(200).json({ seller, products });
   } catch (err) {
      console.log(err);
      res.status(500).json({ msg: 'An error occured!' });
   }
});

export default router;

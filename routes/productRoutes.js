import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

import Product from '../model/productModel.js';

// Get all products
// GET @/api/products
// Private
router.get('/', auth, async (req, res) => {
   try {
      const keyword = req.query.keyword
         ? {
              $or: [
                 {
                    name: {
                       $regex: req.query.keyword,
                       $options: 'i',
                    },
                 },
                 {
                    productImage: {
                       $regex: req.query.keyword,
                       $options: 'i',
                    },
                 },
                 {
                    description: {
                       $regex: req.query.keyword,
                       $options: 'i',
                    },
                 },
                 {
                    brand: {
                       $regex: req.query.keyword,
                       $options: 'i',
                    },
                 },
                 {
                    category: {
                       $regex: req.query.keyword,
                       $options: 'i',
                    },
                 },
              ],
           }
         : {};

      const products = await Product.find({
         ...keyword,
      }).sort({
         createdAt: -1,
      });

      res.status(200).json(products);
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

// Get a product
// GET @/api/products/:id
// Private
router.get('/:id', auth, async (req, res) => {
   try {
      const product = await Product.findById(req.params.id);

      if (!product)
         return res
            .status(404)
            .json({ msg: 'Product not found! An error occured!' });

      res.status(200).json(product);
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

export default router;

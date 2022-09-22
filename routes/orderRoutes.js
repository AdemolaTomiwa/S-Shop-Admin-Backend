import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

import Order from '../model/orderModel.js';
import CustomerUser from '../model/customerModel.js';
import SellerUser from '../model/sellerModel.js';

// Get all orders
// GET @/api/orders
// Private
router.get('/', auth, async (req, res) => {
   try {
      const orders = await Order.find().sort({
         createdAt: -1,
      });

      res.status(200).json(orders);
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

// Get an order
// GET @/api/orders/:id
// Private
router.get('/:id', auth, async (req, res) => {
   try {
      const order = await Order.findById(req.params.id);

      if (!order)
         return res
            .status(404)
            .json({ msg: 'Order not found! An error occured!' });
      const orderUser = await CustomerUser.findById(order.user).select(
         '-password'
      );
      res.status(200).json({ order, orderUser });
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

// Update order to paid
// PUT @/api/orders/:id/pay
// Private
router.put('/:id/pay', auth, async (req, res) => {
   try {
      const existingOrder = await Order.findById(req.params.id);

      if (!existingOrder)
         return res.status(404).json({ msg: 'An error occured!' });

      existingOrder.isPaid = true;
      existingOrder.paidAt = Date.now();

      const orderUser = await CustomerUser.findById(existingOrder.user).select(
         '-password'
      );

      const order = await existingOrder.save();

      res.status(200).json({ order, orderUser });
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

// Update order to deliver
// PUT @/api/orders/:id/deliver/order
// Private
router.put('/:id/deliver/order', auth, async (req, res) => {
   try {
      const existingOrder = await Order.findById(req.params.id);

      if (!existingOrder)
         return res.status(404).json({ msg: 'An error occured!' });

      existingOrder.isDelivered = true;
      existingOrder.deliveredAt = Date.now();

      const orderUser = await CustomerUser.findById(existingOrder.user).select(
         '-password'
      );

      const order = await existingOrder.save();

      res.status(200).json({ order, orderUser });
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

// Get seller's details
// Get @/api/orders/seller/:id
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

      res.status(200).json(seller);
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

export default router;

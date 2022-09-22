import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
   {
      orderItems: [
         {
            name: {
               type: String,
               required: true,
            },
            qty: {
               type: Number,
               required: true,
               default: 1,
            },
            productImage: {
               type: String,
               required: true,
            },
            size: {
               type: String,
            },
            price: {
               type: Number,
               required: true,
            },
            category: {
               type: String,
               required: true,
               default: 'all',
            },
            brand: {
               type: String,
               required: true,
               default: 'S-Shop',
            },
            id: {
               type: mongoose.Schema.Types.ObjectId,
               required: true,
               ref: 'Product',
            },
         },
      ],
      location: {
         type: String,
         required: true,
      },
      paymentMethod: {
         type: String,
         required: true,
      },
      totalPrice: {
         type: Number,
         required: true,
      },
      user: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'User',
      },
      isPaid: {
         type: Boolean,
         default: false,
      },
      isDelivered: {
         type: Boolean,
         default: false,
      },
      paidAt: {
         type: Date,
      },
      deliveredAt: {
         type: Date,
      },
   },
   { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;

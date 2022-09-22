import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
   {
      firstName: {
         type: String,
         required: true,
      },
      lastName: {
         type: String,
         required: true,
      },
      phoneNumber: {
         type: String,
         required: true,
         trim: true,
      },
      picture: {
         type: String,
         default:
            'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
      },
      email: {
         type: String,
         required: true,
         unique: true,
         trim: true,
      },
      password: {
         type: String,
         required: true,
      },
      isAdmin: {
         type: Boolean,
         required: true,
         default: false,
      },
      isSShopAdmin: {
         type: Boolean,
         required: true,
         default: false,
      },
   },
   {
      timestamps: true,
   }
);

const CustomerUser = mongoose.model('User', customerSchema);

export default CustomerUser;

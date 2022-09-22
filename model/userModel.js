import mongoose from 'mongoose';

const adminUserSchema = new mongoose.Schema(
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
      isSShopAdmin: {
         type: Boolean,
         required: true,
         default: true,
      },
   },
   {
      timestamps: true,
   }
);

const User = mongoose.model('AdminUser', adminUserSchema);

export default User;

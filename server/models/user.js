const mongoose = require('mongoose')
const Product = require('../models/products');
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    lowercase: true
  },
  number: {
    type: Number,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  shippingAddress: [{
    type: {
      address: {
        type: String
      },
      city: {
        type: String
      },
      state: {
        type: String
      },
      pincode: {
        type: Number
      }
    }
  }],
  totalOrders: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  cart: {
    item: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
      },
      quantity: {
        type: Number
      }

    }]
  },
  cartTotal: {
    type: Number,
    default: 0
  },
  // wishlist: [{
  //   type: {
  //     productId: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: 'Products'
  //     }
  //   }
  // }],
  isBlocked: {
    type: Boolean,
    default: false
  }
})
UserSchema.pre('save', async function (next) {
  try {
    hashedPassword = await bcrypt.hash(this.password, 10)
    this.password = hashedPassword
    next();
  } catch (error) {
    console.log(error)
  }
})


UserSchema.methods.addToCart = function (product) {
    const cart = this.cart
    const isExisting = cart.item.findIndex(objInItems => {
        return new String(objInItems.productId).trim() == new String(product._id).trim()
    })
    if (isExisting >= 0) {
        cart.item[isExisting].quantity += 1
    } else {
        cart.item.push({
            productId: product._id,
            quantity: 1, price: product.price
        })
    }
    cart.totalPrice += product.price
    console.log("User in schema:", this);
    return this.save()
  } 
UserSchema.methods.removefromCart = async function (productId) {
  const cart = this.cart
  const isExisting = cart.item.findIndex(objInItems => new String(objInItems.productId).trim() === new String(productId).trim())
  if (isExisting >= 0) {
      const prod = await Product.findById(productId)
      cart.totalPrice -= prod.price * cart.item[isExisting].qty
      cart.item.splice(isExisting, 1)
      console.log("User in schema:", this);
      return this.save()
  }
}
UserSchema.methods.updateCart = async function (id, qty) {
    const cart = this.cart
    const product = await Product.findById(id)
    const index = cart.item.findIndex(objInItems => {
        return new String(objInItems.productId).trim() == new String(product._id).trim()
    })
    console.log(id);
    if (qty > cart.item[index].qty) {
        cart.item[index].qty += 1
        cart.totalPrice += product.price
    } else if (qty < cart.item[index].qty) {
        cart.item[index].qty -= 1
        cart.totalPrice -= product.price
    } else {

    } console.log(cart.totalPrice);
    this.save()
    return cart.totalPrice
  }
const User = mongoose.model('User', UserSchema)

module.exports = User;
const User = require('../../server/models/user')
const Address = require('../../server/models/addressModels')
const message = require('../../util/twilio')
const bcrypt = require('bcrypt')
const Products = require('../../server/models/products')
const Category = require('../../server/models/category')

const mongoose = require('mongoose')

const getLogin = (req, res) => {
   if (req.session.message) {
      const message = req.session.message
      req.session.message = ""
      return res.render('users/login', { message })
   }
   else {
      const message = ""
      return res.render('users/login', { message })
   }
};

const getRegister = (req, res) => {
   if (req.session.message) {
      const message = req.session.message
      req.session.message = ""
      return res.render('users/register', { message })
   }
   else {
      const message = ""
      return res.render('users/register', { message })
   }
};

const getLandingpage = async (req, res) => {
   const products = await Products.find({ isDeleted: false })
   return res.render('users/landingpage', { products })
};

const getHomepage = async (req, res) => {
   const products = await Products.find({ isDeleted: false })
   const user = await User.find({ isBlocked: false })
   return res.render('users/userhome', { products, user })
};

const getOtp = (req, res) => {
   return res.render('users/otp')
};

const getError = (req, res) => {
   return res.render('users/error')
};

const getProducts = async (req, res) => {
   const products = await Products.find({ isDeleted: false })
   return res.render('product-page', { products })
};

const loadDetails = async (req, res) => {
   try {
      const id = req.query.id;
      const details = await Products.findOne({ _id: id })
      console.log(details);
      const product = await Products.find({ category: details.category });
      res.render("users/details", { user: req.session.user, details: details, related: product, message: "" });
   } catch (error) {
      console.log(error.message);
   }
};

const saveUser = async (req, res) => {
   const check = req.body.email
   const storeuser = ({
      username: req.body.username,
      email: req.body.email,
      number: req.body.number,
      password: req.body.password
   })
   req.session.storeuser = storeuser

   const email = await User.find({ email: req.body.email })
   const number = await User.find({ number: req.body.number })
   if (email.length == 0) {
      if (number.length != 0) {
         req.session.message = "Number already exist"
         return res.redirect('/register')
      } else {
         try {
            await message.sentotp(req.session.storeuser.number)
            res.redirect('./otp')
         }
         catch {
            console.log("err")
         }
      }
   }
   else {
      req.session.message = "Email already exist"
      return res.redirect('/register')
   }
};

const addUser = async (req, res) => {
   try {
      const storeuser = new User({
         username: req.session.storeuser.username,
         email: req.session.storeuser.email,
         number: req.session.storeuser.number,
         password: req.session.storeuser.password
      })
      const otp = req.body.otp
      if (otp.length == 0) {
         req.session.message = "Enter otp"
         return res.redirect('/otp')
      }
      else {
         const check = await message.check(otp, req.session.storeuser.number)
         if (check.status == "approved") {
            await storeuser.save()
            req.session.message = ""
            res.redirect('./login',)
         }
         else {
            req.session.message = "Invalid otp"
            res.redirect('/otp')
         }
      }
   }
   catch (err) {
      console.log(err)
   }
};

const resendOtp = async (req, res) => {
   try {
      await message.sentotp(req.session.storeuser.number)
      return res.redirect('/otp')
   }
   catch (err) {
      console.log(err);
   }
};

const redirectHomepage = async (req, res) => {
   const user = await User.find({ email: req.body.email })
   if (user.length != 0) {
      const password1 = req.body.password
      const match = await bcrypt.compare(password1, user[0].password)

      if (!match) {
         req.session.message = "password not correct"
         res.redirect('/login')
      }
      else if (user[0].isBlocked) {
         req.session.message = "User is Blocked"
         res.redirect('/login')
      }
      else {
         req.session.user = user[0]
         return res.redirect('/home')
      }
   }
   else {
      req.session.message = "Invalid User"
      res.redirect('/login',)
   }
};

const getUserProfile = async (req,res) => {
   try {
      const usid = req.session.user;
      console.log(usid)
      const user = await User.findOne({ _id: usid });
      const adid = await Address.find({ userId: usid })
      const addressData = await Address.find({ userId: usid })
      // const orderData = await order.find({ userId: usid }).sort({ createdAt: -1 }).populate("products.item.productId");
      // res.render("users/profile", { user: req.session.user, userAddress: adid, userData: user, address: addressData, order: orderData })
      res.render("users/profile", { user: req.session.user, userAddress: adid, user: user, address: addressData })
      
  } catch (error) {
      console.log(error.message);
  }
};
const addNewAddress = async (req, res) => {
   try {
       userSession = req.session
       const nAddress = await new Address({
           firstname: req.body.firstname,
           lastname: req.body.lastname,
           country: req.body.country,
           address: req.body.address,
           city: req.body.city,
           state: req.body.state,
           pin: req.body.zip,
           mobile: req.body.mno,
           userId: userSession._id
       })
       const newAddress = await nAddress.save();
       console.log(newAddress);
       if (newAddress) {
           res.redirect("users/profile");
       }
   } catch (error) {

   }
};
const editUser = async (req, res) => {
   try {
       const currentUser = req.session.user;
       const findUser = await User.findOne({ _id: currentUser });
       res.render("users/editUser", { user: findUser });

   } catch (error) {
       console.log(error.message);
   }
};
const loadShop = async (req, res) => {
   try {
       const categoryData = await Category.find()
       console.log("categoryData:"+categoryData)
       console.log(req.query)
       let { search, sort, category, limit, page, ajax } = req.query
       if (!search) {
           search = ''
       }
       skip = 0
       if (!limit) {
           limit = 15
       }
       if (!page) {
           page = 0  
       }
       skip = page * limit
      //  console.log(category);
       let arr = []
       if (category) {
           for (i = 0; i < category.length; i++) {
               arr = [...arr, categoryData[category[i]].name]
           }
       } else {
           category = []
           arr = categoryData.map((x) => x.name)
       }
       console.log('sort ' + req.query.sort);
       console.log('category ' + arr);
       if (sort == 0) {
           productData = await Products.find({ $and: [{ category: arr }, { $or: [{ name: { $regex: '' + search + ".*" } }, { category: { $regex: ".*" + search + ".*" } }] }] }).sort({ $natural: -1 })
           pageCount = Math.floor(productData.length / limit)
           if (productData.length % limit > 0) {
               pageCount += 1
           }
           console.log(productData.length + ' results found ' + pageCount);
           productData = await Products.find({ $and: [{ category: arr }, { $or: [{ name: { $regex: '' + search + ".*" } }, { category: { $regex: ".*" + search + ".*" } }] }] }).sort({ $natural: -1 }).skip(skip).limit(limit)
       } else {
           productData = await Products.find({ $and: [{ category: arr }, { $or: [{ name: { $regex: '' + search + ".*" } }, { category: { $regex: ".*" + search + ".*" } }] }] }).sort({ price: sort })
           pageCount = Math.floor(productData.length / limit)
           if (productData.length % limit > 0) {
               pageCount += 1
           }
           console.log(productData.length + ' results found ' + pageCount);
           productData = await Products.find({ $and: [{ category: arr }, { $or: [{ name: { $regex: '' + search + ".*" } }, { category: { $regex: ".*" + search + ".*" } }] }] }).sort({ price: sort }).skip(skip).limit(limit)
       }
       console.log(productData.length + ' results found');
       if (req.session.user) { session = req.session.user } else session = false
       if (pageCount == 0) { pageCount = 1 }
       if (ajax) {
           res.json({ Products: productData, pageCount, page })
       } else {
           res.render('users/shop', { user: session, product: productData, category: categoryData, val: search, selected: category, order: sort, limit: limit, pageCount, page })
       }
   } catch (error) {
       console.log(error.message);
   }
}
const loadCheckout = async (req, res) => {
   try {
      //  const couponData = await coupon.find();
       const userData = req.session.user_id;
       const addresss = await address.find({ userId: userData });
       const userDetails = await User.findById({ _id: userSession })
       const completeUser = await userDetails.populate('cart.item.productId')
      //  res.render("checkout", { user: req.session.user, address: addresss, checkoutdetails: completeUser.cart, coupon: couponData, discount: req.query.coupon, wallet: userDetails.wallet });
       res.render("checkout", { user: req.session.user, address: addresss, checkoutdetails: completeUser.cart });
   } catch (error) {
       console.log(error.message);
   }
}



const getUserlogout = async (req, res) => {
   req.session.user = null
   res.redirect('/login')
};

module.exports = {
   getUserlogout,
   redirectHomepage,
   resendOtp,
   addUser,
   saveUser,
   loadDetails,
   getProducts,
   getOtp,
   getHomepage,
   getLandingpage,
   getRegister,
   getError,
   getLogin,
   getUserProfile,
   addNewAddress,
   editUser,
   loadShop,
   loadCheckout,
}
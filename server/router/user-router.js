const express = require ('express')
const router = express.Router()
const userControls=require('../../server/controller/user-controller')
const session = require('../../server/middleware/usersession')
const adminController = require('../../server/controller/admin-controller')
const cartControls = require('../../server/controller/cartController')
const { isLogged, notLogged } = require('../../server/middleware/usersession')

router.get('/login',session.notLogged,  userControls.getLogin)
router.get('/otp',session.notLogged,userControls.getOtp)
router.get('/error',userControls.getError)
router.get('/register',session.notLogged,userControls.getRegister)
router.get('/',session.notLogged, userControls.getLandingpage)
router.get('/users/profile',session.isLogged,userControls.getUserProfile)
router.get('/home' ,session.isLogged, userControls.getHomepage)
router.get("/users/details",userControls.loadDetails);
router.get('/register/resend',userControls.resendOtp)
router.get('/logout',userControls.getUserlogout)
router.post('/register',session.notLogged, userControls.saveUser)
router.post('/otp',session.notLogged, userControls.addUser)
router.post('/login', userControls.redirectHomepage)
router.post("/addAddress",userControls.addNewAddress);
router.get("/editUser",userControls.editUser);
router.get("/users/shop",userControls.loadShop);

router.get("/users/cart",cartControls.loadCart);
router.get("/users/addToCart",cartControls.addToCart);
router.post("/users/updateCart",cartControls.updateCart);
router.get('/users/delete-cart',cartControls.deleteCart);

router.get("/loadCheckout",userControls.loadCheckout);
// router.all('*',userControls.getError)

module.exports=router
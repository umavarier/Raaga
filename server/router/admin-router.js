const { Router } = require('express')
const express = require ('express')
const { LogContext } = require('twilio/lib/rest/serverless/v1/service/environment/log')
const router = express.Router()
const adminControls =require('../../server/controller/admin-controller')
const { notLogged } = require('../../server/middleware/adminsession')
const session = require('../../server/middleware/adminsession')
const {upload}= require('../../util/multer')

router.get('/',session.notLogged, adminControls.getAdminlogin)
router.get('/adminlogin',session.isLogged, adminControls.getAdminhome)
router.get('/categories',session.isLogged, adminControls.getCategories)
router.get('/users',session.isLogged, adminControls.getUsers)
router.put('/userdata/:id', adminControls.blockUser)
router.put('/userdata/:id', session.isLogged,adminControls.blockUser)
router.patch('/categories/:id',session.isLogged, adminControls.deleteCategory )
router.patch('/product/product-details/:id',session.isLogged, adminControls.deleteProduct )
router.get('/products',session.isLogged, adminControls.getProducts)
router.get('/products/addproducts',session.isLogged, adminControls.getAddproducts)
router.get('/products/editproducts/:id',session.isLogged, adminControls.getEditproducts)
router.post('/products/addproducts',session.isLogged, upload.fields([{ name:'image',maxCount:1}, {name:'image2',maxCount:1},{name:'image3',maxCount:1}]),adminControls.addProducts)
router.post('/products/editproducts/:id',session.isLogged, upload.fields([{ name:'image',maxCount:1}, {name:'image2',maxCount:1},{name:'image3',maxCount:1}]),adminControls.editProduct)
router.get('/logout',adminControls.getAdminlogout)
router.get('/dashhome',session.isLogged, adminControls.getAdminhome)
router.post('/adminlogin', adminControls.redirectAdminhome)
router.post('/categories/add',session.isLogged, adminControls.addCategory)
















module.exports = router
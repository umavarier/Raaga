const User = require('../models/user')
const products = require("../models/products")

// const loadCart = async (req, res) => {
//     try {
//         userSession = req.session.user._id;
//         console.log(req.session.user._id)
    
//         if (userSession) {   
            
//             const userData = await User.findById({ _id: userSession })
//             const completeUser = await userData.populate('cart.item.productId')
//             console.log("userData????" + userData)
//             console.log("b4 error " +completeUser.cart);
//             res.render("users/cart", { user: req.session._id, cartProducts: completeUser.cart});
//             console.log("completeUser "+completeUser.cart.item.productId)

//         } else {
//             res.redirect("/login");
//         }
//     } catch (error) {
//         console.log(error.message);
//     }
// }

const loadCart = async (req, res) => {
    try {
        userSession = req.session.user._id;
        if (userSession) {

            
            const userData = await User.findById({ _id: userSession })
            const completeUser = await userData.populate('cart.item.productId')
           
            res.render("users/cart", { user: req.session.user, cartProducts: completeUser.cart });

        } else {
            res.redirect("/login");
        }
    } catch (error) {
        console.log(error.message);
    }
}





 const addToCart = async (req, res) => {
    try {
        const productId = req.query.id;
        console.log(productId);
        userSession = req.session.user._id;

        if (userSession) {
            const details =  await products.findOne({ _id: productId })
            const product = await products.find({ category: details.category });
            console.log("saad"+product);
            const userData = await User.findById({ _id: userSession })
            const productData = await products.findById({ _id: productId })
            userData.addToCart(productData)
            res.redirect('/users/cart');
            // res.render('details',{ user: req.session.user,message:"product added to cart !",detail: details, related: product })

        } else {
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error)
    }
}



const updateCart = async (req, res) => {
    try {
        console.log("thisss");
        let { quantity, _id } = req.body
        const userData = await User.findById({ _id: req.session.user_id })
        const productData = await Product.findById({ _id: _id })
        const price = productData.price;
        let test = await userData.updateCart(_id, quantity)
        console.log(test);
        res.json({ test, price })

    } catch (error) {
        console.log(error)
    }
}

const deleteCart = async (req, res,) => {

    try {
        const productId = req.query.id
        userSession = req.session
        const userData = await User.findById({ _id: userSession.user_id })
        userData.removefromCart(productId)
        res.redirect('users/loadCart')
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    loadCart,
    addToCart,
    deleteCart,
    updateCart,
}

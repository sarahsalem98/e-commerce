// import { dbController } from '../../dashboard-assets/custome-js/indexedDb.js';
// import { clientAuth } from '../../dashboard-assets/custome-js/Apis/Auth.js';

// (async function () {
//     try {
//         // Open the database
           
//         await dbController.openDataBase();

//         await clientAuth.login("gslixby0@abc.net.au","12345");

         
//         console.log("/////////////////")
//         console.log(await clientAuth.getloggedInUserData(1));
//         const isUpdated = await clientAuth.updateProfile(1, "ahmed nasser", "ahmednasser@gmai.l.com", "12345", " wlglaa street", "0101820858",1, "elbehira");
        
//         console.log(isUpdated)
        
//         console.log(await clientAuth.getloggedInUserData(1));
//         console.log(await clientAuth.getloggedInUserData(1))
//         // console.log(isUpdated)
          

//     } catch (error) {
//         console.error('Error interacting with IndexedDB:', error);
//     }

// })();

{/* <script type="module"> */}
import { order } from '../dashboard-assets/custome-js/Apis/Auth.js';
import { dbController } from '../dashboard-assets/custome-js/indexedDb.js';
import {userProfile} from './js/myorder.js';
$(window).on('load', async function () {
    await dbController.openDataBase();
     userProfile.showorderData();


}) import { dbController } from "../indexedDb.js"
export var order = {
makeOrder: async function (userId, email, firstName, lastName, gov, address, phone_num1, phone_num2, message) {
var allDone = false;
let cartData;
let cart;

if (userId != null) {
    cartData = await dbController.getItemsByIndex('carts', 'userId_isFinished', [String(userId), 'false']);
    cart = cartData.length > 0 ? cartData[0] : null;

    if (cart) {
        let order = {
            user_id: userId,
            cart_id: cart.id,
            status: 1,
            is_guest: false,
            email: email,
            message: message,
            first_name: firstName,
            second_name: lastName,
            gov: gov,
            address: address,
            phone_num1: phone_num1,
            phone_num2: phone_num2,
            created_at: new Date(),
            updated_at: new Date()
        };

        let orderDone = await dbController.addItem('orders', order);
        if (orderDone) {
            // Adjust product quantities and prices
            for (let product of cart.products) {
                let productData = await dbController.getItemById('products', product.id);
                if (productData) {
                    let updatedQty = productData.qty - product.qty;
                    if (updatedQty < 0) {
                        console.error(`Not enough stock for product ID: ${product.id}`);
                        return false;
                    }
                    let updatedProduct = {
                        ...productData,
                        qty: updatedQty
                    };
                    await dbController.updateItem('products', product.id, updatedProduct);
                }
            }

            let cartDatainfo = {
                user_id: String(userId),
                is_finished: 'true',
                products: cart.products
            };
            allDone = await dbController.updateItem('carts', cart.id, cartDatainfo);
        }
    }
} else {
    cartData = localStorage.getItem("user-cart");
    cart = JSON.parse(cartData);

    if (cart) {
        let newCart = {
            user_id: null,
            is_finished: 'true',
            products: cart.products
        };

        let addedCart = await dbController.addItem('carts', newCart);
        if (addedCart) {
            let orderguest = {
                user_id: null,
                cart_id: addedCart,
                status: 1,
                is_guest: true,
                email: email,
                message: message,
                first_name: firstName,
                second_name: lastName,
                gov: gov,
                address: address,
                phone_num1: phone_num1,
                phone_num2: phone_num2,
                created_at: new Date(),
                updated_at: new Date()
            };

            let orderGuestDone = await dbController.addItem('orders', orderguest);
            if (orderGuestDone) {
                // Adjust product quantities and prices for guest
                for (let product of cart.products) {
                    let productData = await dbController.getItemById('products', product.id);
                    if (productData) {
                        let updatedQty = productData.qty - product.qty;
                        if (updatedQty < 0) {
                            console.error(`Not enough stock for product ID: ${product.id}`);
                            return false;
                        }
                        let updatedProduct = {
                            ...productData,
                            qty: updatedQty,
                            price: product.price // Adjust price if needed
                        };
                        await dbController.updateItem('products', product.id, updatedProduct);
                    }
                }

                localStorage.removeItem("user-cart");
                allDone = true;
            }
        }
    }
}

return allDone;
},
getUserOrdersHistory: async function (userId) {
var orders = await dbController.getItemsByUniqueKey('orders', 'user_id', userId);
let returned_data = [];

if (orders.length != 0) {
    let cartPromises = orders.map(async (order) => {
        let cartData = await dbController.getItem('carts', order.cart_id);
        return {
            order_id: order.id,
            created_at: order.created_at,
            status: order.status,
            products: cartData ? cartData.products : []
        };
    });

    returned_data = await Promise.all(cartPromises);
}
console.log(returned_data);
return returned_data;

}

}
import {order} from'../../dashboard-assets/custome-js/Apis/orders.js'
export var orderhistory={
getUserOrdersHistory:async function(){
   ]
       

  await order.getUserOrdersHistory();

},
showorderData:async function(  ){
var id= JSON.parse(localStorage.getItem("clientSession")).sessionData.id;




console.log( (await order.getUserOrdersHistory(1)).length);

}
} create table dynamically to getorderhistory each orrders have some product and complete to my js handle this please

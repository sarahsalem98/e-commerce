import { dbController } from "../indexedDb.js"
export var order = {
    makeOrder: async function (userId,email,firstName,lastName,gov,address,phone_num1,phone_num2,message) {
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
                }
                let orderDone = await dbController.addItem('orders', order);
                if (orderDone) {
                    let cartDatainfo = {
                        user_id: String(userId),
                        is_finished: 'true',
                        products: cart.products
                    }
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
                }
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
                    }
                    allDone = await dbController.addItem('orders', orderguest);
                    localStorage.removeItem("user-cart");

                }

            }

        }

        return allDone == false ? false : true;

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
import { dbController } from "../indexedDb.js"
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
                        let productData = await dbController.getItem('products', product.id);
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
                            let productData = await dbController.getItem('products', product.id);
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
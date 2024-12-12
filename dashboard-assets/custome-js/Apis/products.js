import { dbController } from "../indexedDb.js";

export var clientProducts = {
    getAllProducts: async function () {
        let data = dbController.getDataArray('products');
        console.log(data);
        return data;
    },
    getProductById: async function (id) {
        let data = dbController.getItem('products', id);
        return data;
    },
    addReview: async function (productId, userId, userName, rate, description) {
        var data = {
            product_id: productId,
            user_id: userId,
            user_name: userName,
            rate: rate,
            description: description
        }
        var isDone = await dbController.addItem('reviews', data);
        return isDone == false ? false : true;
    },
    updateCartProducts: async function (cartData) {
        console.log("tt");
        let updatedCart = [];
        let isUpdated;
        if (cartData != null) {
            if (cartData.products.length != 0) {
                for (var i = 0; i < cartData.products; i++) {
                    var product = await dbController.getItem('products', cartData.products[i].product_id);
                    if (product) {
                        cartData.products[i].max_qty = product.qty;
                        cartData.products[i].price = product.price;
                    }
                }

                var updateCartinfo = {
                    user_id: cartData.user_id,
                    is_finished: 'false',
                    products: cartData.products
                }

            }
            updatedCart = updateCartinfo;
            if (cartData.user_id == null) {
                localStorage.setItem("user-cart", JSON.stringify(updatedCart));
                isUpdated = true;
            } else {
                isUpdated = await dbController.updateItem('carts', cartData.id, updatedCart);
            }
            console.log(updatedCart);
            return isUpdated ? updatedCart : [];
        } else {
            return false;
        }

    }, getBestSellingProducts: async function () {
        let orders = await dbController.getDataArray('orders');
        let orders_delivered = orders.filter(order => order.status == 4);
        let product_sales = {};
        for (let order of orders_delivered) {
            let cart_id = order.cart_id;
            let cart = await dbController.getItem('carts', cart_id);
            if (cart) {
                cart.products.forEach(product => {
                    if (product_sales[product.product_id]) {
                        product_sales[product.product_id] += product.qty;
                    } else {
                        product_sales[product.product_id] = product.qty;
                    }
                });
            }


        }
        let topProductIds = Object.entries(product_sales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(entry => parseInt(entry[0])); 


        let allProducts = await dbController.getDataArray('products');
        let topProducts = allProducts.filter(product => topProductIds.includes(product.id));
       return topProducts;
    }

}


import { dbController } from "../indexedDb.js";

export var clientProducts = {
    getAllProducts: async function () {
        let data = await dbController.getDataArray('products');
        data=data.filter(product=>product.status==1)
      //  console.log(data);
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
        
        
        let updatedCart = [];
        let isUpdated;
        if (cartData != null) {
            if (cartData.products.length != 0) {
                cartData.products.__proto__=[].__proto__; ///for using splice function of array object.
                for (var i = 0; i < cartData.products.length; i++) {
                    
                    
                    var product = await dbController.getItem('products', cartData.products[i].product_id);

                    if ( product ) { 

                        if(product.status==2){       // in a deactive status
                            cartData.products.splice(i,1);
                            continue;
                        }            

                        

                        cartData.products[i].max_qty = product.qty;
                        cartData.products[i].price = product.price;
                        console.log("from update");

                        if(cartData.products[i].qty>product.qty ){ // update user reqired quantity if stock is not enought

                            //if product out of stock
                            if(product.qty==0){    
                                
                                console.log( cartData.products.splice(i,1));    //delete only one element from product index
                            }else{
                                cartData.products[i].qty=product.qty;
                            }
                            
                        }
                        
                    }

                }
                
            }
            var updateCartinfo = {
                user_id: cartData.user_id,
                is_finished: 'false',
                products: cartData.products
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
    ,
    incrementProductBy:async function(product_id,qty){
        //first of all , we have to get product.

        let isUpdated=false;
        let product= await this.getProductById(product_id);

        if(product){
            product.qty+=qty;
            isUpdated = await dbController.updateItem('products', product_id, product );
            console.log("product is already updated with adding new qty.")
            return isUpdated;
        }

        return isUpdated;

    }


}


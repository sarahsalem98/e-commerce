import { dbController } from "../indexedDb.js";
import { clientProducts } from "./products.js";

export var cart = {
    fetchDummyData: async function () {
        console.log("tt");
        var data = await dbController.getDataArray('carts');
        if (data.length == 0) {
            let res = await fetch('../../dashboard-assets/data/cart-list.json');
            let alldata = await res.json();
            console.log(alldata);
            await dbController.saveDataArray('carts', alldata);
        }
    },
    addToCart: async function (productId, qty, userId, price) {

        await this.fetchDummyData();
        let cartData;
        let cart;
        let product = await dbController.getItem('products', productId);
        console.log(product);
        if (qty < product.qty) {
            if (price == product.price) {
                console.log("yy");
                if(userId!=null){
                    cartData = await dbController.getItemsByIndex('carts', 'userId_isFinished', [String(userId), 'false']);
                    cart = cartData.length > 0 ? cartData[0] : null;
                    
                }else{
                    cartData= localStorage.getItem("user-cart");
                    cart=JSON.parse(cartData);
                }
                if (!cart) {
           
                    let newCart = {
                        user_id:userId==null? null :String (userId),
                        is_finished: 'false',
                        products: [
                            {
                                product_id: productId,
                                price:price,
                                qty: qty,
                                max_qty:product.qty,
                            }
                        ]
                    };
                    let isAdded;
                    if(userId!=null){
                        isAdded = await dbController.addItem('carts', newCart);
                    }else{
                        localStorage.setItem("user-cart",JSON.stringify(newCart));
                        isAdded=true;
                    }
                   return isAdded;
                } else {
                    let allCartProducts = cart.products || [];
                    let existingProduct = allCartProducts.find(p => parseInt(p.product_id) == parseInt(productId));
                    if (existingProduct) {
                        if (qty ==0) {
                            const index = allCartProducts.indexOf(existingProduct);
                            if (index > -1) {
                                allCartProducts.splice(index, 1);
                            }
                        } else {
                            existingProduct.qty = qty;
                            existingProduct.price=price
                            existingProduct.max_qty=product.qty;
    
                        }
                    } else {
                        if (qty > 0) {
                            allCartProducts.push({ product_id:productId,price:price,max_qty:product.qty, qty: qty });
                        }
                    }
                    let updatedCart = {
                        user_id:userId==null?null: String(userId),
                        is_finished: 'false',
                        products: allCartProducts
                    };
                    let isUpdated;
                    if(userId!=null){
                        isUpdated = await dbController.updateItem('carts', cart.id, updatedCart);
                    }else{
                        localStorage.setItem("user-cart",JSON.stringify(updatedCart));
                        isUpdated=true;
                    }
                   return isUpdated;
                }
            }else{
                return false;
            }

        } else {
            return false;
        }

    },
    getCartData: async function (userId) {
        let cartData;
        let cart;
        if (userId != null) {
            cartData = await dbController.getItemsByIndex('carts', 'userId_isFinished', [String(userId), 'false']);
            cart = cartData.length > 0 ? cartData[0] : null;

        } else {
            cartData = localStorage.getItem("user-cart");
            cart = JSON.parse(cartData);
        }
        cart = clientProducts.updateCartProducts(cart)
        return cart;
    }
    // ,
    // checkProductAvailability:async function(productId,qty){
    //       var productData=await dbController.getItem('products',productId);
    //       var isValid=false;
    //       if(productData){
    //           if(productId.qty>=qty){
    //            isValid=true;
    //           } 
    //       }
    //       return isValid;
    // }
};

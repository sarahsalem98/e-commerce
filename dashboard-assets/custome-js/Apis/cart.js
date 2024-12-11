import { dbController } from "../indexedDb.js";
import { clientProducts } from "./products.js";


export var cart = {
    
    fetchDummyData: async function () {
        console.log("tt");
        var data = await dbController.getDataArray('carts');
        if (data.length == 0) {
             console.log("fg");
            let res = await fetch('../../dashboard-assets/data/cart-list.json');
            let alldata = await res.json();
            //console.log(alldata);
            await dbController.saveDataArray('carts', alldata);
        }
         
    },

    //product id --> string 
    //qty ---> string 
    //user id --- string 
    //price --->string 

    addToCart: async function (productId, qty, userId, price) {

        // console.log("df");

        // await this.fetchDummyData();

        let cartData;
        let cart;

        console.log("before ")

         
        let product = await dbController.getItem('products', productId );

        qty=Number(qty);

        if (qty <= product.qty) {
            console.log("available")
            if (price == product.price) {

                // console.log("yy");

                if(userId!=null){

                    //get user cart

                    cartData = await dbController.getItemsByIndex('carts', 'userId_isFinished', [String(userId), 'false']);
                    
                    cart = cartData.length > 0 ? cartData[0] : null;

                     

                }else{

                    //if user registered as agust.
                    cartData= localStorage.getItem("user-cart");
                    cart=JSON.parse(cartData); //if user dosenot have any cart the cart var will contain null

                }
                //if user dose not have cart before thistime.
                if (!cart) {
           
                    //literal object
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
                    //if user exist in our system so that we will store the created cart in cart store.
                    if(userId!=null){

                        isAdded = await dbController.addItem('carts', newCart);

                    }else{

                        localStorage.setItem("user-cart",JSON.stringify(newCart));
                        isAdded=true;

                    }
                   return isAdded;
                } else {

                    //user hase previous cart stord in stores.

                    let allCartProducts = cart.products || []; // if cart dose not has any product , return empty arr

                    //return -->  null or ref to object
                    let existingProduct = allCartProducts.find(p => parseInt(p.product_id) == parseInt(productId)); 

                    if (existingProduct) {

                        if (qty ==0) {

                            //the index must be not equal -1  cuz we are here 
                            const index = allCartProducts.indexOf(existingProduct);

                            if (index > -1) {
                                allCartProducts.splice(index, 1); // delete objct from array.
                            }

                        } else {
                            existingProduct.qty = qty;
                            existingProduct.price=price  // to override old price.
                            existingProduct.max_qty=product.qty; // to update old old max quantitiy
    
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
                //for seecurity pupose. we can update price of product with new product
                return false;
            }

        } else {
            //for seecurity pupose. we can update price of product with new product
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

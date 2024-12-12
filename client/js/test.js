import { dbController } from "../../dashboard-assets/custome-js/indexedDb.js"
// import { products } from '../../dashboard-assets/custome-js/products.js';
// import { orders } from "../../dashboard-assets/custome-js/orders.js"

import {cart} from "../../dashboard-assets/custome-js/Apis/cart.js";

(async function () {
    try {
        // Open the database
        await dbController.openDataBase();

        var data=await cart.addToCart(1,2,1,200);
        console.log("************************")
        console.log(data);
        console.log("************************")
         
          

    } catch (error) {
        console.error('Error interacting with IndexedDB:', error);
    }

})();

   
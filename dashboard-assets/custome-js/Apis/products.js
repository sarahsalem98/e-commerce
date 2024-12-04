import { dbController } from "../indexedDb.js";
export var clientProducts = {
    getAllProducts: async function () {
        let data = dbController.getDataArray('products');
        return data;
    },
    getProductById :async function(id){
         let data=dbController.getItem('products',id);
         return data; 
    }


}
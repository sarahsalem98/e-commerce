import { dbController } from "../indexedDb.js";
import { reviews } from "../reviews.js";

export  var clientReiview={

    getProductReiview:async function(productId){

        // await reviews.fetchData(); // for initialization
        
        let data=await dbController.getItemsByIndex("reviews","product_id",productId);
        return data;
    }
    ,
    addReview :async function(data){
        await dbController.addItem("reviews",data); 
    }

    

}
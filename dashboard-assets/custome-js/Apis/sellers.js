import { dbController } from "../indexedDb.js"
export var seller = {
    getsellerData: async function (seller_id) {
        var data= await dbController.getItem('sellers',seller_id);
        return data;
    }

}
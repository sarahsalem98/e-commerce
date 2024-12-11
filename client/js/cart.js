import { dbController } from "../../dashboard-assets/custome-js/indexedDb.js"
import { products } from '../../dashboard-assets/custome-js/products.js';

(async function () {
    try {
        // Open the database
        await dbController.openDataBase();

        var data=await products.fetchData();
        console.log(data);

    } catch (error) {
        console.error('Error interacting with IndexedDB:', error);
    }

})();
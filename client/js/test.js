import { dbController } from '../../dashboard-assets/custome-js/indexedDb.js';
import { clientAuth } from '../../dashboard-assets/custome-js/Apis/Auth.js';

(async function () {
    try {
        // Open the database
           
        await dbController.openDataBase();

        await clientAuth.login("gslixby0@abc.net.au","12345");

         
        console.log("/////////////////")
        console.log(await clientAuth.getloggedInUserData(1));
        const isUpdated = await clientAuth.updateProfile(1, "ahmed nasser", "ahmednasser@gmai.l.com", "12345", " wlglaa street", "0101820858",1, "elbehira");
        
        console.log(isUpdated)
        
        console.log(await clientAuth.getloggedInUserData(1));
        console.log(await clientAuth.getloggedInUserData(1))
        // console.log(isUpdated)
          

    } catch (error) {
        console.error('Error interacting with IndexedDB:', error);
    }

})();

   
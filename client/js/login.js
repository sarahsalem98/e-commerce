import { dbController } from "../../dashboard-assets/custome-js/indexedDb.js";
import { clientAuth } from '../../dashboard-assets/custome-js/Apis/Auth.js';
import { genreal,updateUIBasedOnSession, handleLogout } from "./general.js";
import { generalClient } from "../../dashboard-assets/custome-js/Apis/general.js";

(async function () {
    try {
        
        await dbController.openDataBase();
        await genreal.updateCartPill();

        
        document.getElementById('loginForm').addEventListener('click', async function () {

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            let rules = {
                'email': { required: true, email: true },
                'password': { required: true }
            }
            let messages = {
                'email': "please enter valid email",
                'password': "pleas enter paassword"
            }

            var isValidform= await generalClient.validateForm("loginForm", rules, messages);

            if(isValidform){
              //  try {
                    const isValid = await clientAuth.login(email, password);
    
                    if (isValid) {
                        toastr.success("message sent successfully");
                        window.location.href = "/client/products.html";
                    } else {
                        toastr.error("something went wrong ,please check your eamil or password");
                    }
                // } catch (authError) {
                //     console.error("Authentication error:", authError);
                //     toastr.error("something went wrong ,try again later");
                // }
            }

       
        });

    } catch (error) {
        console.error('Error interacting with IndexedDB:', error);
    }
})();

updateUIBasedOnSession();
handleLogout();




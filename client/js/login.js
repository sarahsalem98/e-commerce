import { dbController } from "../../dashboard-assets/custome-js/indexedDb.js";
import { clientAuth } from '../../dashboard-assets/custome-js/Apis/Auth.js';
import { genreal,updateUIBasedOnSession, handleLogout } from "./general.js";
import { generalClient } from "../../dashboard-assets/custome-js/Apis/general.js";

(async function () {
    try {
        
        await dbController.openDataBase();
        await genreal.updateCartPill();

        
        document.getElementById('loginbtn').addEventListener('click', async function () {

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
                const result = await clientAuth.login(email, password);
                console.log(result);

                if (result === 1) {
                    toastr.success("Login successful!");
                    window.location.href = "/client/index.html";
                } else if (result === 2) {
                    toastr.error("Your account is inactive. Please contact support.");
                } else {
                    toastr.error("Incorrect password or email. Please try again.");
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




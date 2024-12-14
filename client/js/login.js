import { dbController } from "../../dashboard-assets/custome-js/indexedDb.js";
import { clientAuth } from '../../dashboard-assets/custome-js/Apis/Auth.js';
import { genreal } from "./general.js";
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

export function updateUIBasedOnSession() {
    if (clientAuth.checkSession()) {
        document.querySelectorAll(".draw-icons").forEach(element => {
            element.classList.add("d-none");
        });
        document.querySelectorAll(".user-menu").forEach(element => {
            element.classList.remove("d-none");
        });
    } else {
        document.querySelectorAll(".draw-icons").forEach(element => {
            element.classList.remove("d-none");
        });
        document.querySelectorAll(".user-menu").forEach(element => {
            element.classList.add("d-none");
        });
    }
}

export function handleLogout() {
    document.querySelectorAll('.logout').forEach(element => {
        element.addEventListener('click', function (event) {
            event.preventDefault();
            clientAuth.logout();
            window.location.href = "../client/login.html";
            updateUIBasedOnSession();
        });
    })
}





import { cart } from '../../dashboard-assets/custome-js/Apis/cart.js';
import { clientAuth } from '../../dashboard-assets/custome-js/Apis/Auth.js';

export var genreal={
    updateCartPill :async function () {

        let clientInfo=localStorage.getItem("clientSession")
         

            let usersession = JSON.parse(clientInfo);
            let cartinfo=[];
            let count=0;
            let userId = null
            
            if(usersession){

                userId = usersession.sessionData.id;
            }
           
            if(userId){

                cartinfo= await cart.getCartData(userId);

            }else{

                cartinfo=JSON.parse(localStorage.getItem("user-cart"));
                
            }
            count=0;
            if(cartinfo){
                cartinfo.products.forEach(function(p){
                    count+=p['qty'];
                })
            }
            var pill= document.getElementsByClassName("badge-pill")[0];
            if(count>99){
                pill.innerText='+99'    
            }else{

                pill.innerText=count;
            }

        
        

    }//end of updateCartPill function.
}
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


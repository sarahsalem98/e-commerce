
import { cart } from '../../dashboard-assets/custome-js/Apis/cart.js';
import { clientAuth } from '../../dashboard-assets/custome-js/Apis/Auth.js';

export var genreal={
    updateCartPill :async function () {
        let usersession = JSON.parse(localStorage.getItem("clientSession"));
        let cartinfo=[];
        let count=0;
        let userId = null
        if (usersession) {
            userId = usersession.sessionData.id;
        }
        if(userId){
            cartinfo= await cart.getCartData(userId);
        }else{
           cartinfo=JSON.parse(localStorage.getItem("user-cart"));
        }
        if(cartinfo){
            count=cartinfo.products.length;
        }
        var pill= document.getElementsByClassName("badge-pill")[0];
        pill.innerText=count;
    }
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


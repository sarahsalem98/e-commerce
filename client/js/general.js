
import { cart } from '../../dashboard-assets/custome-js/Apis/cart.js';

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


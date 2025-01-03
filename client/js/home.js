import { dbController } from "../../dashboard-assets/custome-js/indexedDb.js";
import { clientProducts } from '../../dashboard-assets/custome-js/Apis/products.js';
import { cart } from '../../dashboard-assets/custome-js/Apis/cart.js';
import { genreal,updateUIBasedOnSession, handleLogout } from "./general.js";

(async function () {
    try {
        await dbController.openDataBase();

       var  bestSellingProductsData=await clientProducts.getBestSellingProducts();

       displayBestSellingProducts(bestSellingProductsData);
       await genreal.updateCartPill();

    } catch (error) {
        console.error('Error interacting with IndexedDB:', error);
    }
})();
function displayBestSellingProducts(products) {
    const productsContainer = document.querySelector('.row.g-4.pt-5.best');
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-6 col-sm-4 col-lg-3 mb-4';

        productCard.innerHTML = `
            <div  class="box bg-white product-link">
                <div class="image-container position-relative">
                    <a href="/client/product_review.html?id=${product.id}"><img class="img-fluid img position-absolute hover-img1" src="${product.pics[0]}" alt="${product.name}">
                    <img class="img-fluid img" src="${product.pics[1]}" alt="${product.name}">
                    </a>
                    <a href="#"  id="addcartbtn"  data-product_id="${product.id}" data-product_price="${product.price}"  class="cartt-icon btn btn-light rounded-circle d-flex align-items-center justify-content-center position-absolute top-0 end-0 m-2">
                         <i class="fa-solid fa-basket-shopping"></i>
                    </a>
                </div>
                <a class="text-decoration-none product-title-link" href="/client/product_review.html?id=${product.id}"><h5 class="p-3 text1 text-black-50 ">${product.name}</h5></a> 
                <span>$${product.price}</span>
            </div>`
        productsContainer.appendChild(productCard);
    });
    document.querySelectorAll('.product-link, .product-title-link').forEach(link => {
        link.addEventListener('click', async function (event) {
             
            const cartButton = event.target.closest('#addcartbtn');
            console.log(cartButton)
            if(cartButton){

            
                event.preventDefault();
                
                    
                    let product_id = cartButton.dataset.product_id;
                    console.log("i'm the product id : ",product_id);
                    let product_price = cartButton.dataset.product_price;
                    
                    /********************************************************************* */
                    var datasession = JSON.parse(localStorage.getItem("clientSession"));
                    let user_id = null;
                    if (datasession) 
                        user_id = datasession.sessionData.id;
                    /********************************************************************** */
                    var res =0; //initial val
    
                    let userCart= await cart.getCartData(user_id); 
                     
    
                    if(userCart && userCart['products'].length!=0){
    
                        // if user has a car --- check here if the product already added or not if it dose not added add  it else 
                        //anounce user with your toser //the product already added to the cart .
    
                        
                        let isExist=userCart['products'].find(function(p){
                            if(p['product_id']==product_id)
                                return true;
                            return false;
                        })
                        
                        let isAdded=false;
                        
                        if(!isExist){
                            isAdded = await cart.addToCart(product_id, 1, user_id, product_price);
    
                            if(isAdded)
                                res=1;
                            else
                                res=3;
                        }else{
                            res=2;
                        }
    
    
                    }else {
                        //CUZ user have a cart .. so that  we will add product to car if it's not exist
                         
                        // false here represent two case: product out of stock ... add to cart faild.
    
                       let isAdded = await cart.addToCart(product_id, 1, user_id, product_price);
    
                       if(isAdded)
                            res=1;
                        else
                            res=3;
                     
                    }
                         
                    console.log('res : ',res);
    
                    if (res==1) {
                        await genreal.updateCartPill();
                        toastr.success("product added to cart successfully");
                    }else if (res==2)
                        toastr.success("product already exit in cart");
                    else if(res=3){
                        toastr.success("sorry product out of stock");
                    }else{
                        toastr.success("error happend");
                    }
                    
                }
        });
    });
}
async function updateCartPill() {
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
updateUIBasedOnSession();
handleLogout();

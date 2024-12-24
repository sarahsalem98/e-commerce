import { dbController } from "../../dashboard-assets/custome-js/indexedDb.js";
import { clientProducts } from '../../dashboard-assets/custome-js/Apis/products.js';
import { genreal,updateUIBasedOnSession, handleLogout } from './general.js';
import { cart } from '../../dashboard-assets/custome-js/Apis/cart.js';



let productsData = [];
let filteredData = [];
let currentSortOrder = '';

(async function () {
    try {
        await dbController.openDataBase();

        productsData = await clientProducts.getAllProducts();
        filteredData = [...productsData];
        const url = new URL(window.location.href);
        const category = url.searchParams.get('category');
        filterProductsByCategory( parseInt(category));
        displayProducts(filteredData);
        await genreal.updateCartPill();
        filterProductsByCategory(category)

    } catch (error) {
        console.error('Error interacting with IndexedDB:', error);
    }
})();

function displayProducts(products) {
    const productsContainer = document.querySelector('.m-4.row.products');
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-5 text-center';

        productCard.innerHTML = `
            <a href="/client/product_review.html?id=${product.id}" class="product-link position-relative">
                <img class="img-fluid position-absolute hover-img1 img" src="${product.pics[0]}" alt="${product.name}">
                <img class="img-fluid img" src="${product.pics[1]}" alt="${product.name}">
                <div id="addcartbtn" data-product_id="${product.id}" data-product_price="${product.price}" class="icon-cart btn btn-light rounded-circle position-absolute end-0 m-4">
                    <i class="fa-solid fa-basket-shopping"></i>
                </div>
            </a>
            <a href="/client/product_review.html?id=${product.id}" class="product-title-link text-decoration-none text-dark">
                <h3 class="pt-3 ps-5">${product.name}</h3>
            </a>
            <p class="ps-5">$${product.price}</p>
        `;

        productsContainer.appendChild(productCard);
    });



  
    document.querySelectorAll('.product-link, .product-title-link').forEach(link => {

        link.addEventListener('click', async function (event) {

            const cartButton = event.target.closest('#addcartbtn');

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




document.getElementById('categoryFilter').addEventListener('change', (event) => {
    const categoryValue =event.target.value;
    filterProductsByCategory(categoryValue);
});

function filterProductsByCategory(category) {
    if (category) {
        filteredData = productsData.filter(product => product.category === +category);
    } else {
        filteredData = [...productsData];
    }
    applyCurrentSort();
}

document.getElementById('sortPrice').addEventListener('change', (event) => {
    const sortValue = event.target.value;
    currentSortOrder = sortValue;
    applyCurrentSort();
});

function sortProductsByPrice(sortValue) {
    if (!filteredData.length) return;

    filteredData = [...filteredData].sort((a, b) => {
        return sortValue === 'asc' ? a.price - b.price : b.price - a.price;
    });

}

function applyCurrentSort() {
    if (currentSortOrder) {
        sortProductsByPrice(currentSortOrder);
    }

    displayProducts(filteredData);
}
// const params = new URLSearchParams(window.location.search);
// const category = params.get("category");

updateUIBasedOnSession();
handleLogout();
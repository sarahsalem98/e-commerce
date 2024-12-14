import { dbController } from "../../dashboard-assets/custome-js/indexedDb.js";
import { clientProducts } from '../../dashboard-assets/custome-js/Apis/products.js';
import { updateUIBasedOnSession, handleLogout } from './login.js';
import { cart } from '../../dashboard-assets/custome-js/Apis/cart.js';


let productsData = [];
let filteredData = [];
let currentSortOrder = '';

(async function () {
    try {
        await dbController.openDataBase();

        productsData = await clientProducts.getAllProducts();
        filteredData = [...productsData];
        displayProducts(filteredData);
       await updateCartPill();

    } catch (error) {
        console.error('Error interacting with IndexedDB:', error);
    }
})();

function displayProducts(products) {
    const productsContainer = document.querySelector('.m-4.row.products');
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-5';

        productCard.innerHTML = `
            <a href="/client/product_review.html?id=${product.id}" class="product-link position-relative" data-id="${product.id}">
                <img class="img-fluid position-absolute hover-img1" src="${product.pics[0]}" alt="${product.name}">
                <img class="img-fluid" src="${product.pics[1]}" alt="${product.name}">
                <div id="addcartbtn" data-product_id="${product.id}" data-product_price="${product.price}" class="icon-cart btn btn-light rounded-circle position-absolute end-0 m-4">
                    <i class="fa-solid fa-basket-shopping"></i>
                </div>
            </a>
            <a href="#" class="product-title-link text-decoration-none text-dark" data-id="${product.id}">
                <h3 class="pt-3 ps-5">${product.name}</h3>
            </a>
            <p class="ps-5">$${product.price}</p>
        `;

        productsContainer.appendChild(productCard);
    });

    document.querySelectorAll('.product-link, .product-title-link').forEach(link => {
        link.addEventListener('click', async function (event) {
            const cartButton = event.target.closest('#addcartbtn');
            if (cartButton) {
                event.preventDefault();
                let product_id = cartButton.dataset.product_id;
                let product_price = cartButton.dataset.product_price;
                var datasession = JSON.parse(localStorage.getItem("clientSession"));
                let user_id = null;
                if (datasession) {
                    user_id = datasession.sessionData.id;
                }
                var res = await cart.addToCart(product_id, 1, user_id, product_price);
                if (res) {
                    await updateCartPill();
                    toastr.success("products added to cart successfully");
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



document.getElementById('categoryFilter').addEventListener('change', (event) => {
    const categoryValue = parseInt(event.target.value);
    filterProductsByCategory(categoryValue);
});

function filterProductsByCategory(category) {
    if (category) {
        filteredData = productsData.filter(product => product.category === category);
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
updateUIBasedOnSession();
handleLogout();
import { dbController } from "../../dashboard-assets/custome-js/indexedDb.js";
import { clientProducts } from '../../dashboard-assets/custome-js/Apis/products.js';
import { updateUIBasedOnSession, handleLogout } from './login.js';


let productsData = [];
let filteredData = [];
let currentSortOrder = '';

(async function () {
    try {
        await dbController.openDataBase();

        productsData = await clientProducts.getAllProducts();
        filteredData = [...productsData];

        displayProducts(filteredData);

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
            <a href="#" class="product-link position-relative" data-id="${product.id}">
                <img class="img-fluid position-absolute hover-img1" src="${product.pics[0]}" alt="${product.name}">
                <img class="img-fluid" src="${product.pics[1]}" alt="${product.name}">
                <div class="icon-cart btn btn-light rounded-circle position-absolute end-0 m-3">
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
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const productId = this.getAttribute('data-id');
            console.log(productId)
            return productId;
        });
    });
}

document.getElementById('categoryFilter').addEventListener('change', (event) => {
    const categoryValue = event.target.value;
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
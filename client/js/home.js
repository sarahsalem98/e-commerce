import { dbController } from "../../dashboard-assets/custome-js/indexedDb.js";
import { clientProducts } from '../../dashboard-assets/custome-js/Apis/products.js';
//import { updateUIBasedOnSession, handleLogout } from './login.js';


(async function () {
    try {
        await dbController.openDataBase();

       var  bestSellingProductsData=await clientProducts.getBestSellingProducts();
        console.log(bestSellingProductsData)

       displayBestSellingProducts(bestSellingProductsData);

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
            // <div class="box bg-white">
            //     <div class="image-container position-relative" data-id="${product.id}">
            //         <a href="#"><img class="img-fluid hover10"  onmouseover="this.src='${product.pics[1]}'"  src="${product.pics[0]}" alt="${product.name}"></a>
            //         <a href="#" class="cart-icon btn btn-light rounded-circle d-flex align-items-center justify-content-center position-absolute top-0 end-0 m-2">
            //             <i class="fas fa-shopping-cart"></i>
            //         </a>
            //     </div>
            //     <a class="text-decoration-none" href="#" data-id="${product.id}"><h5 class="p-3 text1 text-black-50 ">${product.name}</h5></a> 
            //     <span>$${product.price}</span>
            // </div>`
            productCard.innerHTML = `
        <div class="box bg-white">
            <div class="image-container position-relative" data-id="${product.id}">
                <a href="#">
                    <img 
                        class="img-fluid hover10"  
                        src="${product.pics[0]}" 
                        alt="${product.name}" 
                        onmouseover="this.src='${product.pics[1]}'" 
                        onmouseout="this.src='${product.pics[0]}'">
                </a>
                <a href="#" class="cart-icon btn btn-light rounded-circle d-flex align-items-center justify-content-center position-absolute top-0 end-0 m-2">
                    <i class="fas fa-shopping-cart"></i>
                </a>
            </div>
            <a class="text-decoration-none" href="#" data-id="${product.id}">
                <h5 class="p-3 text1 text-black-50">${product.name}</h5>
            </a> 
            <span>$${product.price}</span>
        </div>
    `;

        productsContainer.appendChild(productCard);
    });
}
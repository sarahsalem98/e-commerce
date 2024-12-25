import { cart } from "../../dashboard-assets/custome-js/Apis/cart.js";
import { dbController } from "../../dashboard-assets/custome-js/indexedDb.js"
import { genreal,updateUIBasedOnSession, handleLogout } from "./general.js";





(async function () {
    try {
 
        let globals = {
            cart: null,
            products: [],
            productsDetailsT: null,
            productsSummaryT: null,
        }
    
        function showEmptyCarSlider() {
            document.querySelector('.empty-car-slider').classList.remove('d-none');
        }

        function showUpdatedCartSlider() {
            document.querySelector('.update-cart-slider').classList.remove('d-none');
        }



        // Open the database
        await dbController.openDataBase();
        var sessiondata = JSON.parse(localStorage.getItem("clientSession"));

        let userId = null;

        if (sessiondata) {
            userId = sessiondata.sessionData.id;
        }

        
        globals.cart = await cart.getCartData(userId);
        console.log("from cart.js",globals.cart);

        globals.products = await cart.getCartProducts(globals.cart);

        const tables = document.querySelector(".cart-section .cart-tables");
        await genreal.updateCartPill();

        



        globals.productsDetailsT = tables.children[0];

        globals.productsSummaryT = tables.children[1];

        let subtotal = null, total = null, shipping_fees = null;
        let subTotalVal = 0, shipping_fees_val = 50;

        subtotal = globals.productsSummaryT.querySelector(".sub-total");
        total = globals.productsSummaryT.querySelector(".Total");
        shipping_fees = globals.productsSummaryT.querySelector(".shipping-fees");



        /*****************************************************************/
        function addProductRow(p, requiredQuantity) {

            var row = document.createElement("tr");

            var createdtd = document.createElement("td");

            var createdAnchor = document.createElement("a");
            createdAnchor.href = "";
            createdAnchor.addEventListener("click", async function () {
                await cart.addToCart(p['id'], 0, userId, p['price']);
                location.reload(true);
            })//end of registration  

            createdAnchor.setAttribute("class", "delete-icon");
            createdAnchor.innerHTML = "<i class='fa-regular fa-circle-xmark ' font-mon'></i>";

            createdtd.appendChild(createdAnchor); //add delete
            row.appendChild(createdtd) // add first td to row 

            //second td
            createdtd = document.createElement("td");
            createdAnchor = document.createElement("a");
            createdAnchor.href = "";
            createdAnchor.addEventListener("click", function (e) {
                sendProductId(p['id']);
                e.preventDefault();
            })//end of click event

            let createdImage = document.createElement("img");
            createdImage.src = p['pics'][0];
            createdImage.setAttribute("width", "70");
            createdImage.setAttribute("height", "70");


            createdAnchor.appendChild(createdImage);
            createdAnchor.href = ""
            createdtd.appendChild(createdAnchor);
            row.appendChild(createdtd)

            //third td 
            createdtd = document.createElement("td");
            createdAnchor = document.createElement("a");
            createdAnchor.innerText = p['name'];
            createdAnchor.href = "";

            createdAnchor.addEventListener("click", function (e) {
                sendProductId(p['id']);
                e.preventDefault();
            })//end of click event


            createdtd.appendChild(createdAnchor);
            row.appendChild(createdtd);

            //fourth td
            createdtd = document.createElement("td");
            createdtd.innerText = "$" + p['price'];
            row.appendChild(createdtd);

            //fifth one
            createdtd = document.createElement("td");

            let createdDiv = document.createElement("div");
            createdDiv.setAttribute("class", "d-flex controler"); //div


            let createdInputFiled = document.createElement("input");
            createdInputFiled.setAttribute("type", "text");
            createdInputFiled.setAttribute("value", requiredQuantity);

            createdInputFiled.addEventListener("keydown", async function (e) {
                const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'];


                if (allowedKeys.includes(e.key)) {
                    return;
                }


                if ((e.key >= '0' && e.key <= '9') && Number(this.value + e.key) <= p['qty']) {
                    e.preventDefault();  // i'm preventing browser from updating current input i'll do with jop.

                    this.value = this.value + e.key;

                    await cart.addToCart(p['id'], this.value, userId, p['price']);
                    showUpdatedCartSlider();
                    globals.cart = await cart.getCartData(userId);
                    globals.products = await cart.getCartProducts(globals.cart);
                    genreal.updateCartPill();

                } else {
                    // Prevent invalid input
                    e.preventDefault();
                }
            });
            //end of input quantity field 


            createdInputFiled.addEventListener('blur', async function () {
                if (Number(this.value) == 0) {
                    await cart.addToCart(p['id'], 0, userId, p['price']);
                    this.value = 0;
                    showUpdatedCartSlider();
                    globals.cart = await cart.getCartData(userId);
                    globals.products = await cart.getCartProducts(globals.cart);
                    genreal.updateCartPill();

                }
            })//end of blure



            //decrement btn
            let createdDecInput = document.createElement("input");
            createdDecInput.setAttribute("type", 'button');
            createdDecInput.setAttribute("value", "-");

            createdDecInput.addEventListener("click", async function () {

                var newVal = Number(createdInputFiled.value) - 1;
                if (newVal >= 0) {

                    console.log("new val", newVal)
                    createdInputFiled.value = newVal.toString();
                    await cart.addToCart(p['id'], newVal, userId, p['price']);
                    /*************************************** */
                    ///update subtotal
                    createdSpnaSubtotal.innerText = (Number(createdSpnaSubtotal.innerText) - p['price']).toFixed(2)
                    updatedSummaryTable(-1 * p['price'])

                    showUpdatedCartSlider();

                    globals.cart = await cart.getCartData(userId);
                    globals.products = await cart.getCartProducts(globals.cart);
                    genreal.updateCartPill();

                    if(newVal==0)
                        window.location.reload(true);

                }


            })//end of decrement

            //increment btn
            let createdIncInput = document.createElement("input");
            createdIncInput.setAttribute("type", 'button');
            createdIncInput.setAttribute("value", "+");

            createdIncInput.addEventListener("click", async function () {

                var newVal = Number(createdInputFiled.value) + 1;

                if (newVal <= p['qty']) {
                    console.log("new val", newVal)
                    createdInputFiled.value = newVal;

                    await cart.addToCart(p['id'], newVal, userId, p['price']);
                    /*************************************** */
                    ///update subtotal
                    createdSpnaSubtotal.innerText = (Number(createdSpnaSubtotal.innerText) + p['price']).toFixed(2);
                    updatedSummaryTable(p['price'])
                    showUpdatedCartSlider();
                    globals.cart = await cart.getCartData(userId);
                    globals.products = await cart.getCartProducts(globals.cart);
                    genreal.updateCartPill();

                }
   
            })//end of increment 

            createdDiv.appendChild(createdDecInput);
            createdDiv.appendChild(createdInputFiled);
            createdDiv.appendChild(createdIncInput);
            createdtd.appendChild(createdDiv);
            row.appendChild(createdtd);




            createdtd = document.createElement("td");
            createdtd.innerText = "$";
            let createdSpnaSubtotal = document.createElement("span")
            createdSpnaSubtotal.innerText = (requiredQuantity * p['price']).toFixed(2);
            createdtd.appendChild(createdSpnaSubtotal)
            row.appendChild(createdtd)


            globals.productsDetailsT.appendChild(row);
        }




        if (globals.cart && globals.products.length!=0) {
            globals.products.forEach(function (p, index) {
                addProductRow(globals.products[index], globals.cart['products'][index]['qty']);
                subTotalVal += (globals.products[index]['price']) * globals.cart['products'][index]['qty'];
            })

            total.innerText = shipping_fees_val;
            updatedSummaryTable(subTotalVal);
        } else {
            globals.productsDetailsT.classList.add('d-none');
            globals.productsSummaryT.classList.add('d-none')
            showEmptyCarSlider();
        }

        /******************************************************************* */

        function updatedSummaryTable(subVal) {
            subtotal.innerText = (Number(subtotal.innerText) + subVal).toFixed(2);
            total.innerText = (Number(total.innerText) + subVal).toFixed(2);
            shipping_fees.innerText = shipping_fees_val;
        }


        /*********************************************************** */
        function sendProductId(product_id) {
       
            const encodedData = encodeURIComponent(product_id); // URL-safe encoding
            
            window.location.href = `product_review.html?id=${encodedData}`;
        }
        //preceeding to the next page handling

        function nextPageListener(e) {

            if (globals.products==null ||  globals.products.length==0)
                e.preventDefault();
            else
                window.location.href = "./cart1.html";

        }

        globals.productsSummaryT.querySelector("input[type='button']").addEventListener('click', nextPageListener);

        //cart page two registration
        document.querySelector(".prgressive-bar .two").addEventListener('click', nextPageListener)//end of third page registration

        updateUIBasedOnSession();
        handleLogout();

    } catch (error) {
        console.error('Error interacting with IndexedDB:', error);
    }

})();

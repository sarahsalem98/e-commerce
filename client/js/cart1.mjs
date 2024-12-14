import { dbController } from "../../dashboard-assets/custome-js/indexedDb.js"
import { cart } from "../../dashboard-assets/custome-js/Apis/cart.js";
import { order } from "../../dashboard-assets/custome-js/Apis/orders.js";
import { genreal } from "./general.js";

(async function () {
    try {




        debugger;

        // Open the database
        await dbController.openDataBase();
        genreal.updateCartPill();
        /*************************************************************** */
        var sessiondata = JSON.parse(localStorage.getItem("clientSession"));
        let userId = null;
        if (sessiondata) {
            userId = sessiondata.sessionData.id;
        }
        /*************************************************************** */

        let globals = {
            cart: null,
            products: [],
            orderSummaryTable: null,
            subtotal: 0,

            shippingFeees: 50

        }


        globals.cart = await cart.getCartData(userId);

        globals.products = await cart.getCartProducts(globals.cart);

        globals.orderSummaryTable = document.querySelector('.order-summary-section');

        function addRow(p, requiredQuantity) {

            let row = document.createElement("tr");

            let createdTd = document.createElement("td");

            createdTd.setAttribute("class", "d-flex flex-nowrap p-3");

            let createdDiv = document.createElement("div");

            let createdImage = document.createElement("img");

            createdImage.setAttribute("width", "50");
            createdImage.setAttribute("height", "50");
            createdImage.src = p['pics'][0];

            let createdSpan = document.createElement('span');
            createdSpan.innerHTML = "&nbsp;" + p['name'];

            createdDiv.appendChild(createdImage);
            createdDiv.appendChild(createdSpan);
            createdTd.appendChild(createdDiv);

            createdSpan = document.createElement('span');

            createdSpan.setAttribute("class", "product-quatitiy");
            createdSpan.style.lineHeight = "2.9em";


            createdSpan.innerHTML = "&nbsp;x&nbsp;" + requiredQuantity;

            createdTd.appendChild(createdSpan);

            row.appendChild(createdTd);


            createdTd = document.createElement("td");
            createdTd.setAttribute("class", "p-3");
            createdTd.style.lineHeight = "2.9em";
            createdTd.innerHTML = "$&nbsp;" + (p['price'] * requiredQuantity).toFixed(2);

            row.appendChild(createdTd);

            globals.orderSummaryTable.querySelector("thead").appendChild(row);

        }


        globals.products.forEach(function (p, index) {
            globals.subtotal += p['price'] * globals.cart['products'][index]["qty"];
            addRow(p, globals.cart['products'][index]["qty"])

        })

        if (globals.cart) {
            let footer = globals.orderSummaryTable.querySelector("tfoot");
            footer.children[0].children[1].innerHTML = "$&nbsp;" + globals.subtotal.toFixed(2);
            footer.children[1].children[1].innerHTML = "$&nbsp;" + globals.shippingFeees;
            let total = (globals.subtotal + globals.shippingFeees).toFixed(2);
            footer.children[2].children[1].innerHTML = "$&nbsp;" + total
            document.querySelector(".checout_btn").innerText = "Place ORDER $ " + total;
        }


        /************************************************************** */
        let isValidEmail = false, isValidFname = false, isValidLname = false, isValidPhone_1 = false, isValidPhone_2 = false
            , isValidZipcode = false, isValidAddress = false, isChecked = false;
        let emaliVal, fnameVal, lnameVal, phoneVal_1 = "0", phoneVal_2 = "0", zipcodeVal, addressVal, countryVal, sexVal;
        const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");
        const nameRegex = new RegExp("^[A-Za-z]{3,10}$");
        const phoneRegex = new RegExp("([010][011][012][\\d]{8})");
        const zipCode = new RegExp("^\\d{5}$");
        const addressRegex = new RegExp("^\\d{1,5}\\s[A-Za-z\\s-]{10,30}$");
        /************************************************************* */


        ///email validation
        document.querySelector(".customer-info input[type='email']").addEventListener('keyup', function () {


            if (this.value.trim().length == 0 || !emailRegex.test(this.value.trim())) {

                document.querySelector(".customer-info label[for='email']").style.color = 'red';
                isValidEmail = false;
            }
            else {
                document.querySelector(".customer-info label[for='email']").style.color = 'black';
                isValidEmail = true;
                emaliVal = this.value;
            }
        })
        //firstname validation

        document.querySelector("._fname input[type='text']").addEventListener('keyup', function () {
            if (this.value.trim().length == 0 || !nameRegex.test(this.value.trim())) {

                document.querySelector("._fname label[for='fname']").style.color = "red"
                isValidFname = false;

            }
            else {
                document.querySelector("._fname label[for='fname']").style.color = "black";
                isValidFname = true;
                fnameVal = this.value;
            }

        }) //end of first name

        //last name
        document.querySelector("._Lname input[type='text']").addEventListener('keyup', function () {

            if (this.value.trim().length == 0 || !nameRegex.test(this.value.trim())) {

                document.querySelector("._Lname label[for='lname']").style.color = "red"
                isValidZipcode = false;
            }
            else {
                document.querySelector("._Lname label[for='lname']").style.color = "black";
                isValidLname = true;
                lnameVal = this.value;
            }
        }) //end of first name

        //phone1 validation
        document.querySelector("._phone1 input[type='text']").addEventListener('keyup', function () {

            if (this.value.trim().length == 0 || !phoneRegex.test(this.value.trim())) {

                document.querySelector("._phone1 label").style.color = "red";
                isValidPhone_1 = false;
            }
            else {
                document.querySelector("._phone1 label").style.color = "black";
                isValidPhone_1 = true;
                phoneVal_1 = this.value;
            }
        })//end of phone

        //phone2 validation
        document.querySelector("._phone2 input[type='text']").addEventListener('keyup', function () {

            if (this.value.trim().length == 0 || !phoneRegex.test(this.value.trim())) {

                document.querySelector("._phone2 label").style.color = "red";
                isValidPhone_2 = false;
            }
            else {
                document.querySelector("._phone2 label").style.color = "black";
                isValidPhone_2 = true;
                phoneVal_2 = this.value;
            }
        })//end of phone

        //zipcode
        document.querySelector("._zipcode input[type='text']").addEventListener('keyup', function () {

            if (this.value.trim().length == 0 || !zipCode.test(this.value.trim())) {

                document.querySelector("._zipcode label ").style.color = "red"
                isValidZipcode = false;
            }
            else {
                document.querySelector("._zipcode label").style.color = "black";
                isValidZipcode = true;
                zipcodeVal = this.value;
            }
        })


        //addressValidation
        document.querySelector("._address input[type='text']").addEventListener('keyup', function () {
            if (this.value.trim().length == 0 || !addressRegex.test(this.value.trim())) {

                document.querySelector("._address label").style.color = "red"
                isValidAddress = false;
            }
            else {
                document.querySelector("._address label").style.color = "black";
                isValidAddress = true;
                addressVal = this.value;
            }
        })//end of address validation

        //is on cash ckecked or not
        document.querySelector("#cash_payment").addEventListener('change', function () {
            isChecked = !isChecked;
        })




        document.querySelector(".checout_btn").addEventListener('click', async function () {

            console.log(isValidEmail, isValidFname, isValidLname, isValidPhone_1, isValidPhone_2, isValidAddress)

            if (isValidFname && isValidLname && isValidZipcode && isValidPhone_1 && isValidPhone_2 & isChecked) {
                console.log("hello");

                let regionVal = document.querySelector('#countries').value;
                let commentArea = document.querySelector('.addationale_info textarea').value;
                let order_id = await order.makeOrder(userId, emaliVal, fnameVal, lnameVal, regionVal, addressVal, phoneVal_1, phoneVal_2, commentArea);
                if (order_id) {
                    const encoded_order_id = encodeURIComponent(order_id);

                    toastr.success("the order is completed successfully");
                    window.location.href = `cart2.html?id=${encoded_order_id}`;
                } else {
                    toastr.error("something went wrong please try again later");
                }

            }
            else {

                document.querySelector('.missing-form-data-section').classList.remove('d-none');
                window.scrollTo(0, 0);

            }
        })




    } catch (error) {
        console.error('Error interacting with IndexedDB:', error);
    }

})();




window.addEventListener("load", function () {




    // for drop down
    $('.search_select_box select').selectpicker();



    var AllFileds = this.document.getElementsByClassName("filed");

    var AllLabels = this.document.querySelectorAll(".wrapper>label");


    for (var i = 0; i < AllFileds.length; ++i) {

        (function (m) {
            AllFileds[m].addEventListener("keyup", function (e) {

                if (this.value.length) {

                    AllLabels[m].classList.remove("apperance-status-label_toggle");
                    this.classList.add("apperance-status-input");
                } else {
                    AllLabels[m].classList.add("apperance-status-label_toggle");
                    this.classList.remove("apperance-status-input");
                }

            })//end of keyup
        })(i)


    }
    this.document.querySelector(".payment_section>ul>li input").addEventListener("change", function () {
        console.log("wellcom")
        document.querySelector(".payment_section>ul>li p").classList.toggle("payment_details_toggle");

    })



})//end of load window





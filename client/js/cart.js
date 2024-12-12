import { cart } from "../../dashboard-assets/custome-js/Apis/cart.js";
import { dbController } from "../../dashboard-assets/custome-js/indexedDb.js"
 




(async function () {
    try {

        let globals={
            cart:null,
            products:[],
            productsDetailsT:null,
            productsSummaryT:null,
        }
         

        function sendProductId(product_ID) {
            const encodedData = encodeURIComponent(product_ID); // URL-safe encoding
            window.location.href = `../client/product_review.html?id=${encodedData}`;
        }
        
        function showEmptyCarSlider(){
            document.querySelector('.empty-car-slider').classList.remove('d-none');
        }

        function showUpdatedCartSlider(){
            document.querySelector('.update-cart-slider').classList.remove('d-none');
        }
         


        // Open the database
        await dbController.openDataBase();
         

       

        sessionStorage.setItem('userId', '1');
        const userId=sessionStorage.getItem('userId');


        globals.cart=await cart.getCartData(userId);

        console.log(globals.cart)
        
        globals.products=await cart.getCartProducts(globals.cart);
        
        const tables=document.querySelector(".cart-section .cart-tables");

        globals.productsDetailsT=tables.children[0];

        globals.productsSummaryT=tables.children[1];

        let subtotal=null , total=null , shipping_fees=null; 
        let subTotalVal=0 , shipping_fees_val=50;

        subtotal = globals.productsSummaryT.querySelector(".sub-total");
        total = globals.productsSummaryT.querySelector(".Total");
        shipping_fees=globals.productsSummaryT.querySelector(".shipping-fees");

        console.log(subtotal , total)

        /*****************************************************************/
        function addProductRow(p,requiredQuantity){

            var row=document.createElement("tr");
            
            var createdtd=document.createElement("td");

            var createdAnchor=document.createElement("a");
            createdAnchor.href="";
            createdAnchor.addEventListener("click",async function(){
                cart.addToCart(p['id'],0,userId,p['price']);
                location.reload(true);
            })//end of registration  

            createdAnchor.setAttribute("class","delete-icon");
            createdAnchor.innerHTML="<i class='fa-regular fa-circle-xmark ' font-mon'></i>";

            createdtd.appendChild(createdAnchor); //add delete
            row.appendChild(createdtd) // add first td to row 

            //second td
            createdtd=document.createElement("td");
            createdAnchor=document.createElement("a");
            createdAnchor.href="";
            createdAnchor.addEventListener("click",function(e){
                sendProductId(p['id']);
                e.preventDefault();
            })//end of click event
            
            let createdImage=document.createElement("img");
            createdImage.src=p['pics'][0];
            createdImage.setAttribute("width","75");
            createdImage.setAttribute("height","75");
            

            createdAnchor.appendChild(createdImage);
            createdAnchor.href=""
            createdtd.appendChild(createdAnchor);
            row.appendChild(createdtd)

            //third td 
            createdtd=document.createElement("td");
            createdAnchor=document.createElement("a");
            createdAnchor.innerText=p['name'];
            createdAnchor.href="";
            
            createdAnchor.addEventListener("click",function(e){
                sendProductId(p['id']);
                e.preventDefault();
            })//end of click event

            
            createdtd.appendChild(createdAnchor);
            row.appendChild(createdtd);

            //fourth td
            createdtd=document.createElement("td");
            createdtd.innerText="$"+p['price'];
            row.appendChild(createdtd);

            //fifth one
            createdtd=document.createElement("td");
            
            let createdDiv=document.createElement("div");
            createdDiv.setAttribute("class","d-flex controler"); //div


            let createdInputFiled=document.createElement("input");
            createdInputFiled.setAttribute("type","text");
            createdInputFiled.setAttribute("value",requiredQuantity);

            createdInputFiled.addEventListener("keydown",async function(e){

                const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'];  

                    if(!allowedKeys.includes(e.key)){
                        if(!( ( e.key >= '0'&&e.key <= '9') && Number(this.value + e.key) <= p['qty'] ) ){
                            e.preventDefault();
                            return;
                        } 
                        else{
                            cart.addToCart(p['id'],(this.value + e.key),userId,p['price']);
                            this.value=this.value+e.key;
                            debugger;
                            showUpdatedCartSlider();
                        }
                    }

                        
                  
                

            })//end of input quantity field 

 
            createdInputFiled.addEventListener('blur',function(){
                if(Number(this.value)==0){
                    cart.addToCart(p['id'], 0 ,userId,p['price']);
                    this.value=0;
                    showUpdatedCartSlider();
                }
            })//end of blure



            //decrement btn
            let createdDecInput=document.createElement("input");
            createdDecInput.setAttribute("type",'button');
            createdDecInput.setAttribute("value","-");

            createdDecInput.addEventListener("click",async function(){

                var newVal= Number(createdInputFiled.value)-1;
                if(newVal>=0){
                    createdInputFiled.value=newVal.toString();
                    cart.addToCart(p['id'],newVal,userId,p['price']);
                    /*************************************** */
                    ///update subtotal
                    createdSpnaSubtotal.innerText=( Number(createdSpnaSubtotal.innerText)-p['price']).toFixed(2)
                    updatedSummaryTable(-1*p['price'])
                    showUpdatedCartSlider();
                }


              })//end of decrement

              //increment btn
              let createdIncInput=document.createElement("input");
              createdIncInput.setAttribute("type",'button');
              createdIncInput.setAttribute("value","+");
  
              createdIncInput.addEventListener("click",async function(){

                var newVal= Number(createdInputFiled.value)+1;

                if(newVal<=p['qty']){
                    createdInputFiled.value=newVal.toString();
                    cart.addToCart(p['id'],newVal,userId,p['price']);
                    /*************************************** */
                    ///update subtotal
                    createdSpnaSubtotal.innerText=(Number(createdSpnaSubtotal.innerText)+p['price']).toFixed(2); 
                    updatedSummaryTable(p['price'])
                    showUpdatedCartSlider();
                }
              })//end of increment 

              createdDiv.appendChild(createdDecInput);
              createdDiv.appendChild(createdInputFiled);
              createdDiv.appendChild(createdIncInput);
              createdtd.appendChild(createdDiv);
              row.appendChild(createdtd);




            createdtd=document.createElement("td");
            createdtd.innerText="$";
            let createdSpnaSubtotal=document.createElement("span")
            createdSpnaSubtotal.innerText=(requiredQuantity*p['price']).toFixed(2);
            createdtd.appendChild(createdSpnaSubtotal)
            row.appendChild(createdtd)
            

            globals.productsDetailsT.appendChild(row);
        }


     
        
        if(globals.cart && globals.products){
            globals.products.forEach(function(p,index){

                addProductRow(globals.products[index],globals.cart['products'][index]['qty']);
                subTotalVal+=(globals.products[index]['price'])*globals.cart['products'][index]['qty'];
            })

            total.innerText=shipping_fees_val;
            updatedSummaryTable(subTotalVal);
        }else{
            globals.productsDetailsT.classList.add('d-none');
            globals.productsSummaryT.classList.add('d-none')
            showEmptyCarSlider();
        }
            
        /******************************************************************* */
        
        function updatedSummaryTable(subVal){
            subtotal.innerText=(Number(subtotal.innerText)+subVal).toFixed(2) ;
            total.innerText= (Number(total.innerText)+subVal).toFixed(2);
            shipping_fees.innerText=shipping_fees_val;
        }

        globals.productsSummaryT.querySelector("input[type='button']").addEventListener('click',function(){
            window.location.href="./cart1.html"
        });
       

         
        //cart page two registration
        document.querySelector(".prgressive-bar .two").addEventListener('click',function(e){
                 if(!globals.products)
                    e.preventDefault();
        })//end of third page registration

    } catch (error) {
        console.error('Error interacting with IndexedDB:', error);
    }

})();
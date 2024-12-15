import { dbController } from "../../dashboard-assets/custome-js/indexedDb.js"
import { products } from "../../dashboard-assets/custome-js/products.js";
import { order } from "../../dashboard-assets/custome-js/Apis/orders.js";

(async function () {
    try {
        // Open the database
        await dbController.openDataBase();

        // const params = new URLSearchParams(window.location.search);
        // const order_id  = params.get("id");
        /***************************************************************** */
        const order_id =2;
        let subTotalVal=0 ;
        const shippingFees=50;

        
        /***************************************************************** */

        let orderDeatails=await order.getOrderData(order_id );

        console.log(orderDeatails)
        /*********************************************** */
        //pill nav


        //order number
        document.querySelector('.order-number').innerText=order_id;

        //data
        document.querySelector('.order-date').innerText= formatDate(orderDeatails['updated_at']);


        const bodOftheTable=document.querySelector("tbody")

         

        orderDeatails['products'].__proto__=[].__proto__;
        

        let length=Object.keys( orderDeatails['products']).length;

        orderDeatails['products'].forEach(async function(element,index) {
            
            let productData=await products.getProductData(element['product_id']);

            subTotalVal+=(productData['price']*element['qty']);

            console.log(subTotalVal);
             
            addRow(productData['name'],element['qty'],productData['price']);  
            
             if(index==length-1)
                updateTotals(subTotalVal);
        });

        document.querySelector('.title+address').innerHTML=`${orderDeatails['first_name']}&nbsp;${orderDeatails['second_name']}<br/>
                                                            ${orderDeatails['gov']}<br/>
                                                            ${orderDeatails['address']}<br/>
                                                            <span><i class="fa-solid fa-phone me-1 text-secondary"></i>${orderDeatails['phone_num1']}</span><br>
                                                            <span><i class="fa-solid fa-phone me-1 text-secondary"></i>${orderDeatails['phone_num1']}</span><br>
                                                            <span><i class="fa-regular fa-envelope me-1"></i>${orderDeatails['email']}</span><br>`

          

       
         
        
        

        function updateTotals(subTotalVal){

            subTotalVal=subTotalVal.toFixed(2);

            document.querySelector('.order-total').innerHTML='$&nbsp;'+subTotalVal;
            document.querySelector('.subtotal').innerHTML='$&nbsp;'+subTotalVal;
            document.querySelector('.total').innerHTML='$&nbsp;'+ Number(subTotalVal+shippingFees).toFixed(2) ;

        }
        function addRow(product_name,quantitiy,price){  
            let row=document.createElement('tr');
            
            let createdTd=document.createElement('td');
            createdTd.innerText=product_name;
            
            let createdStrong=document.createElement('strong');
            createdStrong.innerHTML='&nbspx '+quantitiy;

            createdTd.appendChild(createdStrong);

            row.appendChild(createdTd);

            createdTd=document.createElement('td');
            createdTd.innerHTML='$&nbsp;'+price;

            row.appendChild(createdTd);

            bodOftheTable.appendChild(row);


        }//end od add row function


    } catch (error) {
        console.error('Error interacting with IndexedDB:', error);
    }

})();


function formatDate(dateString) {
     
    const date = new Date(dateString);

    // our mapper for months as a literal objec
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

     
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
 
  
    return `${month} ${day}, ${year}`;
}





//  import {order} from'../../dashboard-assets/custome-js/Apis/orders.js'
//  export var orderhistory={
//      getUserOrdersHistory:async function(){
//            ]
               
        
//           await order.getUserOrdersHistory();

//       },
//       showorderData:async function(  ){
//        var id= JSON.parse(localStorage.getItem("clientSession")).sessionData.id;




//         console.log( (await order.getUserOrdersHistory(1)).length);
      
//        }
//     }

import { order } from '../../dashboard-assets/custome-js/Apis/orders.js'

export const orderhistory = {
    getUserOrdersHistory: async function() {
        try {
            const clientSession = JSON.parse(localStorage.getItem("clientSession"));
            if (!clientSession || !clientSession.sessionData || !clientSession.sessionData.id) {
                throw new Error("Please log in to view your orders");
            }

            const userId = clientSession.sessionData.id;
            const orders = await order.getUserOrdersHistory(userId);
            this.showorderData(orders);
        } catch (error) {
            console.error("Error fetching order history:", error);
            const noOrdersElement = document.querySelector("#no-orders");
            noOrdersElement.textContent = error.message || "Error loading orders";
            noOrdersElement.classList.remove("d-none");
        }
    },
      
    getStatusClass: function(status) {
        switch(status.toLowerCase()) {
            case 'pending':
                return 'status-pending';
            case 'shipped':
                return 'status-shipped';
            case 'delivered':
                return 'status-delivered';
            default:
                return '';
        }
    },
    
    showorderData: async function(orders){
        const tableBody = document.querySelector("#orderTable tbody");
        const Message = document.querySelector("#no-orders");
        
        if (!tableBody) {
            console.error("Table body not found");
            return;
        }

     
        tableBody.innerHTML = "";

        if (!orders || orders.length === 0) {
              Message.classList.remove("d-none");
            return;
        }

        Message.classList.add("d-none");

   
        orders.forEach((orderItem) => {
            const row = document.createElement("tr");
            
       
            const orderDate = new Date(orderItem.orderDate).toLocaleDateString();
            const statusClass = this.getStatusClass(orderItem.status);
            
            row.innerHTML = `
                <td>${orderItem.orderId}</td>
                <td>${orderDate}</td>
                <td>
                    <ul class="product-list">
                        ${orderItem.products.map(product => `
                            <li>
                                ${product.name}
                                <br>Quantity: ${product.quantity}
                                <br>Price: $${product.price.toFixed(2)}
                            </li>
                        `).join('')}
                    </ul>
                </td>
                <td>$${orderItem.totalAmount.toFixed(2)}</td>
                <td><span class="order-status ${statusClass}">${orderItem.status}</span></td>
            `;
            
            tableBody.appendChild(row);
        });
    }
}


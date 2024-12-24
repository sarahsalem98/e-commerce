
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
import { dbController } from '../../dashboard-assets/custome-js/indexedDb.js';
import { order } from '../../dashboard-assets/custome-js/Apis/orders.js';

export var orderHistory = {

    showOrderData: async function () {
        var sessionData = JSON.parse(localStorage.getItem('clientSession'));
        var userId = sessionData ? sessionData.sessionData.id : null;

        if (!userId) {
            console.error("User not logged in");
            return;
        }

        var orders = await this.getUserOrdersHistory(userId);
        var tableBody = document.querySelector('#myorder');
        var message = document.querySelector('#no-orders');

        if (!tableBody) {
            console.error("Table body not found");
            return;
        }

 
        tableBody.innerHTML = "";

    
        if (!orders || orders.length === 0) {
            message.classList.remove("d-none");
            return;
        }

        message.classList.add("d-none");

       
        orders.forEach(order => {
            var row = document.createElement('tr');
            row.innerHTML = `
                <td></td>
                <td>${order.order_id}</td>
                <td>${new Date(order.created_at).toLocaleDateString()}</td>
                <td>${this.getStatusText(order.status)}</td>
                <td>${order.products.length}</td> <!-- Display the number of products -->
                <td class="actions">
                    <div class="dropdown">
                        <button class="dropdown-toggle" onclick="toggleMenu(event)">&#8942;</button>
                        <div class="dropdown-menu d-none">
                            <a href="#" onclick="showDetails(event, '${order.order_id}')">&#128196; Details</a>
                            <a href="#" onclick="cancelOrder(event, '${order.order_id}')">&#10060; Cancel</a>
                        </div>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    },

 
    getUserOrdersHistory: async function (userId) {
        var orders = await dbController.getItemsByUniqueKey('orders', 'user_id', userId);
        let returned_data = [];

        if (orders.length != 0) {
            let cartPromises = orders.map(async (order) => {
                let cartData = await dbController.getItem('carts', order.cart_id);

                return {
                    order_id: order.id,
                    created_at: order.created_at,
                    status: order.status,
                    products: cartData ? cartData.products : []
                };
            });

            returned_data = await Promise.all(cartPromises);
        }

        console.log(returned_data);
        return returned_data;
    },

  
    getStatusText: function (statusCode) {
        const statusMap = {
            1: 'Order Placed',
            2: 'Preparing',
            3: 'Completed',
            4: 'Delivered',
            5: 'Cancelled'
        };
        return statusMap[statusCode] || 'Unknown';
    }
};

window.addEventListener('load', async function () {
    await dbController.openDataBase();
    await orderHistory.showOrderData();
});


window.toggleMenu = function (event) {
    const dropdown = event.target.nextElementSibling;

    
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        if (menu !== dropdown) {
            menu.classList.add('d-none');
        }
    });

  
    dropdown.classList.toggle('d-none');
};


document.addEventListener('click', function (event) {
    const isDropdown = event.target.closest('.dropdown');
    if (!isDropdown) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.add('d-none');
        });
    }
});


window.showDetails = async function (event, orderId) {
    event.preventDefault();
    console.log(`Show details for order: ${orderId}`);

  
    var orderDetails = await orderHistory.getUserOrdersHistory(JSON.parse(localStorage.getItem('clientSession')).sessionData.id);
    var order = orderDetails.find(o => o.order_id === orderId);
    
    if (order) {
    
        var detailsBody = document.querySelector('#detailsBody');
        var detailsTable = document.querySelector('#detailsTable');
        
       
        detailsBody.innerHTML = "";

     
        if (order.products.length > 0) {
            order.products.forEach(product => {
                var row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.product_id}</td>
                    <td>${product.quantity}</td>
                    <td>${product.price}</td>
                `;
                detailsBody.appendChild(row);
            });

           
            detailsTable.classList.remove('d-none');
        } else {
            console.log("No products found in this order.");
        }
    }
};


window.cancelOrder = function (event, orderId) {
    event.preventDefault();
    console.log(`Cancel order: ${orderId}`);
};

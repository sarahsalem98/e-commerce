
import { dbController } from '../../dashboard-assets/custome-js/indexedDb.js';
import { order as orderApi } from '../../dashboard-assets/custome-js/Apis/orders.js';
import { genreal, updateUIBasedOnSession, handleLogout } from './general.js';
export var orderHistory = {
    showOrderData: async function () {
        var sessionData = JSON.parse(localStorage.getItem('clientSession'));
        var userId = sessionData ? sessionData.sessionData.id : null;

        if (!userId) {
            console.error("User not logged in");
            return;
        }
        var orders = await orderApi.getUserOrdersHistory(userId);

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
            // Order row
            var row = document.createElement('tr');
            row.classList.add('order-row');
            const cancelButton = (order.status == 4 || order.status == 5) 
            ? '' 
            : `
                <a href="#" class="btn btn-outline-danger btn-sm" onclick="cancelOrder(event, '${order.order_id}')">
                    &#10060; Cancel
                </a>
            `;
            const totalSum = order.products.reduce((sum, product) => {
                return sum + (product.price * product.qty); 
            }, 0).toFixed(2); 
            row.innerHTML = `
                <td></td>
                <td>${order.order_id}</td>
                <td>${new Date(order.created_at).toLocaleDateString()}</td>
                <td >${this.getStatusText(order.status)}</td>
                <td>${totalSum}$</td>
                 <td>${cancelButton}</td>
            `;
            tableBody.appendChild(row);
        
            // Products row
            var productsRow = document.createElement('tr');
            productsRow.innerHTML = `
                <td colspan="6" class="p-0">
                    <div class="nested-table-wrapper">
                        <table class="table table-bordered mb-0">
                            <thead class="bg-light">
                                <tr>
                                    <th>#Product ID</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${order.products.map(product => `
                                    <tr>
                                        <td>${product.product_name}</td>
                                        <td>${product.qty}</td>
                                        <td>${product.price.toFixed(2)}$</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </td>
            `;
            tableBody.appendChild(productsRow);
        });
        
    },


    // getUserOrdersHistory: async function (userId) {
    //     var orders = await dbController.getItemsByUniqueKey('orders', 'user_id', userId);
    //     let returned_data = [];


    //     if (orders.length != 0) {
    //         let cartPromises = orders.map(async (order) => {
    //             let cartData = await dbController.getItem('carts', order.cart_id);

    //             return {
    //                 order_id: order.id,
    //                 created_at: order.created_at,
    //                 status: order.status,
    //                 products: cartData ? cartData.products : []
    //             };
    //         });

    //         returned_data = await Promise.all(cartPromises);
    //     }

    //     console.log(returned_data);
    //     return returned_data;
    // },


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

    await genreal.updateCartPill();
    await updateUIBasedOnSession();
    await handleLogout();
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

    var orderDetails = await orderApi.getUserOrdersHistory(JSON.parse(localStorage.getItem('clientSession')).sessionData.id);
    var order = orderDetails.find(o => o.order_id == orderId);
    if (order) {
        var detailsBody = document.querySelector('#detailsBody');
        var detailsTable = document.querySelector('#detailsTable');
        detailsBody.innerHTML = "";

        if (order.products.length > 0) {
            order.products.forEach(product => {
                var row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.product_id}</td>
                    <td>${product.qty}</td>
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

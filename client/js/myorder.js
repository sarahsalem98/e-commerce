window.addEventListener("load",function(){

    const userId = 1; //default value
    const orderTableBody = document.querySelector('.table tbody');

    async function populateOrders() {
        try {
          
            const orders = await order.getUserOrdersHistory(userId);

           
            if (orders.length === 0) {
                orderTableBody.innerHTML = ""
                return;
            }

            orders.forEach((order, index) => {
                order.products.forEach((product) => {
                    const { name, price, quantity } = product;

                   
                    const row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${name}</td>
                            <td>${price.toFixed(2)}</td>
                            <td>${quantity}</td>
                        </tr>`;
                    orderTableBody.innerHTML += row;
                });
            });
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }

   
    populateOrders();
})//end of load
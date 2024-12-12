window.addEventListener("load", async function() {
    let userId = localStorage.getItem("user_id"); 
    if (!userId) {
        console.error("User ID is missing");
        document.getElementById('no-orders').classList.remove('d-none');  
        return;
    }
    let orderList = await fetchUserOrders(userId);
    populateOrder(orderList);
});

function populateOrder(orderList) {
    let tableBody = document.querySelector('.tbody');
    let noOrdersMessage = document.getElementById('no-orders');
    
    tableBody.innerHTML = "";  

    if (orderList.length === 0) {
        noOrdersMessage.classList.remove('d-none');  
        return;
    } else {
        noOrdersMessage.classList.add('d-none');  
    }

    
    orderList.forEach((order, index) => {
        let formattedDate = new Date(order.created_at).toLocaleString();
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${order.first_name} ${order.second_name}</td>
            <td>${order.email}</td>
            <td>${order.address}, ${order.gov}</td>
            <td>${order.phone_num1} / ${order.phone_num2}</td>
            <td>${order.status === 1 ? 'Completed' : 'Pending'}</td>
            <td>${formattedDate}</td>
            <td>${order.message}</td>
        `;
        tableBody.appendChild(row);
    });
}

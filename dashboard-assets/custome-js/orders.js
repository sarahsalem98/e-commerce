
import { general } from "./general.js";
import { dbController } from "./indexedDb.js";

let global_orders=[];
export var orders = {

    fetchData: async function (seller_id) {
        let data = await this.getDataFromStorage(seller_id);
        let alldataorders=await this.getDataFromStorage(null);
        let allDataobj = [];
        if (alldataorders.length == 0) {
            let res = await fetch('../../dashboard-assets/data/order-list.json');
            let allData = await res.json();
            this.saveDataToStorage(allData);


        } else {
            if(data.length!=0){
                allDataobj=data;
            }
        }
        return allDataobj;
    },
    getOrderData: async function (id) {
        const data = await this.fetchData();
        var orderdata = data.find(function (product) {
            return product.id == id;
        });
        return orderdata;
    },
    saveDataToStorage: function (data) {
        dbController.saveDataArray('orders', data);

    },
    getDataFromStorage: async function (seller_id) {
        console.log("ttt"+seller_id);
        let orders = [];
        if (seller_id != null && seller_id != undefined) {
            orders = await dbController.getDataArray('orders');
            for (let order of orders) {
                let cart_id = order.cart_id;
                let cart = await dbController.getItem('carts', cart_id);
                console.log("tt"+cart);
                if (cart) {
                    let validProducts = [];
                    for (let product of cart.products) {
                        let product_data = await dbController.getItem('products', product.product_id);

                        if (product_data && product_data.seller_id == seller_id) {
                            validProducts.push(product);
                        }
                    }
                    cart.products = validProducts;
                    if (cart.products.length > 0) {
                        order.cart = cart;
                    } else {
                        orders = orders.filter(o => o.id !== order.id);
                    }
                } else {
                    orders = orders.filter(o => o.id !== order.id);
                }
                global_orders=orders;
            }
        } else {
            orders = await dbController.getDataArray('orders');
        }
     

        return orders;
    },
    viewOrders: async function (seller_id) {
        var dtUserTable = $('.orders-list-table');
        var assetPath = "../../dashboard-assets/";
        var userView = 'app-user-view-account.html';
        const userData = await orders.fetchData(seller_id);

        document.getElementById("total-orders-count").innerText = userData.length;
        document.getElementById("placed-orders-count").innerText = userData.filter(user => user.status == 1).length;
        document.getElementById("prepared-orders-count").innerText = userData.filter(user => user.status == 2).length;
        document.getElementById("completed-orders-count").innerText = userData.filter(user => user.status == 3).length;
        document.getElementById("deliverd-orders-count").innerText = userData.filter(user => user.status == 4).length;
        document.getElementById("cancelled-orders-count").innerText = userData.filter(user => user.status == 5).length;

        var statusObj = {
            1: { title: 'orderplaced', class: 'badge-light-primary' },
            2: { title: 'preparing', class: 'badge-light-warning' },
            3: { title: 'completed', class: 'badge-light-success' },
            4: { title: 'deliverd', class: 'badge-light-secondary' },
            5: { title: 'cancelled', class: 'badge-light-danger' },
        };
        if(seller_id!=null ||seller_id!=undefined){
            let sellerdata=await dbController.getItem('sellers',seller_id);
            const seller_name=document.getElementById("seller-name");
            if(seller_name){
                seller_name.innerText=`#${seller_id}#-${sellerdata.full_name}`

            }

        }

        if ($.fn.dataTable.isDataTable('.orders-list-table')) {
            $('.orders-list-table').DataTable().clear().destroy();
        }
        $('.user_status select').remove();
        $('.user_status label').remove();
        if (dtUserTable.length) {
            dtUserTable.DataTable({
                //  ajax: assetPath + 'data/user-list.json',
                data: userData,
                columns: [
                    { data: null },
                    { data: 'id' },
                    { data: 'email' },
                    { data: 'is_guest' },
                    { data: 'created_at' },
                    { data: 'status' },
                    { data: null }
                ],
                columnDefs: [
                    {
                        // For Responsive
                        className: 'control',
                        orderable: false,
                        responsivePriority: 2,
                        targets: 0,
                        render: function (data, type, full, meta) {
                            return ''
                        }
                    },
                    {
                        targets: 3,
                        render: function (data, type, full, meta) {
                            return full['is_guest'] == false ? "Registered" : "guest";


                        }
                    },

                    {

                        targets: 4,
                        render: function (data, type, full, meta) {
                            var date = full['created_at'];
                            const formattedDate = new Date(date).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                            });

                            return formattedDate;
                        }
                    },
                    {
                        // User Status
                        targets: 5,
                        width: '10%',
                        render: function (data, type, full, meta) {
                            var $status = full['status'];

                            return (
                                '<span class="badge rounded-pill ' +
                                statusObj[$status].class +
                                '" text-capitalized>' +
                                statusObj[$status].title +
                                '</span>'
                            );
                        }
                    },
                    {
                        // Actions
                        targets: 6,
                        width: '5%',
                        title: 'Actions',
                        orderable: false,
                        render: function (data, type, full, meta) {

                            return (
                                '<div class="btn-group">' +
                                '<a class="btn btn-sm dropdown-toggle hide-arrow" data-bs-toggle="dropdown">' +
                                feather.icons['more-vertical'].toSvg({ class: 'font-small-4' }) +
                                '</a>' +
                                '<div class="dropdown-menu dropdown-menu-end">' +

                                // Status change options
                                (full['status'] === 1
                                    ? '<a href="javascript:;" class="dropdown-item" onclick="orders.changeStatus(' + full['id'] + ', 2)"> ' +
                                    feather.icons['check-circle'].toSvg({ class: 'font-small-4 me-50' }) + ' Prepare</a>'
                                    : '') +
                                (full['status'] === 2
                                    ? '<a href="javascript:;" class="dropdown-item" onclick="orders.changeStatus(' + full['id'] + ', 3)"> ' +
                                    feather.icons['check-circle'].toSvg({ class: 'font-small-4 me-50' }) + ' Complete</a>'
                                    : '') +
                                (full['status'] === 3
                                    ? '<a href="javascript:;" class="dropdown-item" onclick="orders.changeStatus(' + full['id'] + ', 4)"> ' +
                                    feather.icons['check-circle'].toSvg({ class: 'font-small-4 me-50' }) + ' Deliver</a>'
                                    : '') +

                                (full['status'] < 4
                                    ? '<a href="javascript:;" class="dropdown-item" onclick="orders.changeStatus(' + full['id'] + ', 5)"> ' +
                                    feather.icons['x-circle'].toSvg({ class: 'font-small-4 me-50' }) + ' Cancel</a>'
                                    : '') +

                                // Details option
                                '<a href="javascript:;" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#order-details-modal" onclick="orders.viewDetails(' + full['id'] + ')"> ' +
                                feather.icons['file-text'].toSvg({ class: 'font-small-4 me-50' }) + ' Details</a>' +

                                '</div>' +
                                '</div>'
                            );

                        }
                    }
                ],
                order: [[1, 'desc']],
                dom:
                    '<"d-flex justify-content-between align-items-center header-actions mx-2 row mt-75"' +
                    '<"col-sm-12 col-lg-4 d-flex justify-content-center justify-content-lg-start" l>' +
                    '<"col-sm-12 col-lg-8 ps-xl-75 ps-0"<"d-flex align-items-center justify-content-center justify-content-lg-end flex-lg-nowrap flex-wrap"<"me-1"f>>>' +
                    '>t' +
                    '<"d-flex justify-content-between mx-2 row mb-1"' +
                    '<"col-sm-12 col-md-6"i>' +
                    '<"col-sm-12 col-md-6"p>' +
                    '>',
                language: {
                    sLengthMenu: 'Show _MENU_',
                    search: 'Search',
                    searchPlaceholder: 'Search..'
                },
                // Buttons with Dropdown


                responsive: {
                    details: {
                        display: $.fn.dataTable.Responsive.display.modal({
                            header: function (row) {
                                var data = row.data();
                                return 'Details of ' + data['name'];
                            }
                        }),
                        type: 'column',
                        render: function (api, rowIdx, columns) {
                            var data = $.map(columns, function (col, i) {
                                return col.columnIndex !== 6 // ? Do not show row in modal popup if title is blank (for check box)
                                    ? '<tr data-dt-row="' +
                                    col.rowIdx +
                                    '" data-dt-column="' +
                                    col.columnIndex +
                                    '">' +
                                    '<td>' +
                                    col.title +
                                    ':' +
                                    '</td> ' +
                                    '<td>' +
                                    col.data +
                                    '</td>' +
                                    '</tr>'
                                    : '';
                            }).join('');
                            return data ? $('<table class="table"/>').append('<tbody>' + data + '</tbody>') : false;
                        }
                    }
                },
                language: {
                    paginate: {
                        previous: '&nbsp;',
                        next: '&nbsp;'
                    }
                },
                initComplete: function () {
                    this.api()
                        .columns(5)
                        .every(function () {
                            var column = this;
                            var label = $('<label class="form-label" for="FilterTransaction">Status</label>').appendTo('.user_status');
                            var select = $(
                                '<select id="FilterTransaction" class="form-select text-capitalize mb-md-0 mb-2xx"><option value=""> Select Status </option></select>'
                            )
                                .appendTo('.user_status')
                                .on('change', function () {
                                    var val = $.fn.dataTable.util.escapeRegex($(this).val());
                                    column.search(val ? '^' + val + '$' : '', true, false).draw();
                                });

                            column
                                .data()
                                .unique()
                                .sort()
                                .each(function (d, j) {
                                    select.append(
                                        '<option value="' +
                                        statusObj[d].title +
                                        '" class="text-capitalize">' +
                                        statusObj[d].title +
                                        '</option>'
                                    );
                                });
                        });
                }
            });

        }
    },

    viewDetails: async function (id) {
        orders.resetFormFields();
        let data;
        let details;
        if(global_orders.length==0){
         data = await this.getOrderData(id);
         let cart= await dbController.getItem('carts',data.cart_id);
         details=cart.products ;

        }else{
           data= global_orders.find(o=>o.id==id);
           details=data.cart.products;
        }
        console.log(details);
        document.getElementById("order-email").value = data.email;
        document.getElementById("order-first-name").value = data.first_name;
        document.getElementById("order-last-name").value = data.second_name;
        document.getElementById("order-gov").value = data.gov;
        document.getElementById("order-address").value = data.address;
        document.getElementById("order-phone1").value = data.phone_num1;
        document.getElementById("order-phone2").value = data.phone_num2;
        document.getElementById("order-notes").value = data.message;
        //let productsdata = data.cart;        
        if ($.fn.dataTable.isDataTable('.billing-list-table')) {
            $('.billing-list-table').DataTable().clear().destroy();
        }
        var dtUserTable = $('.billing-list-table');
        if (dtUserTable.length) {
            dtUserTable.DataTable({
                data: details,
                columns: [
                    { data: null },
                    { data: 'product_id' },
                    { data: 'qty' },
                    { data: 'price' }
                ],
                columnDefs: [
                    {
                        // For Responsive
                        className: 'control',
                        orderable: false,
                        responsivePriority: 2,
                        targets: 0,
                        render: function (data, type, full, meta) {
                            return '';
                        }
                    }
                ],
                order: [[1, 'desc']]
            });

        }

    },

    changeStatus: async function (id, status) {
        var data = await dbController.getItem('orders', id);
        data.status = status;
        var done = await dbController.updateItem('orders', id, data);
        if (done) {
            toastr.success("status changed successfully");
        } else {
            toastr.error("something went wrong");
        }
        this.viewOrders();
    },


    resetFormFields: function () {
        document.getElementById("order-email").value = ''
        document.getElementById("order-first-name").value = '';
        document.getElementById("order-last-name").value = '';
        document.getElementById("order-gov").value = '';
        document.getElementById("order-address").value = '';
        document.getElementById("order-phone1").value = '';
        document.getElementById("order-phone2").value = '';


    }


}
window.orders = orders;




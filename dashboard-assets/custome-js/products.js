
import { reviews } from "./reviews.js";
import { general } from "./general.js";
import {seller} from "./AuthDashboard.js";
import { dbController } from "./indexedDb.js";

export var products = {
    fetchData: async function (seller_id) {
   
        let data = await this.getDataFromStorage(seller_id);
        let alldatapro=await this.getDataFromStorage(null);
        let allDataobj = [];
        if(alldatapro.length==0){
            let res = await fetch('../../dashboard-assets/data/product-list.json');
            let allData = await res.json();
            this.saveDataToStorage(allData);
        }else{
                if(data.length!=0){
                    allDataobj=data;
                }
        }         
        return allDataobj;
    },
    getProductData: async function (id) {
        const data = await this.fetchData();
        var productData = data.find(function (product) {
            return product.id == id;
        });
        return productData;
    },
    saveDataToStorage: function (data) {
        dbController.saveDataArray('products', data);

    },
    getDataFromStorage: async function (seller_id) {
        var data = [];
        if (seller_id != null|| seller_id!=undefined) {
            data = await dbController.getItemsByIndex('products', 'seller_id', parseInt(seller_id));
        } else {
            data = await dbController.getDataArray('products');
        }
        return data;
    },
    viewProducts: async function (seller_id) {
      
        var dtUserTable = $('.product-list-table');
        var assetPath = "../../dashboard-assets/";
        var userView = 'app-user-view-account.html';
        const userData = await products.fetchData(seller_id);
        
        
        document.getElementById("active-products-count").innerText = userData.filter(user => user.status == 1).length;
        document.getElementById("inactive-products-count").innerText = userData.filter(user => user.status == 2).length;
        document.getElementById("total-products-count").innerText = userData.length;
        if(seller_id!=null ||seller_id!=undefined){
             let sellerdata=await dbController.getItem('sellers',seller_id);
             const seller_name=document.getElementById("seller-name");
             if(seller_name){
                 seller_name.innerText=`#${seller_id}#-${sellerdata.full_name}`

             }

         }

        var statusObj = {
            1: { title: 'Active', class: 'badge-light-success' },
            2: { title: 'Inactive', class: 'badge-light-danger' }
        };
        var categoryTypes = {
            1: { title: 'Necklaces', class: 'badge-light-success' },
            2: { title: 'Rings', class: 'badge-light-warning' },
            3: { title: 'Bracelets', class: 'badge-light-secondary' },
            4: { title: 'Earrings', class: 'badge-light-priamary' }
        };


        if ($.fn.dataTable.isDataTable('.product-list-table')) {
            $('.product-list-table').DataTable().clear().destroy(); // Destroy the existing DataTable
        }
        $('.user_status select').remove();
        $('.user_status label').remove();
        if (dtUserTable.length) {
            dtUserTable.DataTable({
                //  ajax: assetPath + 'data/user-list.json',
                data: userData,
                columns: [
                    { data: null },
                    { data: 'name' },
                    { data: 'category' },
                    { data: 'price' },
                    { data: 'qty' },
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
                            return '';
                        }
                    },
                    {

                        targets: 1,
                        responsivePriority: 4,
                        render: function (data, type, full, meta) {
                            var $name = full['name'],
                                $image = full['pics'][0];

                            if ($image) {

                                var $output =
                                    '<img src="' + $image + '" alt="Avatar" height="32" width="32">';
                            } else {
                                var stateNum = Math.floor(Math.random() * 6) + 1;
                                var states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary'];
                                var $state = states[stateNum],
                                    $name = full['name'],
                                    $initials = $name.match(/\b\w/g) || [];
                                $initials = (($initials.shift() || '') + ($initials.pop() || '')).toUpperCase();
                                $output = '<span class="avatar-content">' + $initials + '</span>';
                            }
                            var colorClass = $image === '' ? ' bg-light-' + $state + ' ' : '';
                            var $row_output =
                                '<div class="d-flex justify-content-left align-items-center">' +
                                '<div class="avatar-wrapper">' +
                                '<div class="avatar ' +
                                colorClass +
                                ' me-1">' +
                                $output +
                                '</div>' +
                                '</div>' +
                                '<div class="d-flex flex-column">' +
                                '<a href="javascript:void;" class="user_name text-truncate text-body"><span class="fw-bolder">' +
                                $name +
                                '</span></a>' +
                                '</div>' +
                                '</div>';
                            return $row_output;
                        }
                    },

                    {
                        // User Status
                        targets: 2,
                        render: function (data, type, full, meta) {
                            var $cat = full['category'];

                            return (
                                '<span class="badge rounded-pill ' +
                                categoryTypes[$cat].class +
                                '" text-capitalized>' +
                                categoryTypes[$cat].title +
                                '</span>'
                            );
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
                                '<a href="javascript:;" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#create-updateUser" onclick="products.openUpdateModal(' + full['id'] +')">' +
                                feather.icons['file-text'].toSvg({ class: 'font-small-4 me-50' }) +
                                'Update</a>' +
                                '<a href="javascript:;" class="dropdown-item delete-record"  data-bs-toggle="modal" data-bs-target="#danger-Modal" onclick="products.openDeleteModal(' + full["id"] + ', \'' + full["name"].replace(/'/g, "\\'") + '\')">' +
                                feather.icons['trash-2'].toSvg({ class: 'font-small-4 me-50' }) +
                                'Delete</a>' +
                                '<a href="javascript:;" class="dropdown-item delete-record" onclick="products.changeStatus(' + full['id'] + ')"> ' +
                                (full['status'] == 1 ? feather.icons['x'].toSvg({ class: 'font-small-4 me-50' }) : feather.icons['check-circle'].toSvg({ class: 'font-small-4 me-50' })) +
                                (full['status'] == 1 ? 'deactivate' : 'activate') + '</a>'
                                +
                                '<a href="javascript:;" class="dropdown-item delete-record" data-bs-toggle="modal" data-bs-target="#review-modal" onclick="products.viewReviews(' + full['id'] + ')"> ' +
                                feather.icons['file-text'].toSvg({ class: 'font-small-4 me-50' }) +
                                ' Reviews</a>'
                                + '</div>' +
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
                    '<"col-sm-12 col-lg-8 ps-xl-75 ps-0"<"dt-action-buttons d-flex align-items-center justify-content-center justify-content-lg-end flex-lg-nowrap flex-wrap"<"me-1"f>B>>' +
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
                buttons: [
                    {
                        text: 'Add New product',
                        className: 'add-new btn btn-primary',
                        attr: {
                            'data-bs-toggle': 'modal',
                            'data-bs-target': '#create-updateUser'
                        },
                        init: function (api, node, config) {
                            $(node).removeClass('btn-secondary');
                            $(node).on('click', function () {
                                document.getElementsByClassName("updateTitle")[0].innerText = "Add New Product";
                                document.getElementsByClassName("add-update-btn")[0].innerText = "Add";
                                products.resetFormFields();

                            })
                        }
                    }
                ],
                // For responsive popup
                responsive: {
                    details: {
                        display: $.fn.dataTable.Responsive.display.modal({
                            header: function (row) {
                                var data = row.data();
                                return 'Details of ' + data['name'];
                            }
                        }),
                        type: 'column',
                        renderer: function (api, rowIdx, columns) {
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

    openUpdateModal: async function (id) {
        products.resetFormFields();
        let data = await this.getProductData(id);
        document.getElementsByClassName("updateTitle")[0].innerText = "Update Product";
        document.getElementsByClassName("add-update-btn")[0].innerText = "update";
        document.getElementById("product-id").value = id;
        document.getElementById("seller-id").value=window.globalseller_id;
        document.getElementById("product-name").value = data.name;
        document.getElementById("product-category").value = data.category;
        document.getElementById("product-qty").value = data.qty;
        document.getElementById("product-price").value = data.price;
        document.getElementById("product-desc").value = data.desciption;
        products.populateExistingImages(data.pics);
    },
    addUpdate: async function (e) {
        let id = document.getElementById("product-id").value.toString();
        //update
        if (!this.validateForm()) {
            e.preventDefault();
            return;
        } else {
            if (id != '') {
                let data = await dbController.getItem('products', parseInt(id));
                if (data != null) {
                    var inputPics = document.getElementsByName("product-pics");
                    var pics = [];
                    for (var i = 0; i < inputPics.length; i++) {
                        if (inputPics[i].files == null || inputPics[i].files == undefined) {
                            pics.push(inputPics[i].value);
                        } else {
                            let base64pic = await general.convertImgTo64(inputPics[i].files[0]);
                            pics.push(base64pic);
                        }
                    }
                    data.name = document.getElementById("product-name").value;
                    data.price =parseInt(document.getElementById("product-price").value);
                    data.qty =parseInt(document.getElementById("product-qty").value);
                    data.category = document.getElementById("product-category").value;
                    data.desciption = document.getElementById("product-desc").value;
                    data.seller_id=parseInt(window.globalseller_id);
                    data.pics = pics;

                }
                console.log(data);

                let done = await dbController.updateItem('products', id, data);
                if (done) {
                    toastr.success("product update successfully");
                    this.viewProducts(window.globalseller_id);
                    $('#create-updateUser').modal('hide');
                } else {
                    toastr.error("something went wrong");
                }

            } else {
                var inputPics = document.getElementsByName("product-pics");
                var base64pics = [];
                for (var i = 0; i < inputPics.length; i++) {
                    let base64pic = await general.convertImgTo64(inputPics[i].files[0]);
                    base64pics.push(base64pic);
                }

                const newdata = {
                    name: document.getElementById("product-name").value,
                    price: parseInt(document.getElementById("product-price").value),
                    qty: parseInt(document.getElementById("product-qty").value),
                    category: document.getElementById("product-category").value,
                    desciption: document.getElementById("product-desc").value,
                    seller_id:parseInt(window.globalseller_id),
                    status: 1,
                    pics: base64pics
                }
              //  console.log(newdata);
                var ok = await dbController.addItem('products', newdata);
                if (ok) {
                    toastr.success("product added successfully");
                }
                this.viewProducts(window.globalseller_id);
                $('#create-updateUser').modal('hide');

            }
        }


    },
    changeStatus: async function (id) {
        var data = await dbController.getItem('products', id);
        var changedstatus = data.status == 1 ? 2 : 1;
        data.status = changedstatus;
        let done = await dbController.updateItem('products', id, data);
        if (done) {
            toastr.success("status changed successfully");
        } else {
            toastr.error("something went wrong");
        }

        this.viewProducts(window.globalseller_id);
    },
    openDeleteModal: function (id, name) {
        document.getElementsByClassName("deleted-record-id")[0].value = id;
        var text = document.getElementsByClassName("danger-modal-text")[0];
        text.innerText = `are you sure you wante to delete this product ${name}?`;


    },
    delete: async function () {
        let id = document.getElementsByClassName("deleted-record-id")[0].value;
        let isDeletedSuccessfully = await dbController.deleteItem('products', id);
        if (isDeletedSuccessfully) {
            toastr.success("products deleted successfully");
            this.viewProducts(window.globalseller_id);
        }

    },
    validateForm: function () {
        $('.select2').select2();
        var form = $('#add-update-product-form');
        if (form.length) {
            form.validate({
                rules: {
                    'product-name': { required: true },
                    'product-price': { required: true, },
                    'product-qty': { required: true },
                    'product-category': { required: true },
                    'product-desc': { required: true }


                },
                messages: {
                    'product-name': "Please enter your name",
                    'product-price': "Please enter price",
                    'product-qty': "Please enter qty",
                    'product-category': "Please enter category",
                    'product-desc': "please enter description"

                }
            });

            var isValide = form.valid();
            return isValide;
        }
        return false;
    },
    resetFormFields: function () {
        document.getElementById("product-id").value='';
        document.getElementById("product-name").value = '';
        document.getElementById("product-price").value = '';
        document.getElementById("product-qty").value = '';
        document.getElementById("product-category").value = '';
        document.getElementById("product-desc").value = '';

        let pics = document.getElementsByName("product-pics");
        for (var i = 0; i < pics.length; i++) {
            pics.value = "";
        }
        const previewRow = document.getElementById("image-preview-row");
        if (previewRow) {
            previewRow.innerHTML = "";
        }

    },

    addPerviewImgs: function () {
        const previewRow = document.getElementById("image-preview-row");
        // previewRow.innerHTML="";
        const input = document.createElement("input");
        input.type = "file";
        input.name = "product-pics"
        input.accept = "image/*";
        input.style.display = "none";
        input.click();

        input.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const wrapper = document.createElement("div");
                    wrapper.className = "file-wrapper position-relative me-2";

                    const img = document.createElement("img");
                    img.src = event.target.result;
                    img.alt = "Preview";
                    img.style.width = "80px";
                    img.style.height = "80px";
                    img.style.objectFit = "cover";
                    img.className = "border rounded";

                    const deleteBtn = document.createElement("button");
                    deleteBtn.type = "button";
                    deleteBtn.className = "btn btn-danger btn-sm position-absolute top-0 end-0";
                    deleteBtn.textContent = "X";

                    wrapper.appendChild(input);
                    deleteBtn.addEventListener("click", () => wrapper.remove());

                    wrapper.appendChild(img);
                    wrapper.appendChild(deleteBtn);
                    previewRow.appendChild(wrapper);
                };

                reader.readAsDataURL(file);
            }
        });

    },
    populateExistingImages: function (images) {
        //console.log("imgs"+images);
        console.log(images.length);
        const previewRow = document.getElementById("image-preview-row");
        previewRow.innerHTML = "";
        images.forEach((imageData, index) => {
            const wrapper = document.createElement("div");
            wrapper.className = "file-wrapper position-relative me-2";

            const hiddenInput = document.createElement("input");
            hiddenInput.type = "hidden";
            hiddenInput.name = "product-pics";
            hiddenInput.value = imageData;

            const img = document.createElement("img");
            img.src = imageData;
            img.alt = `Preview Image ${index + 1}`;
            img.style.width = "80px";
            img.style.height = "80px";
            img.style.objectFit = "cover";
            img.className = "border rounded";

            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "btn btn-danger btn-sm position-absolute top-0 end-0";
            deleteBtn.textContent = "X";
            deleteBtn.addEventListener("click", () => {
                wrapper.remove();

            });
            wrapper.appendChild(hiddenInput);
            wrapper.appendChild(img);
            wrapper.appendChild(deleteBtn);
            previewRow.appendChild(wrapper);
        });
    },
    viewReviews: function (productId) {

        reviews.viewReviewsForProduct(productId);
    }
}
window.products = products;




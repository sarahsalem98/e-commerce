import { dbController } from "./indexedDb.js";

export var sellers = {
    fetchData: async function () {
        let data = await this.getDataFromStorage();
        let allusers = [];
        if (data.length != 0) {
            allusers = data;

        } else {
            let res = await fetch('../../dashboard-assets/data/seller-list.json');
            console.log(res);
            allusers = await res.json();
            this.saveDataToStorage(allusers);
        }

        return allusers;
    },
    getUserData: async function (id) {
        const data = await this.fetchData();
        var userdata = data.find(function (user) {
            //  console.log(user);
            return user.id == id;
        });
        return userdata;
    },
    saveDataToStorage: function (data) {
        dbController.saveDataArray('sellers', data);

    },
    getDataFromStorage: async function () {
        const data = await dbController.getDataArray('sellers');
        return data;
    },
    viewUsers: async function () {
        console.log("tt");

        var dtUserTable = $('.seller-list-table');
        var assetPath = "../../dashboard-assets/";
        var userView = 'app-user-view-account.html';
        const userData = await sellers.fetchData();

        document.getElementById("active-sellers-count").innerText = userData.filter(user => user.status_user == 1).length;
        document.getElementById("inactive-sellers-count").innerText = userData.filter(user => user.status_user == 2).length;
        document.getElementById("total-sellers-count").innerText = userData.length;

        var statusObj = {
            1: { title: 'pending', class: 'badge-light-warning' },
            2: { title: 'active', class: 'badge-light-success' }
        };


        if ($.fn.dataTable.isDataTable('.seller-list-table')) {
            $('.seller-list-table').DataTable().clear().destroy(); // Destroy the existing DataTable
        }
        $('.user_status select').remove();
        $('.user_status label').remove();
        if (dtUserTable.length) {
            dtUserTable.DataTable({
                //  ajax: assetPath + 'data/user-list.json',
                data: userData,
                columns: [
                    { data: null },
                    { data: 'full_name' },
                    { data: 'national_id' },
                    { data: 'commercial_registration' },
                    { data: 'phone' },
                    { data: null },
                    { data: null },
                    { data: 'status_user' },
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
                            var $name = full['full_name'],
                                $email = full['email'];
                            var stateNum = Math.floor(Math.random() * 6) + 1;
                            var states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary'];
                            var $state = states[stateNum],
                                $name = full['full_name'],
                                $initials = $name.match(/\b\w/g) || [];
                            $initials = (($initials.shift() || '') + ($initials.pop() || '')).toUpperCase();
                            var $output = '<span class="avatar-content">' + $initials + '</span>';

                            var colorClass = ' bg-light-' + $state + ' ';
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
                                '<a href="' +
                                userView +
                                '" class="user_name text-truncate text-body"><span class="fw-bolder">' +
                                $name +
                                '</span></a>' +
                                '<small class="emp_post text-muted">' +
                                $email +
                                '</small>' +
                                '</div>' +
                                '</div>';
                            return $row_output;
                        }
                    },
                    {

                        targets: 5,
                        render: function (data, type, full, meta) {
                            return (
                                '<button class="btn btn-secondary " onclick="products.viewProducts('+full['id']+')">' +
                                ' products' +
                                '</button>'
                            );
                        }
                    },
                    {

                        targets: 6,
                        render: function (data, type, full, meta) {
                            console.log(full['id'])
                            return (
                                '<button class="btn btn-success " onclick="products.viewProducts('+full['id']+')">' +
                                ' orders' +
                                '</button>'
                            );
                        }
                    },

                    {
                        // User Status
                        targets: 7,
                        width: '10%',
                        render: function (data, type, full, meta) {
                            var $status = full['status_user'];

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
                        targets: 8,
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
                                '<a href="javascript:;" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#create-updateUser" onclick="sellers.openUpdateModal(' + full['id'] + ')">' +
                                feather.icons['file-text'].toSvg({ class: 'font-small-4 me-50' }) +
                                'Update</a>' +
                                '<a href="javascript:;" class="dropdown-item delete-record"  data-bs-toggle="modal" data-bs-target="#danger-Modal" onclick="sellers.openDeleteModal(' + full["id"] + ', \'' + full["full_name"].replace(/'/g, "\\'") + '\')">' +
                                feather.icons['trash-2'].toSvg({ class: 'font-small-4 me-50' }) +
                                'Delete</a>' +
                                '<a href="javascript:;" class="dropdown-item delete-record" onclick="sellers.changeStatus(' + full['id'] + ')"> ' +
                                (full['status_user'] == 1 ? feather.icons['check-circle'].toSvg({ class: 'font-small-4 me-50' }) : feather.icons['x'].toSvg({ class: 'font-small-4 me-50' })) +
                                (full['status_user'] == 1 ? 'activate' : 'pend') + '</a>'
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
                        text: 'Add New Seller',
                        className: 'add-new btn btn-primary',
                        attr: {
                            'data-bs-toggle': 'modal',
                            'data-bs-target': '#create-updateUser'
                        },
                        init: function (api, node, config) {
                            $(node).removeClass('btn-secondary');
                            $(node).on('click', function () {
                                document.getElementsByClassName("updateTitle")[0].innerText = "Add New Seller";
                                document.getElementsByClassName("add-update-btn")[0].innerText = "Add";
                                sellers.resetFormFields();

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
                                return 'Details of ' + data['full_name'];
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
                        .columns(7)
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
        var userdata = await this.getUserData(id);
        document.getElementsByClassName("updateTitle")[0].innerText = "Update Seller";
        document.getElementsByClassName("add-update-btn")[0].innerText = "update";
        document.getElementById("seller-id").value = id;
        document.getElementById("seller-name").value = userdata.full_name;
        document.getElementById("seller-email").value = userdata.email;
        document.getElementById("seller-phone").value = userdata.phone;
        document.getElementById("seller-nationalId").value = userdata.national_id;
        document.getElementById("seller-CommertialReg").value = userdata.commercial_registration;
    },
    addUpdate: async function (e) {
        let id = document.getElementById("seller-id").value.toString();
        //update
        if (!this.validateForm()) {
            e.preventDefault();
            return;
        }
        let enterdEmail = document.getElementById("seller-email").value;
        let enterdNationalId = document.getElementById("seller-nationalId").value;
        var isvalidform = await sellers.validEmailAndNationalId(enterdEmail, enterdNationalId);
        if (isvalidform) {
            if (id != '') {
                var user = await dbController.getItem('sellers', parseInt(id));
                if (user != null) {


                    user.full_name = document.getElementById("seller-name").value;
                    user.email = document.getElementById("seller-email").value;
                    user.phone = document.getElementById("seller-phone").value;
                    user.national_id = document.getElementById("seller-nationalId").value;
                    user.commercial_registration = document.getElementById("seller-CommertialReg").value;

                }

                let done = await dbController.updateItem('sellers', id, user);
                if (done) {
                    toastr.success("seller update successfully");
                    this.viewUsers();
                    $('#create-updateUser').modal('hide');
                } else {
                    toastr.error("something went wrong");
                }

            } else {

                //add
                const newuser = {
                    full_name: document.getElementById("seller-name").value,
                    email: document.getElementById("seller-email").value,
                    phone: document.getElementById("seller-phone").value,
                    national_id: document.getElementById("seller-nationalId").value,
                    commercial_registration: document.getElementById("seller-CommertialReg").value,
                    status_user: 1,
                }
                var ok = await dbController.addItem('sellers', newuser);
                if (ok) {
                    toastr.success("seller added successfully");
                }
                this.viewUsers();
                $('#create-updateUser').modal('hide');

            }
        } else {
            toastr.error("enter valid email or national id");
            return;

        }


    },
    changeStatus: async function (id) {
        var data = await dbController.getItem('sellers', id);
        var changedstatus = data.status_user == 1 ? 2 : 1;
        data.status_user = changedstatus;
        let done = await dbController.updateItem('sellers', id, data);
        if (done) {
            toastr.success("status changed successfully");
        } else {
            toastr.error("something went wrong");
        }
        this.viewUsers();
    },
    openDeleteModal: function (id, name) {
        document.getElementsByClassName("deleted-record-id")[0].value = id;
        var text = document.getElementsByClassName("danger-modal-text")[0];
        text.innerText = `are you sure you wante to delete this seller ${name}?`;


    },
    delete: async function () {
        let id = document.getElementsByClassName("deleted-record-id")[0].value;
        let isDeletedSuccessfully = await dbController.deleteItem('sellers', id);
        if (isDeletedSuccessfully) {
            toastr.success("seller deleted successfully");
            this.viewUsers();
        }

    },
    validateForm: function () {
        $('.select2').select2();
        var form = $('#add-update-seller-form');
        if (form.length) {
            form.validate({
                rules: {
                    'seller-name': { required: true },
                    'seller-email': { required: true, email: true },
                    'seller-phone': { required: true },
                    'seller-nationalId': { required: true },
                    'seller-CommertialReg': { required: true },

                },
                messages: {
                    'seller-name': "Please enter your name",
                    'seller-email': "Please enter a valid email address",
                    'seller-phone': "Please enter your phone number",
                    'seller-nationalId': "Please enter your National Id",
                    'seller-CommertialReg': "Please select a Commertial Registeration",


                }
            });

            var isValide = form.valid();
            return isValide;
        }
        return false;
    },
    resetFormFields: function () {
        document.getElementById("seller-name").value = '';
        document.getElementById("seller-email").value = '';
        document.getElementById("seller-phone").value = '';
        document.getElementById("seller-nationalId").value = '';
        document.getElementById("seller-CommertialReg").value = '';

    },
    validEmailAndNationalId: async function (email, nationalId) {
        let data = await sellers.fetchData();
        let isvalidEmail = !data.some(user => user.email === email);
        let isvalidNationalId = !data.some(user => user.national_id === nationalId);
        return isvalidEmail && isvalidNationalId;
    }

}
window.sellers = sellers;


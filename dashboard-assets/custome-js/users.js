import { dbController } from "./indexedDb.js";
import { general } from "./general.js";
export var users = {
    fetchData: async function () {
        let data = await users.getDataFromStorage();
        let allusers = [];
        if (data.length != 0) {
            allusers = data;

        } else {
            console.log("hell");
            let res = await fetch('../../dashboard-assets/data/user-list.json');
            allusers = await res.json();
            this.saveDataToStorage(allusers);
        }

        return allusers;
    },
    getUserData: async function (id) {
        const data = await users.fetchData();
        var userdata = data.find(function (user) {
            //  console.log(user);
            return user.id == id;
        });
        return userdata;
    },
    saveDataToStorage: function (data) {
        dbController.saveDataArray('users', data);

    },
    getDataFromStorage: async function () {
        const data = await dbController.getDataArray('users');
        return data;
    },
    viewUsers: async function () {

        var dtUserTable = $('.user-list-table');
        var assetPath = "../../dashboard-assets/";
        var userView = 'app-user-view-account.html';
        const userData = await users.fetchData();

        document.getElementById("active-users-count").innerText = userData.filter(user => user.status_user == 1).length;
        document.getElementById("inactive-users-count").innerText = userData.filter(user => user.status_user == 2).length;
        document.getElementById("total-users-count").innerText = userData.length;

        var statusObj = {
            1: { title: 'Active', class: 'badge-light-success' },
            2: { title: 'Inactive', class: 'badge-light-danger' }
        };
        var genderObj = {
            1: { title: 'female', class: 'badge-light-secondary' },
            2: { title: 'male', class: 'badge-light-primary' }
        };

        if ($.fn.dataTable.isDataTable('.user-list-table')) {
            $('.user-list-table').DataTable().clear().destroy(); // Destroy the existing DataTable
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
                    { data: 'address' },
                    { data: 'phone' },
                    { data: 'gender' },
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
                                $email = full['email'],
                                $image = full['avatar'];
                            // console.log("dtaimg"+$image);
                            if ($image) {

                                var $output =
                                    '<img src="' + $image + '" alt="Avatar" height="32" width="32">';
                            } else {

                                var stateNum = Math.floor(Math.random() * 6) + 1;
                                var states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary'];
                                var $state = states[stateNum],
                                    $name = full['full_name'],
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
                                '<small class="emp_post text-muted">' +
                                $email +
                                '</small>' +
                                '</div>' +
                                '</div>';
                            return $row_output;
                        }
                    },

                    {
                        // User Status
                        targets: 4,
                        width: '10%',
                        render: function (data, type, full, meta) {
                            var $gender = full['gender'];
                            return (
                                '<span class="badge rounded-pill ' +
                                genderObj[$gender].class +
                                '" text-capitalized>' +
                                genderObj[$gender].title +
                                '</span>'
                            );
                        }
                    },

                    {
                        // User Status
                        targets: 5,
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
                                '<a href="javascript:;" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#create-updateUser" onclick="users.openUpdateModal(' + full['id'] + ')">' +
                                feather.icons['file-text'].toSvg({ class: 'font-small-4 me-50' }) +
                                'Update</a>' +
                                '<a href="javascript:;" class="dropdown-item delete-record"  data-bs-toggle="modal" data-bs-target="#danger-Modal" onclick="users.openDeleteModal(' + full["id"] + ', \'' + full["full_name"].replace(/'/g, "\\'") + '\')">' +
                                feather.icons['trash-2'].toSvg({ class: 'font-small-4 me-50' }) +
                                'Delete</a>' +
                                '<a href="javascript:;" class="dropdown-item delete-record" onclick="users.changeStatus(' + full['id'] + ')"> ' +
                                (full['status_user'] == 1 ? feather.icons['x'].toSvg({ class: 'font-small-4 me-50' }) : feather.icons['check-circle'].toSvg({ class: 'font-small-4 me-50' })) +
                                (full['status_user'] == 1 ? 'deactivate' : 'activate') + '</a>'
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
                        text: 'Add New User',
                        className: 'add-new btn btn-primary',
                        attr: {
                            'data-bs-toggle': 'modal',
                            'data-bs-target': '#create-updateUser'
                        },
                        init: function (api, node, config) {
                            $(node).removeClass('btn-secondary');
                            $(node).on('click', function () {
                                console.log("heellll");
                                document.getElementsByClassName("updateTitle")[0].innerText = "Add New User";
                                document.getElementsByClassName("add-update-btn")[0].innerText = "Add";
                                users.resetFormFields();

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
        var userdata = await users.getUserData(id);
        document.getElementsByClassName("updateTitle")[0].innerText = "Update User";
        document.getElementsByClassName("add-update-btn")[0].innerText = "update";
        document.getElementById("user-id").value = id;
        document.getElementById("user-name").value = userdata.full_name;
        document.getElementById("user-email").value = userdata.email;
        document.getElementById("user-phone").value = userdata.phone;
        document.getElementById("user-address").value = userdata.address;
        document.getElementById("user-gender").value=userdata.gender;
    },
    addUpdate: async function (e) {
        let id = document.getElementById("user-id").value.toString();
        //update
        if (!this.validateForm()) {
            e.preventDefault();
            return;
        }
        if (id != '') {
            var user = await dbController.getItem('users', parseInt(id));
            if (user != null) {
                let file = (document.getElementById("user-profile-pic")).files[0];
                user.full_name = document.getElementById("user-name").value;
                user.email = document.getElementById("user-email").value;
                user.phone = document.getElementById("user-phone").value;
                user.address = document.getElementById("user-address").value;
                user.gender = document.getElementById("user-gender").value;
                user.gov = document.getElementById("user-country").value;
                user.avatar = await general.convertImgTo64(file);

            }

            dbController.updateItem('users', id, user);
            toastr.success("user update successfully");
            this.viewUsers();
            $('#create-updateUser').modal('hide');
        } else {

            //add

            let filenew = (document.getElementById("user-profile-pic")).files[0];
            const newuser = {
                full_name: document.getElementById("user-name").value,
                username: document.getElementById("user-name").value,
                email: document.getElementById("user-email").value,
                address: document.getElementById("user-address").value,
                phone: document.getElementById("user-phone").value,
                gov: document.getElementById("user-country").value,
                gender: document.getElementById("user-gender").value,
                status_user: 1,
                avatar: await general.convertImgTo64(filenew)
            }
            var ok = await dbController.addItem('users', newuser);
            if (ok) {
                toastr.success("user added successfully");
            }
            this.viewUsers("user");
            $('#create-updateUser').modal('hide');



        }

    },
    changeStatus: async function (id) {
        var data = await dbController.getItem('users', id);
        console.log("sataus" + data);
        var changedstatus = data.status_user == 1 ? 2 : 1;
        data.status_user = changedstatus;
        let done = await dbController.updateItem('users', id, data);
        if (done) {
            toastr.success("status changed successfully");
        } else {
            toastr.error("something went wrong");
        }
        this.viewUsers();
    },
    openDeleteModal: function (id, name) {
        // console.log("id" + id);
        // console.log("name" + name);
        document.getElementsByClassName("deleted-record-id")[0].value = id;
        var text = document.getElementsByClassName("danger-modal-text")[0];
        text.innerText = `are you sure you wante to delete this user ${name}?`;


    },
    delete: async function () {
        let id = document.getElementsByClassName("deleted-record-id")[0].value;
        let isDeletedSuccessfully = await dbController.deleteItem('users', id);
        console.log(isDeletedSuccessfully);
        if (isDeletedSuccessfully) {
            toastr.success("user deleted successfully");
            this.viewUsers();
        }

    },
    validateForm: function () {
        $('.select2').select2();
        var form = $('#add-update-user-form');
        if (form.length) {


            form.validate({
                rules: {
                    'user-name': { required: true },
                    'user-email': { required: true, email: true },
                    'user-phone': { required: true },
                    'user-address': { required: true },
                    'user-country': { required: true },
                    'user-gender': { required: true }

                },
                messages: {
                    'user-name': "Please enter your name",
                    'user-email': "Please enter a valid email address",
                    'user-phone': "Please enter your phone number",
                    'user-address': "Please enter your address",
                    'user-country': "Please select a country",
                    'user-gender': "Please select a gender",

                }
            });


            var isValide = form.valid();
            return isValide;
        }
        return false;
    },
    resetFormFields: function () {
        document.getElementById("user-name").value = '';
        document.getElementById("user-email").value = '';
        document.getElementById("user-phone").value = '';
        document.getElementById("user-address").value = '';
        document.getElementById("user-gender").value = '';
        document.getElementById("user-country").value = '';
        document.getElementById("user-profile-pic").value = ''; 
    }

}
window.users = users;



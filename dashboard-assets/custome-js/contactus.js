import { dbController } from "./indexedDb.js";
export var contactus = {
    fetchData: async function () {
        let data = await this.getDataFromStorage();
        let allData = [];
        if (data.length != 0) {
            allData = data;

        } else {
            let res = await fetch('../../dashboard-assets/data/contact-us-list.json');
            allData = await res.json();
            this.saveDataToStorage(allData);
        }

        return allData;
    },
    saveDataToStorage: function (data) {
        dbController.saveDataArray('contactus', data);

    },
    getDataFromStorage: async function () {
        const data = await dbController.getDataArray('contactus');
        return data;
    },

    view: async function () {
        let data = await contactus.fetchData();
        if ($.fn.dataTable.isDataTable('.contact-list-table')) {
            $('.contact-list-table').DataTable().clear().destroy();
        }
        var dtUserTable = $('.contact-list-table');
        if (dtUserTable.length) {
            dtUserTable.DataTable({
                data: data,
                columns: [
                    { data: null },
                    { data: 'first_name' },
                    { data: 'second_name' },
                    { data: 'email' },
                    { data: 'message' },
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

                        targets: 5,
                        width: '10%',
                        render: function (data, type, full, meta) {
                            var email = full['email'];
                            return `
                            <a href="javascript:;"
                                class="btn "  onclick="contactus.sendemail('${email}')";
                                data-email="${email}" 
                                title="Send Email">
                               ${feather.icons['file-text'].toSvg({ class: 'font-medium-4' })}
                            </a>
                           
                        `;
                        }
                    },
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
            });

        }
    },
    sendemail: function (email) {
       // var email = $(this).data('email');
        window.location.href = `mailto:${email}`;
    }
}
window.contactus=contactus;
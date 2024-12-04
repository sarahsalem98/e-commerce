import { dbController } from "./indexedDb.js";
export var reviews={
    fetchData: async function () {
        let data = await this.getDataFromStorage();
        let allData = [];
        if (data.length != 0) {
            allData = data;

        } else {
            let res = await fetch('../../dashboard-assets/data/product-review-list.json');
            allData = await res.json();
            this.saveDataToStorage(allData);
        }

        return allData;
    },
    saveDataToStorage: function (data) {
        dbController.saveDataArray('reviews', data);

    },
    getDataFromStorage: async function () {
        const data = await dbController.getDataArray('reviews');
        return data;
    },
     
     viewReviewsForProduct:async function(productId){
                await reviews.fetchData();
        let data=await dbController.getItemsByUniqueKey("reviews","product_id",productId);
        var dtUserTable = $('.review-list-table');
        if (dtUserTable.length) {
            dtUserTable.DataTable({
                data: data,
                columns: [
                    { data: null },
                    { data: 'user_name' },
                    { data: 'rate' },
                    { data: 'description' }
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
     }
}
import { dbController } from "./indexedDb.js";
export var general = {
    convertImgTo64: async function (fileInput) {
        try {
            const base64 = await this.getBase64(fileInput);
            return base64;
        } catch (error) {
            console.error('Error converting file to Base64:', error);
        }

    },
    getBase64: function (file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    }
    ,
    initToastr: function () {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000",
            "extendedTimeOut": "1000",
            "closeButton": true,
            "progressBar": true
        };
    },
    validateForm: function (formId, rules, messages) {
        var form = $(`#${formId}`);
        if (form.length) {
            form.validate({
                rules: rules,
                messages: messages
            });
    
            var isValid = form.valid();
            return isValid;
        }
        return false;
    },
    chartData:function(orders){
        var $textMutedColor = '#b9b9c3';
        var $revenueReportChart = document.querySelector('#revenue-report-chart');
        let monthelydata={
            deliverd: new Array(12).fill(0),
            cancelled: new Array(12).fill(0)
        }
        orders.forEach(order=>{
           const order_month= new Date(order.updated_at).getMonth();
           if(order.status==4){
            monthelydata.deliverd[order_month]+=1;
           }else if(order.status==5){
            monthelydata.cancelled[order_month]+=-1;
           }
        })
        var revenueReportChartOptions = {
            chart: {
              height: 230,
              stacked: true,
              type: 'bar',
              toolbar: { show: false }
            },
            plotOptions: {
              bar: {
                columnWidth: '17%',
                endingShape: 'rounded'
              },
              distributed: true
            },
            colors: [window.colors.solid.success, window.colors.solid.danger],
            series: [
              {
                name: 'Earning',
                data:monthelydata.deliverd
              },
              {
                name: 'Expense',
                data: monthelydata.cancelled
              }
            ],
            dataLabels: {
              enabled: false
            },
            legend: {
              show: false
            },
            grid: {
              padding: {
                top: -20,
                bottom: -10
              },
              yaxis: {
                lines: { show: false }
              }
            },
            xaxis: {
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','oct','nov','des'],
              labels: {
                style: {
                  colors: $textMutedColor,
                  fontSize: '0.86rem'
                }
              },
              axisTicks: {
                show: false
              },
              axisBorder: {
                show: false
              }
            },
            yaxis: {
              labels: {
                style: {
                  colors: $textMutedColor,
                  fontSize: '0.86rem'
                }
              }
            }
          };
          var revenueReportChart = new ApexCharts($revenueReportChart, revenueReportChartOptions);
          revenueReportChart.render();
        console.log(monthelydata);


    },
    getSellerOrders:async function(orders,seller_id){
        let returnedOrders=[];
        for (let order of orders) {
            let cart_id = order.cart_id;
            let cart = await dbController.getItem('carts', cart_id);
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
            returnedOrders=orders;
        }
      return returnedOrders;
    }

}
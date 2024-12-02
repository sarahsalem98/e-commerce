var general = {
    convertImgTo64: async function (fileInput) {
        try{
       const base64=await this.getBase64(fileInput);
       return base64;
        }catch(error){
            console.error('Error converting file to Base64:', error);
        }

    },
     getBase64:function(file) {
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
    }


}
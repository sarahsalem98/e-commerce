 


 


(async function () {
    try {
        // Open the database
        // await dbController.openDataBase();

        // console.log(globals.products)

    } catch (error) {
        console.error('Error interacting with IndexedDB:', error);
    }

})();
  

window.addEventListener("load",function(){
    
    
    // for drop down
    $('.search_select_box select').selectpicker();



    var AllFileds=this.document.getElementsByClassName("filed");
     
    var AllLabels=this.document.querySelectorAll(".wrapper>label");
    

    for(var i=0 ; i<AllFileds.length ; ++i){

        (function(m){
            AllFileds[m].addEventListener("keyup",function(e){
                
                if(this.value.trim().length){
                     
                    AllLabels[m].classList.remove("apperance-status-label_toggle");
                    this.classList.add("apperance-status-input");   
                }else{
                    AllLabels[m].classList.add("apperance-status-label_toggle");
                    this.classList.remove("apperance-status-input");
                }
        
            })//end of keyup
        })(i)
        
    
    }

    // for text area 
    this.document.querySelector("textarea").addEventListener("keyup",function(){

        target=this.document.querySelector("textarea>label");

        if(this.value.trim().length){
                     
            target.classList.remove("apperance-status-label_toggle");
            this.classList.add("apperance-status-input");   

        }else{

            AllLabels[m].classList.add("apperance-status-label_toggle");
            this.classList.remove("apperance-status-input");

        }

    })//end of textarea registration

    this.document.querySelector(".payment_section>ul>li input").addEventListener("change",function(){
        console.log("wellcom")
        document.querySelector(".payment_section>ul>li p").classList.toggle("payment_details_toggle");
        
    })


})//end of load window


 

 
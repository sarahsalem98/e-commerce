
$(document).ready(function(){
    let lastClickedImage=null;
   $(".first-section .left-section .img-nav .img").on("click",function(){
         
     const image_url = $(this).css('background-image');
    $(this).css("border","1px solid var(--text-color)");
 
    $(".first-section .left-section .displayer").css("background-image", image_url) ;

    if(lastClickedImage !=null)
       $(lastClickedImage).css("border","none");
     lastClickedImage=this;   
   })//end of mouse enter event




   $(window).on('resize',function(){

     const currentWidth = document.body.offsetWidth;

     console.log('Window Width:', currentWidth); // Debugging

     //  for removeing the  bootstrap container class from main-section
     const containerDiv = document.querySelector('.main-section');

     console.log(currentWidth)
     if(currentWidth>1400)
        $(".main-section .first-section .left-section").css("height",550);
     else if (currentWidth <=930) {
        containerDiv.classList.remove('container');
       $("main-section").css("padding",0);
       $(".main-section .first-section .left-section").css("height",currentWidth/1.4);
        
     } else {
       // Add the class back for behaving in classical manner
       const containerDiv = document.querySelector('.main-section');
       containerDiv.classList.add('container');
       $(".main-section .first-section .left-section").css("height",currentWidth/2.5);
    }

   })//end of resize event


   const stars = document.querySelectorAll(".star");

   let isClicked=false;

   $(".star").on({

   mouseover: function(){
     if(isClicked)
       return;
   highlightStars(this.dataset.value);
   },

   click: function (e) {
     highlightStars(this.dataset.value);
     
     isClicked=true;
      
   },

   mouseout:function () {
     if(isClicked)
       return;
     highlightStars(0); 
   }

   })

   // Highlight stars up to the given value
   function highlightStars(value) {
     stars.forEach((star) => {
       
       if (star.dataset.value <= value) {
         star.classList.add("highlight");
       } else {
         star.classList.remove("highlight");
       }
     });
   }




})//end of load


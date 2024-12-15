import { dbController } from "../../dashboard-assets/custome-js/indexedDb.js"
import { clientProducts } from '../../dashboard-assets/custome-js/Apis/products.js';
import { cart } from "../../dashboard-assets/custome-js/Apis/cart.js";
import { clientReiview } from "../../dashboard-assets/custome-js/Apis/reviews.js";
import { genreal,updateUIBasedOnSession, handleLogout } from "./general.js";


(async function () {
  try {
    // Open the database
    await dbController.openDataBase();
    
    genreal.updateCartPill();

    

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    var sessiondata = JSON.parse(localStorage.getItem("clientSession"));
    let userId = null;
    if (sessiondata) {
        userId = sessiondata.sessionData.id;
    }
   
    
    var product=await clientProducts.getProductById(id);
    
    //set name of product 
    document.getElementsByClassName("product-name")[0].innerText=product["name"];
    //set nav with product name .
    document.querySelector('.active').innerText=product["name"];

    //fil images
    var images=document.getElementsByClassName("img");
    for(var i=0 ; i<images.length ; ++i){
      images[i].style.backgroundImage="url("+product['pics'][i]+")";
    }
    var display=document.getElementsByClassName("displayer")[0].style.backgroundImage="url("+product['pics'][0]+")";
    
    //set price
    document.getElementsByClassName("prodect-price")[0].innerText="$"+product['price'];

    //set details
    var inputFiled=document.getElementsByClassName("product-details")[0]
    inputFiled.innerText=product["desciption"];

    const btns=document.querySelectorAll(".controler-add-btn input");


    
    //add eve nt on input text.
    btns[1].addEventListener("keydown",function(e){

      const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'];  

       if(!( allowedKeys.includes(e.key) || ( ( e.key >= '0'&&e.key <= '9') && Number(this.value + e.key) <= product['qty'] ) )){
          e.preventDefault();
          return;
       }
    })

    btns[0].addEventListener("click",function(){
      var newVal= Number(btns[1].value)-1;
      if(newVal>=0){
        btns[1].value=newVal.toString();
        btns[3].value="ADD TO CART"
      }

    })//end of decrement

    btns[2].addEventListener("click",function(){
      var newVal= Number(btns[1].value)+1;
      if(newVal<=product['qty']){
        btns[1].value=newVal.toString();
        btns[3].value="ADD TO CART"

      }

    })//end of decrement


    btns[3].addEventListener('click',async function(){    
      if( !(btns[1].value=='')){       
        await cart.addToCart( product['id'] , btns[1].value ,userId,product["price"]);
        genreal.updateCartPill();
         
        this.value="ADDED TO CARD ✓"
      }
      
    })//add to cart button

    
     /************************************************************************************ */
     //review section

    const reviews=await clientReiview.getProductReiview(Number(id));  
     
    

    var nextReview=0;
    var isSeeMoreVisible=false;
    

    function addReview(){
      if(nextReview==0)
        document.querySelector(".third-section .last-review-info").classList.add('d-none');
      var review_wrapper=document.createElement("div")
      review_wrapper.setAttribute("class","review-"+nextReview+" d-flex pt-3")
     
      
      var left_div=document.createElement('div')
      left_div.setAttribute("class","d-flex flex-column align-items-center pe-3");
      left_div.style.width="10%"
      
      var img=document.createElement("img");
      img.setAttribute("src","./images/product_review/user.png");
      img.setAttribute("width","75");
      img.setAttribute("height",'75');

      var usernameParagraph=document.createElement("p");
      usernameParagraph.innerText=reviews[nextReview]['user_name'];
      usernameParagraph.style.textAlign="center"

      
      left_div.appendChild(img);
      left_div.appendChild(usernameParagraph); 

      review_wrapper.appendChild(left_div);
      /********************************************/

      var right_div=document.createElement('div');
      right_div.setAttribute("class","d-flex flex-column justify-content-start pt-3");

      var descParagraph=document.createElement("p");
      descParagraph.innerText=reviews[nextReview]['description'];
      
      var rat_wrapper=document.createElement("div");
      

      var rating_number=Number(reviews[nextReview]['rate'])

       
      for(var i=1 ; i<6 ; ++i){

        var created_span=document.createElement("span");

         
         
        if(i>rating_number)  
          created_span.innerHTML="<i class='fa-solid fa-star' style='color:lightgray'></i>"
        else
          created_span.innerHTML="<i class='fa-solid fa-star'></i>"

        rat_wrapper.appendChild(created_span);
      }
      console.log(descParagraph)
      right_div.appendChild(descParagraph);
      right_div.appendChild(rat_wrapper);


      review_wrapper.appendChild(right_div);
      
      document.querySelector(".main-section .third-section").appendChild(review_wrapper);

      nextReview++;
      if(nextReview==reviews.length-1)
        toggleSeeMore();
    }

    /********************************************************************/

    var isUserNameValid=false , isEmailValid=false , isValidRatting=false ,isValidTextarea=false , rating_value=0;

    var name=document.querySelector(".wrapper-form .form input[id='name']")
    name.addEventListener("keyup",function(){
       var reg=new RegExp("^[A-Za-z]{3,25}[ ]*$")
        
        if( this.value.trim().length==0 ||  !reg.test(this.value) ){
          document.querySelector(".wrapper-form .form label[for='name']").style.color="red"
          isUserNameValid=false;
           
         }
         else{
          document.querySelector(".wrapper-form .form label[for='name']").style.color="black";
          isUserNameValid=true;
         }
    })//end of key up


    var email=document.querySelector(".wrapper-form .form input[id='email']")
    email.addEventListener("keyup",function(){
      var reg=new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");

       if(this.value.trim().length==0 || !reg.test(this.value)){
         document.querySelector(".wrapper-form .form label[for='email']").style.color="red";
         isEmailValid=false;
        }
        else{
         document.querySelector(".wrapper-form .form label[for='email']").style.color="black";
         isEmailValid=true;
        }

   })//end of key up

   //rating
   var rating_stars=document.querySelectorAll(".wrapper-rating .star-rating .star")
   
   for(var i=0 ; i<rating_stars.length ; ++i){
      rating_stars[i].addEventListener('click',function(){
        rating_value=Number(this.dataset.value);
        document.querySelector("label[for='ratting']").style.color='black';
        isValidRatting=true;
        
      })//end of ratting registration
   }

   //textarea
   var textarea=document.querySelector("textarea")
   textarea.addEventListener("keyup",function(){
      if(this.value.trim()==''){
         
        document.querySelector("label[for='review-textarea']").style.color="red";
        isValidTextarea=false;
      }
      else{
        document.querySelector("label[for='review-textarea']").style.color="black";
        isValidTextarea=true;
      }
   })//end of textarea


   function resetFileds(){
    rating_value=0;
    isUserNameValid=false;
    isEmailValid=false;
    isValidRatting=false;
    isValidTextarea=false;
    name.value=""
    email.value=""
    textarea.value=""
    for(var i=0 ; i<rating_stars.length ; ++i){
      rating_stars[i].classList.remove("highlight")
    }
   }
  
   //submit 

   document.querySelector(".wrapper-form .form input[type='button']").addEventListener('click',async function(e){
      var isSomeThingMissed=false;

      if(!isUserNameValid){
        document.querySelector(".wrapper-form .form label[for='name']").style.color="red";
        isSomeThingMissed=true;
      }
      if(!isEmailValid){
        document.querySelector(".wrapper-form .form label[for='email']").style.color="red";
        isSomeThingMissed=true;
      }
      if(!isValidTextarea){
        document.querySelector("label[for='review-textarea']").style.color="red";
        isSomeThingMissed=true;
      }

      if(!isValidRatting){
        document.querySelector("label[for='ratting']").style.color='red';
        isSomeThingMissed=true;
      }

      if(!isSomeThingMissed){
        //we stooped here
        let product_id= Number(id); 
        let user_id= userId !=null ? Number(userId) : null ;
        
        var reviewObj=
        {
          "product_id": product_id ,
          "user_id": user_id,
          "user_name": document.querySelector(".wrapper-form .form input[id='name']").value,
          "rate": rating_value,
          "description":  document.querySelector("textarea").value
        }

        await clientReiview.addReview(reviewObj);
        reviews.push(reviewObj)
        resetFileds();
        
        if(reviews.length==0){
          initReview();
        }

        if(reviews.length==2)
            toggleSeeMore();
        
      }

   })//end of submit btn

    

   //see more btn
   document.querySelector(".main-section .see-more-btn").addEventListener('click',function(e){
    if(nextReview<reviews.length)
      addReview();
    e.preventDefault();
   }) 

    
   function initReview(){
    if(reviews.length){
      addReview();
    }
   }

   function toggleSeeMore(){
    var btn=document.querySelector(".main-section .see-more-btn");
    if(isSeeMoreVisible)
      btn.style.visibility = 'hidden';   
    else
      btn.style.visibility = 'visible'; 
    isSeeMoreVisible=!isSeeMoreVisible; 
   }


  
   initReview();
   toggleSeeMore();


  } catch (error) {
      console.error('Error interacting with IndexedDB:', error);
  }

})();






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




   function custome(){

    const currentWidth = document.body.offsetWidth;

   //  console.log('Window Width:', currentWidth); // Debugging

    //  for removeing the  bootstrap container class from main-section
    const containerDiv = document.querySelector('.main-section');

    
    if(currentWidth>1200 || window.innerWidth === screen.width){
      $(".main-section .first-section .left-section").css("height",550);
      containerDiv.classList.add('container');
       
    }
    else if (currentWidth <=930) {
       console.log("hello");
       containerDiv.classList.remove('container');
      $("main-section").css("padding",0);
      $(".main-section .first-section .left-section").css("height",currentWidth/1.4);
       
    } else {
      // Add the class back for behaving in classical manner
      containerDiv.classList.add('container');
      $(".main-section .first-section .left-section").css("height",currentWidth/2.5);
   }

  }

   $(window).on('resize',custome)//end of resize event
 

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
updateUIBasedOnSession();
handleLogout();





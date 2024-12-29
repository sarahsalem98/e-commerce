//  import { clientAuth } from '../../dashboard-assets/custome-js/Apis/Auth.js';
// export var userProfile={
//       updateProfile:async function(){
//               //await clientAuth.login("obarnes4@xyz.com",12345);

        
//           await clientAuth.updateProfile();

//       },
//       showUserData:async function(  ){
//        var id= JSON.parse(localStorage.getItem("clientSession")).sessionData.id;

//        var datauser= await clientAuth.getloggedInUserData(id);
     
//        $("#firstName").val(datauser.full_name.split(" "));
//        $("#lastName").val(datauser.full_name.split(" "));


//        console.log(datauser);

//         console.log( (await order.getUserOrdersHistory(1)).length);
      
//       }
// }
import { generalClient } from "../../dashboard-assets/custome-js/Apis/general.js";

import { clientAuth } from '../../dashboard-assets/custome-js/Apis/Auth.js';

export var userProfile = {
    
    updateProfile: async function () {
          
            var firstName = document.getElementById("firstName").value;
            var lastName = document.getElementById("lastName").value;
            var email = document.getElementById("email").value;
            var address = document.getElementById("address").value;
            var phone = document.getElementById("phone").value;
            var governorate = document.getElementById("governorate").value;
            var gender = document.getElementById("gender").value;
            var currentPassword = document.getElementById("currentPassword11").value;
          //  var newPassword = document.getElementById("newPassword").value;
          //  var confirmPassword = document.getElementById("confirmPassword").value;

      
            // if (newPassword && newPassword !== confirmPassword) {
            //     document.getElementById("passwordError").classList.remove("d-none");
            //     return;
            // } else {
            //     document.getElementById("passwordError").classList.add("d-none");
            // }

            let rules = {
                'email': { 
                    required: true, 
                    email: true 
                },
                'password': { 
                    required: true, 
                   // minlength: 8 ,
                    regex:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
                },
                'first-name': { 
                    required: true, 
                    regex: /^[A-Za-z][A-Za-z0-9\W]{2,}$/ 
                },
                'last-name': { 
                    required: true, 
                    regex: /^[A-Za-z][A-Za-z0-9\W]{2,}$/ 
                },
                'address': { 
                    required: true 
                },
                'gender': { 
                    required: true 
                },
                'phone': { 
                    required: true, 
                    regex: /^(010|011|012|015)[0-9]{8}$/ 
                },
                'governorate': { 
                    required: true 
                },
                'confirm-password': { 
                    required: true, 
                    equalTo: "#password" 
                }
            };
            
            let messages = {
                'email': 'Please enter a valid email address.',
                'password': {
                    required: 'Please enter a password.',
                   // minlength: 'Password must be at least 8 characters long.',
                    regex:'Minimum eight characters, at least one letter, one number and one special character'
                },
                'first-name': {
                    required: 'Please enter your first name.',
                    regex: 'First name must start with a letter and be at least 3 characters long. It can include letters, numbers, and special characters.'
                },
                'last-name': {
                    required: 'Please enter your last name.',
                    regex: 'Last name must start with a letter and be at least 3 characters long. It can include letters, numbers, and special characters.'
                },
                'address': 'Please enter your address.',
                'gender': 'Please select your gender.',
                'phone': {
                    required: 'Please enter your phone number.',
                    regex: 'Please enter a valid Egyptian phone number (must start with 010, 011, 012, or 015 and have 11 digits).'
                },
                'governorate': 'Please select your governorate.',
                'confirm-password': {
                    required: 'Please confirm your password.',
                    equalTo: 'Password do not match.'
                }
            };
            var isValidform = await generalClient.validateForm("updateProfileForm", rules, messages);
            if(isValidform){
                var userId = JSON.parse(localStorage.getItem("clientSession")).sessionData.id;
                console.log(currentPassword);
            
                var fullName = `${firstName} ${lastName}`;
                var sendedpassword=currentPassword;
                // console.log(fullName);
               var isUpdated = await clientAuth.updateProfile(userId, fullName, email, sendedpassword , address, phone, gender, governorate);
    
         
                if (isUpdated) {
                    //alert("Profile updated successfully!");
                    toastr.success("Profile updated successfully!");
                    setTimeout(function() {
                        window.location.reload(); 
                    }, 2000);
                } else {
                    alert("Failed to update profile. Please try again.");
                }
            }
          
            // var validateEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            // if (!validateEmail.test(email)) {
            //     alert("Please enter a valid email address.");
            //     return;
            // }

    
     
    },
    showUserData: async function () {
   
        
            var userId = JSON.parse(localStorage.getItem("clientSession")).sessionData.id;
            var dataUser = await clientAuth.getloggedInUserData(userId);
            console.log(dataUser.password);
            if (dataUser) {
                var nameParts = dataUser.full_name.split(" ");
                document.getElementById("firstName").value = nameParts[0] || "";
                document.getElementById("lastName").value = nameParts[1] || "";
                document.getElementById("email").value = dataUser.email || "";
                document.getElementById("address").value = dataUser.address || "";
                document.getElementById("phone").value = dataUser.phone || "";
                document.getElementById("governorate").value = dataUser.gov || "";
                document.getElementById("gender").value=dataUser.gender||"";
                document.getElementById("currentPassword11").value=dataUser.password||"";
            } else {
                alert("Failed to load user data. Please log in again.");
            }
          //  console.log(document.getElementById("currentPassword").value);
       
    }
};
window.userProfile = userProfile;
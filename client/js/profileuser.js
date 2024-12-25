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
            var currentPassword = document.getElementById("currentPassword").value;
            var newPassword = document.getElementById("newPassword").value;
            var confirmPassword = document.getElementById("confirmPassword").value;

      
            if (newPassword && newPassword !== confirmPassword) {
                document.getElementById("passwordError").classList.remove("d-none");
                return;
            } else {
                document.getElementById("passwordError").classList.add("d-none");
            }

          
            var validateEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!validateEmail.test(email)) {
                alert("Please enter a valid email address.");
                return;
            }

          
            // var validatephone = /^\d{11}$/;
            // if (!validatephone.test(phone)) {
            //     alert("Please enter a valid 11-digit phone number.");
            //     return;
            // }

         
            var userId = JSON.parse(localStorage.getItem("clientSession")).sessionData.id;

        
            var fullName = `${firstName} ${lastName}`;
            var sendedpassword=newPassword==""?currentPassword:newPassword;
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
     
    },

   
    showUserData: async function () {
   
        
            var userId = JSON.parse(localStorage.getItem("clientSession")).sessionData.id;

        
            var dataUser = await clientAuth.getloggedInUserData(userId);
            

            if (dataUser) {
           
                var nameParts = dataUser.full_name.split(" ");
                document.getElementById("firstName").value = nameParts[0] || "";
                document.getElementById("lastName").value = nameParts[1] || "";
                document.getElementById("email").value = dataUser.email || "";
                document.getElementById("address").value = dataUser.address || "";
                document.getElementById("phone").value = dataUser.phone || "";
                document.getElementById("governorate").value = dataUser.gov || "";
                document.getElementById("gender").value=dataUser.gender||"";
                document.getElementById("currentPassword").value=dataUser.password||"";
            } else {
                alert("Failed to load user data. Please log in again.");
            }
       
    }
};
window.userProfile = userProfile;
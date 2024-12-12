//  import { clientAuth } from '../../dashboard-assets/custome-js/Apis/Auth.js';
// // // import {order} from'../../dashboard-assets/custome-js/Apis/orders.js'
// export var userProfile={
//       updateProfile:async function(){
//               //await clientAuth.login("obarnes4@xyz.com",12345);
//                  // Retrieve form values
//                  var firstName=document.getElementById("firstName").value();
//                  var lastName=document.getElementById("lastName").value();
//                  var email=document.getElementById("email").value();
//                  var address=document.getElementById("address").value();
//                  var phone=document.getElementById("phone").value();
//                  var governorate=document.getElementById("governorate").value();
//                  var currentPassword=document.getElementById("currentPassword").value();
        
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

// window.userProfile=userProfile;
import { clientAuth } from '../../dashboard-assets/custome-js/Apis/Auth.js';
export var userProfile={
updateProfile:async function() {

  var firstName = document.getElementById("firstName").value.trim();
  var lastName = document.getElementById("lastName").value.trim();
  var email = document.getElementById("email").value.trim();
  var address = document.getElementById("address").value.trim();
  var phone = document.getElementById("phone").value.trim(); 
  var governorate = document.getElementById("governorate").value;
  var currentPassword = document.getElementById("currentPassword").value.trim();
  var newPassword = document.getElementById("newPassword").value.trim();
  var confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (!firstName || !lastName || !email || !address || !phone || !currentPassword) {
      alert("Please fill in all required fields.");
      return;
  }

  if (newPassword !== confirmPassword) {
      document.getElementById("passwordError").classList.remove("d-none");
      return;
  } else {
      document.getElementById("passwordError").classList.add("d-none");
  }

  try {
     
      var sessionData = JSON.parse(localStorage.getItem("clientSession"));
      if (!sessionData || !sessionData.sessionData || !sessionData.sessionData.id) {
          alert("User is not logged in.");
          return;
      }

      var userId = sessionData.sessionData.id;

 
      var fullName = `${firstName} ${lastName}`;

  
      var isUpdated = await clientAuth.updateProfile(
          userId,
          fullName,
          email,
          newPassword || currentPassword,
          address,
          phone,
          governorate
      );

      if (isUpdated) {
          alert("Profile updated successfully!");

          userProfile.showUserData();
      } else {
          alert("Failed to update profile. Please try again.");
      }
  } catch (error) {
     // console.error("Error updating profile:", error);
     // alert("An error occurred while updating the profile.");
  }
}
}

document.getElementById("updateButton").addEventListener("click", userProfile.updateProfile);


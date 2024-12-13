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
import { dbController } from '../../dashboard-assets/custome-js/indexedDb.js';


export const userProfile = {
  updateProfile: async function () {
    try {
      await dbController.openDataBase();

      
      const firstName = document.getElementById("firstName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();
      const email = document.getElementById("email").value.trim();
      const address = document.getElementById("address").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const governorate = document.getElementById("governorate").value;
      const currentPassword = document.getElementById("currentPassword").value.trim();
      const newPassword = document.getElementById("newPassword").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();

    
    console.log(firstName , " " , lastName , " " , email , " ", address , " " , phone , " " , currentPassword)
    //   if (!firstName || !lastName || !email || !address || !phone || !currentPassword) {
    //     alert("Please fill in all required fields.");
    //     return;
    //   }

      if (newPassword && newPassword !== confirmPassword) {
        document.getElementById("passwordError").classList.remove("d-none");
        return;
      } else {
        document.getElementById("passwordError").classList.add("d-none");
      }

    //   const sessionData = JSON.parse(localStorage.getItem("clientSession"));
    //   if (!sessionData || !sessionData.sessionData || !sessionData.sessionData.id) {
    //     alert("User is not logged in.");
    //     return;
    //   }

      const userId = sessionData.sessionData.id;
      const fullName = `${firstName} ${lastName}`;
      const password = newPassword || currentPassword;

      const isUpdated = await clientAuth.updateProfile(
        1, "ahmednasser", "ahmednasser@gmai.l.com", "12345", " wlglaa street", "0101820858", "elbehira"
      );

      console.log(isUpdated);

      if (isUpdated) {
        alert("Profile updated successfully!");
          
      } else {
        alert("Failed to update profile. Please try again.");
      }

    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  },

  showUserData:function () {
  
    console.log("Refreshing user data...");
  },
};


document.getElementById("updateButton").addEventListener("click", userProfile.updateProfile);



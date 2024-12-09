// window.addEventListener("load",function(){
//         const profileForm = document.querySelector('ProfileUser');
//         const firstNameField = document.getElementById('firstName');
//         const lastNameField = document.getElementById('lastName');
//         const emailField = document.getElementById('email');
//         const addressField = document.getElementById('address');
//         const currentPasswordField = document.getElementById('currentPassword');
//         const newPasswordField = document.getElementById('newPassword');
//         const confirmPasswordField = document.getElementById('confirmPassword');
    
        
//         async function preloadUserData(userId) {
//             try {
//                 const userData = await users.getUserData(userId);
//                 if (userData) {
//                     firstNameField.value = userData.first_name ;
//                     lastNameField.value = userData.last_name ;
//                     emailField.value = userData.email ;
//                     addressField.value = userData.address;
//                 }
//             } catch (error) {
//                 console.error('Error fetching user data:', error);
//             }
//         }
    
        
//         profileForm.addEventListener('submit', async (event) => {
//             event.preventDefault();
    
//             const userId = 
//             const updatedUserData = {
//                 first_name: firstNameField.value,
//                 last_name: lastNameField.value,
//                 email: emailField.value,
//                 address: addressField.value,
//                 password: newPasswordField.value,
//             };
    
            
//             if (newPasswordField.value !== confirmPasswordField.value) {
//                 alert('New Password and Confirm Password must match.');
//                 return;
//             }
    
//             try {
        
//                 const user = await users.getUserData(userId);
//                 if (user) {
                    
//                     user.first_name = updatedUserData.first_name;
//                     user.last_name = updatedUserData.last_name;
//                     user.email = updatedUserData.email;
//                     user.address = updatedUserData.address;
    
                    
//                     if (updatedUserData.password) {
//                         user.password = updatedUserData.password;
//                     }
    
                    
//                     await dbController.updateItem('users', userId, user);
//                     alert('Profile updated successfully!');
//                 } else {
//                     alert('User not found.');
//                 }
//             } catch (error) {
//                 console.error('Error updating user data:', error);
//                 alert('An error occurred while updating the profile.');
//             }
//         });
    
    
//         const currentUserId =
//         preloadUserData(currentUserId);

//     }); //end of load
    

window.addEventListener("load", function() {
    const profileForm = document.querySelector('#ProfileUser');
    const firstNameField = document.getElementById('firstName');
    const lastNameField = document.getElementById('lastName');
    const emailField = document.getElementById('email');
    const addressField = document.getElementById('address');
    const currentPasswordField = document.getElementById('currentPassword');
    const newPasswordField = document.getElementById('newPassword');
    const confirmPasswordField = document.getElementById('confirmPassword');


    async function preloadUserData(userId) {
        try {
            const userData = await users.getUserData(userId);
            if (userData) {
                firstNameField.value = userData.first_name;
                lastNameField.value = userData.last_name;
                emailField.value = userData.email;
                addressField.value = userData.address;
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

   
    preloadUserData(currentUserId);

    profileForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        
        const updatedUserData = {
            first_name: firstNameField.value,
            last_name: lastNameField.value,
            email: emailField.value,
            address: addressField.value,
            password: newPasswordField.value,
        };

       
        if (!updatedUserData.first_name || !updatedUserData.last_name || !updatedUserData.email || !updatedUserData.address) {
            alert('All fields except password must be filled out.');
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(updatedUserData.email)) {
            alert('Please enter a valid email address.');
            return;
        }

    
        if (newPasswordField.value !== confirmPasswordField.value) {
            alert('New Password and Confirm Password must match.');
            return;
        }

        try {
          
            const user = await users.getUserData(currentUserId);
            if (user) {
               
                user.first_name = updatedUserData.first_name;
                user.last_name = updatedUserData.last_name;
                user.email = updatedUserData.email;
                user.address = updatedUserData.address;

              
                if (updatedUserData.password) {
                    user.password = updatedUserData.password;
                }

               
                await dbController.updateItem('users', currentUserId, user);
                alert('Profile updated successfully!');
            } else {
                alert('User not found.');
            }
        } catch (error) {
            console.error('Error updating user data:', error);
            alert('An error occurred while updating the profile.');
        }
    });
});

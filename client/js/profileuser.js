window.addEventListener("load", function () {
  const profileForm = document.getElementById("profileForm");
  const firstNameField = document.getElementById("firstName");
  const lastNameField = document.getElementById("lastName");
  const emailField = document.getElementById("email");
  const addressField = document.getElementById("address");
  const currentPasswordField = document.getElementById("currentPassword");
  const newPasswordField = document.getElementById("newPassword");
  const confirmPasswordField = document.getElementById("confirmPassword");

  const currentUserId = 1;


  async function preloadUserData(userId) {
      try {
          const userData = await clientAuth.getloggedInUserData(userId);
          if (userData) {
              const [firstName, lastName] = userData.full_name.split(' ');
              firstNameField.value = firstName || '';
              lastNameField.value = lastName || '';
              emailField.value = userData.email;
              addressField.value = userData.address;
          }
      } catch (error) {
          console.error('Error fetching user data:', error);
      }
  }

 
  preloadUserData(currentUserId);

  
  profileForm.addEventListener("submit", async (event) => {
      event.preventDefault(); 

      
      const firstName = firstNameField.value.trim();
      const lastName = lastNameField.value.trim();
      const email = emailField.value.trim();
      const address = addressField.value.trim();
      const currentPassword = currentPasswordField.value.trim();
      const newPassword = newPasswordField.value.trim();
      const confirmPassword = confirmPasswordField.value.trim();


      if (!firstName || !lastName) {
          alert('First Name and Last Name cannot be empty.');
          return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          alert('Please enter a valid email address.');
          return;
      }

      if (!address) {
          alert('Address cannot be empty.');
          return;
      }

      if (newPassword && newPassword !== confirmPassword) {
          alert('New Password and Confirm Password must match.');
          return;
      }

      try {
       
          const fullName = `${firstName} ${lastName}`;
          const updatedUserData = {
              first_name: firstName,
              last_name: lastName,
              email: email,
              address: address,
              password: newPassword,
          };

          
          const isUpdated = await clientAuth.updateProfile(
              currentUserId,
              fullName,
              updatedUserData.email,
              updatedUserData.password,
              updatedUserData.address
          );

          if (isUpdated) {
              alert('Profile updated successfully!');
              preloadUserData(currentUserId); 
          } else {
              alert('Failed to update the profile. Please try again.');
          }
      } catch (error) {
          console.error('Error updating user profile:', error);
          alert('An error occurred while updating the profile.');
      }
  });
});

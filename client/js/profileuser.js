window.addEventListener("load",function(){

    document.getElementById("profileForm").addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
      
        // Fetch input values
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const address = document.getElementById("address").value.trim();
        const currentPassword = document.getElementById("currentPassword").value.trim();
        const newPassword = document.getElementById("newPassword").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
      
        // Check if new password and confirm password match
        if (newPassword !== confirmPassword) {
          alert("New Password and Confirm Password do not match.");
          return;
        }
      
        // Prepare the data to send in the API call
        const requestData = {
          firstName,
          lastName,
          email,
          address,
          currentPassword,
          newPassword,
        };
      
        try {
          // Make API call
          const response = await fetch("../../dashboard-assets/data/user-list.json", {
            method: "PUT", // Or PATCH, based on your API
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer YOUR_TOKEN", // Add authentication token if required
            },
            body: JSON.stringify(requestData),
          });
      
          // Handle response
          if (response.ok) {
            const result = await response.json();
            alert("Profile updated successfully!");
            console.log("Updated Profile:", result);
          } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
            console.error("API Error:", errorData);
          }
        } catch (error) {
          console.error("An error occurred:", error);
          alert("An error occurred while updating the profile. Please try again later.");
        }
      });
      
      // Optional: Handle Cancel Button
      document.getElementById("cancelBtn").addEventListener("click", () => {
        // Reset form fields (optional)
        document.getElementById("profileForm").reset();
        alert("Changes discarded.");
      });
      
})//end of load
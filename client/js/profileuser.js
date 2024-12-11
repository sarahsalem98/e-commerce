$("#updateButton").on("click", async function () {
  let lastName = $("#lastName").val();
  let userId = 1;
  let email = $("#email").val();
  let address = $("#address").val();
  let phone = $("#phone").val();
  let currentPassword = $("#currentPassword").val();
  let newPassword = $("#newPassword").val();
  let confirmPassword = $("#confirmPassword").val();
  let firstName = $("#firstName").val();

  if (newPassword !== confirmPassword) {
    $("#passwordError").removeClass("d-none");
    return;
  } else {
    $("#passwordError").addClass("d-none");
  }

  let updated = await updateProfile.updateProfile(
    userId,
    `${firstName} ${lastName}`,
    email,
    newPassword,
    address,
    phone,
    gender,
    governorate
  );
  if (updated) {
    alert("Profile updated successfully!");
  } else {
    alert("Error updating profile. Please try again.");
  }
});

import { dbController } from "../../dashboard-assets/custome-js/indexedDb.js";
import { updateUIBasedOnSession, handleLogout } from './login.js';

(async function () {
    try {
        // Open the database
        await dbController.openDataBase();

    } catch (error) {
        console.error('Error interacting with IndexedDB:', error);
    }
})();

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.querySelector(".contact");

    contactForm.querySelector('input[type="button"]').addEventListener("click", function () {

        const firstName = contactForm.querySelector('input[placeholder="First Name"]').value.trim();
        const lastName = contactForm.querySelector('input[placeholder="Last Name"]').value.trim();
        const email = contactForm.querySelector('input[placeholder="Email"]').value.trim();
        const message = contactForm.querySelector("textarea").value.trim();

        if (!firstName || !lastName || !email || !message) {
            alert("Please fill out all fields.");
            return;
        }

        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        const contactData = {
            firstName,
            lastName,
            email,
            message,
        };

        alert("Thank you for contacting us, " + firstName + "! We'll get back to you soon.");

        contactForm.reset();
        console.log(contactData);
        return contactData;
    });

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
updateUIBasedOnSession();
handleLogout();
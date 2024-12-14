import { dbController } from "../../dashboard-assets/custome-js/indexedDb.js";
import { updateUIBasedOnSession, handleLogout } from './login.js';
import { contactus } from '../../dashboard-assets/custome-js/Apis/contact-us.js';
import { generalClient } from '../../dashboard-assets/custome-js/Apis/general.js'

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

    contactForm.querySelector('input[type="button"]').addEventListener("click", async function () {

        const firstName = contactForm.querySelector('input[placeholder="First Name"]').value.trim();
        const lastName = contactForm.querySelector('input[placeholder="Last Name"]').value.trim();
        const email = contactForm.querySelector('input[placeholder="Email"]').value.trim();
        const message = contactForm.querySelector("textarea").value.trim();

        let rules = {
            'email': { required: true, email: true },
            'message': { required: true }
        }
        let messages = {
            'email': "please enter valid email",
            'message': "pleas enter message"
        }
        var formvalid = await generalClient.validateForm("contact-form", rules, messages);
        if (formvalid) {
            const contactData = {
                firstName,
                lastName,
                email,
                message,
            };
            contactForm.reset();
            var isadded = await contactus.add(contactData.firstName, contactData.lastName, contactData.email, contactData.message);
            if (isadded) {
                toastr.success("message sent successfully");
            } else {
                toastr.error("something went wrong , please try agin later");
            }

        }


    });

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
updateUIBasedOnSession();
handleLogout();
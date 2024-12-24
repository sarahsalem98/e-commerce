import { dbController } from "../../dashboard-assets/custome-js/indexedDb.js";
import { clientAuth } from '../../dashboard-assets/custome-js/Apis/Auth.js';
import { genreal,updateUIBasedOnSession, handleLogout } from "./general.js";
import { generalClient } from "../../dashboard-assets/custome-js/Apis/general.js";

(async function () {
    try {
        await dbController.openDataBase();
        await genreal.updateCartPill();
    } catch (error) {
        console.error('Error interacting with IndexedDB:', error);
    }
})();
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');
    const firstNameInput = form.querySelector('input[placeholder="First Name"]');
    const lastNameInput = form.querySelector('input[placeholder="Last Name"]');
    const emailInput = form.querySelector('input[placeholder="Email"]');
    const phoneInput = form.querySelector('input[placeholder="phone"]');
    const addressInput = form.querySelector('input[placeholder="Address"]');
    const governorateSelect = form.querySelector('#governorate');
    const passwordInput = form.querySelector('input[placeholder="Password"]');
    const confirmPasswordInput = form.querySelector('input[placeholder="confirm Password"]');
    const genderSelect = form.querySelector('#gender');
    const createAccountButton = form.querySelector('input[type="button"]');
    

    createAccountButton.addEventListener('click', async () => {
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const address = addressInput.value.trim();
        const governorate = governorateSelect.value;
        const password = passwordInput.value.trim();
        const gender = +genderSelect.value;
        const confirmPassword = confirmPasswordInput.value.trim();

        // let gender = '';
        // genderInputs.forEach(input => {
        //     if (input.checked) {
        //         gender = parseInt(input.value);
        //     }
        // });


        let rules = {
            'email': { 
                required: true, 
                email: true 
            },
            'password': { 
                required: true, 
                minlength: 8 
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
                minlength: 'Password must be at least 8 characters long.'
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
        

        var isValidform = await generalClient.validateForm("register_form", rules, messages);
        if (isValidform) {

            const userData = {
                name: `${firstName} ${lastName}`,
                email: email,
                password: password,
                address: address,
                phone: phone,
                gender: gender,
                governorate: governorate,
                avatar: ''
            };
            console.log(userData);

            try {
                if ( await checkEmailExists(email)) {
                    toastr.error("this email is already registered please try to login");
                } else {
                    const isAdded = await clientAuth.register(userData.name, userData.email, userData.password, userData.address, userData.phone, userData.gender, userData.governorate, userData.avatar);
                    if (isAdded) {
                        toastr.success("client registered successfully!");
                        window.location.href = "/client/login.html";
                    } else {
                        toastr.error("something went wrong ");
                    }
                }

            } catch (error) {
                console.error('Error during registration:', error);
                alert('An error occurred. Please try again later.');
            }

        }

        // if (!firstName || !lastName || !email || !phone || !address || !governorate || !password || !confirmPassword || !gender) {
        //     alert('Please fill in all fields.');
        //     return;
        // }
        // const namePattern = /^[A-Za-z][A-Za-z0-9\W]{2,}$/;
        // if (!namePattern.test(firstName)) {
        //     alert('First name must contain only letters and spaces.');
        //     return;
        // }

        // if (!namePattern.test(lastName)) {
        //     alert('Last name must contain only letters and spaces.');
        //     return;
        // }

        // const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        // if (!emailPattern.test(email)) {
        //     alert('Please enter a valid email address.');
        //     return;
        // }

        // const emailExists = await checkEmailExists(email);
        // if (emailExists) {
        //     alert('This email is already registered. Please use a different email.');
        //     return;
        // }

        // const phonePattern = /^(010|011|012|015)[0-9]{8}$/;
        // if (!phonePattern.test(phone)) {
        //     alert('Please enter a valid Egyptian phone number (must start with 010, 011, 012, or 015 and have 11 digits).');
        //     return;
        // }

        // if (password.length < 8) {
        //     alert('Password must be at least 8 characters long.');
        //     return;
        // }

        // if (password !== confirmPassword) {
        //     alert('Passwords do not match.');
        //     return;
        // }


    });

    async function checkEmailExists(email) {
        
        const users = await dbController.getItemsByUniqueKey('users', 'email', email);
        return users.length > 0;
    }
});
updateUIBasedOnSession();
handleLogout();

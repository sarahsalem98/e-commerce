import { dbController } from "../../dashboard-assets/custome-js/indexedDb.js";
import { clientAuth } from '../../dashboard-assets/custome-js/Apis/Auth.js';

(async function () {
    try {
        await dbController.openDataBase();
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
    const genderInputs = form.querySelectorAll('input[name="gender"]');
    const createAccountButton = form.querySelector('input[type="button"]');

    createAccountButton.addEventListener('click', async () => {
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const address = addressInput.value.trim();
        const governorate = governorateSelect.value;
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        let gender = '';
        genderInputs.forEach(input => {
            if (input.checked) {
                gender = input.value;
            }
        });

        if (!firstName || !lastName || !email || !phone || !address || !governorate || !password || !confirmPassword || !gender) {
            alert('Please fill in all fields.');
            return;
        }
        const namePattern = /^[A-Za-z][A-Za-z0-9\W]{2,}$/;
        if (!namePattern.test(firstName)) {
            alert('First name must contain only letters and spaces.');
            return;
        }

        if (!namePattern.test(lastName)) {
            alert('Last name must contain only letters and spaces.');
            return;
        }
        
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            alert('This email is already registered. Please use a different email.');
            return;
        }

        const phonePattern = /^(010|011|012|015)[0-9]{8}$/;
        if (!phonePattern.test(phone)) {
            alert('Please enter a valid Egyptian phone number (must start with 010, 011, 012, or 015 and have 11 digits).');
            return;
        }

        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

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

        try {
            const isAdded = await clientAuth.register(userData.name, userData.email, userData.password, userData.address, userData.phone, userData.gender, userData.governorate, userData.avatar);

            if (isAdded) {
                alert('Account created successfully!');
                window.location.href = "/client/login.html";
            } else {
                alert('Failed to create account. Please try again.');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred. Please try again later.');
        }
    });

    async function checkEmailExists(email) {
        const users = await dbController.getItemsByUniqueKey('users', 'email', email);
        return users.length > 0;
    }
});

import { dbController } from "../../dashboard-assets/custome-js/indexedDb.js";
import { clientAuth } from '../../dashboard-assets/custome-js/Apis/Auth.js';

(async function () {
    try {
        
        await dbController.openDataBase();

        document.getElementById('loginForm').addEventListener('click', async function () {

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const isValid = await clientAuth.login(email, password);

                if (isValid) {
                    alert('Login successful!');
                    window.location.href = "/client/products.html";
                } else {
                    alert('Invalid email or password.');
                }
            } catch (authError) {
                console.error("Authentication error:", authError);
                alert('An error occurred during login. Please try again.');
            }
        });

    } catch (error) {
        console.error('Error interacting with IndexedDB:', error);
    }
})();

export function updateUIBasedOnSession() {
    if (clientAuth.checkSession()) {
        document.querySelectorAll(".draw-icons").forEach(element => {
            element.classList.add("d-none");
        });
        document.querySelectorAll(".user-menu").forEach(element => {
            element.classList.remove("d-none");
        });
    } else {
        document.querySelectorAll(".draw-icons").forEach(element => {
            element.classList.remove("d-none");
        });
        document.querySelectorAll(".user-menu").forEach(element => {
            element.classList.add("d-none");
        });
    }
}

export function handleLogout() {
    document.querySelectorAll('.logout').forEach(element => {
        element.addEventListener('click', function (event) {
            event.preventDefault();
            clientAuth.logout();
            window.location.href = "../client/login.html";
            updateUIBasedOnSession();
        });
    })
}




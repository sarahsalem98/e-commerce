 var adminAuth = {
    adminCred: {
        email: "admin@gmail.com",
        password: 123456
    },
    login: function (e) {
        e.preventDefault();

        let email = document.getElementById("admin-login-email").value;
        let password = document.getElementById("admin-login-password").value;
        console.log(email);
        console.log(password);
        if(this.validateFormLogin()){
            if ((email == this.adminCred.email) && (password == parseInt( this.adminCred.password))) {
                let sessionData = {
                    email: email,
                    loginTime: new Date().getTime()
                }
                let expiryTime = new Date().getTime() + 24*60* 60 * 1000;
                localStorage.setItem('adminSession', JSON.stringify({ sessionData, expiryTime }));

                window.location.href = 'dashboard.html';
             
    
            } else {
                toastr.error("invalid credintials");
            }
        }
     
    },
    validateFormLogin: function () {
              console.log("uu");
        var form = $('#admin-login-form');
        if (form.length) {
            form.validate({
                rules: {
                    'admin-login-email': { required: true, email: true },
                    'admin-login-password': { required: true, },

                },
                messages: {
                    'admin-login-email': "Please enter valid email",
                    'admin-login-password': "Please enter password",
                }
            });

            var isValide = form.valid();
            console.log(isValide);
            return isValide;
        }
        return false;
    },
    checkSession: function () {
        let storedSession = JSON.parse(localStorage.getItem('adminSession'));
       
        if (storedSession) {
            let currentTime = new Date().getTime();
            if (currentTime < storedSession.expiryTime) {
                return true;
            } else {
                this.logout();
            }
        }
        return false;
    },

    logout: function () {
        localStorage.removeItem('adminSession');
        window.location.href = 'login.html';
    }

}
var seller = {

}
import { dbController } from "./indexedDb.js";
import { general } from "./general.js";
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
        if (this.validateFormLogin()) {
            if ((email == this.adminCred.email) && (password == parseInt(this.adminCred.password))) {
                let sessionData = {
                    email: email,
                    loginTime: new Date().getTime()
                }
                let expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000;
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

export var seller = {

    login: async function (e) {
        console.log("gffd");
        e.preventDefault();
        let email = document.getElementById("seller-login-email").value;
        let password = document.getElementById("seller-login-password").value;

        if (this.validateFormLogin()) {
            var data = await dbController.getItemsByUniqueKey('sellers', 'email', email);
            console.log(data);
            if (data[0]) {
                if (data[0].status_user == 1) {
                    toastr.error("please wait admin approval");
                } else {
                    if ((email == data[0].email) && (password == data[0].password)) {
                        let sessionData = {
                            id:data[0].id,
                            name:data[0].full_name,
                            email: email,
                            loginTime: new Date().getTime()
                        }
                        let expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000;
                        localStorage.setItem('sellerSession', JSON.stringify({ sessionData, expiryTime }));
                        window.location.href = 'dashboard.html';


                    } else {
                        toastr.error("invalid credintials");
                    }
                }

            } else {
                toastr.error("no user found please register first");
            }

        }

    },
    register: async function (e) {
        e.preventDefault();
        let email = document.getElementById("seller-register-email").value;
        let password = document.getElementById("seller-register-password").value;
        let phone = document.getElementById("seller-register-phone").value;
        let name = document.getElementById("seller-register-name").value;
        let nationalId = document.getElementById("seller-register-nationalId").value;
        let comReg = document.getElementById("seller-register-comReg").value;

        var rules = {
            'seller-register-email': { required: true, email: true },
            'seller-register-password': { required: true },
            'seller-register-name': { required: true },
            //'seller-register-nationalId': { required: true, regex: /^[2-3]\d{13}$/ },

        }
        var messages = {
            'seller-register-email': 'please enter valid email',
            'seller-register-password': 'please enter password',
            'seller-register-name': 'please enter name',
            //'seller-register-nationalId': 'please enter National ID',
        }

        if (general.validateForm('seller-register-form', rules, messages)) {
            var sellerexisted = await dbController.getItemsByUniqueKey('sellers', 'email', email);
            console.log(email);
            if (sellerexisted.length>0) {
                toastr.error("this email is already registered try to login");
            } else {
                var seller = {
                    full_name: name,
                    phone: phone,
                    email: email,
                    status_user: 1,
                    national_id: nationalId,
                    password: password,
                    commercial_registration: comReg
                }

                var done = await dbController.addItem('sellers', seller);
                if (done) {
                    window.location.href = 'successRegister.html';
                } else {
                    toastr.error("something went wrong please try agin later");
                }
            }
        }
    },
    validateFormLogin: function () {
        var form = $('#seller-login-form');
        if (form.length) {
            form.validate({
                rules: {
                    'seller-login-email': { required: true, email: true },
                    'seller-login-password': { required: true, },

                },
                messages: {
                    'seller-login-email': "Please enter valid email",
                    'seller-login-password': "Please enter password",
                }
            });

            var isValide = form.valid();
            console.log(isValide);
            return isValide;
        }
        return false;
    },
    checkSession: function () {
        let storedSession = JSON.parse(localStorage.getItem('sellerSession'));
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
    loadDataProfile:async function(){
        var id=JSON.parse(localStorage.getItem("sellerSession")).sessionData.id;  
        var dataseller=await dbController.getItem("sellers",id);
        document.getElementById("seller-register-email").value=dataseller.email;
        document.getElementById("seller-register-password").value=dataseller.password;
        document.getElementById("seller-register-phone").value=dataseller.phone;
        document.getElementById("seller-register-name").value=dataseller.full_name;
        document.getElementById("seller-register-nationalId").value=dataseller.national_id;
        document.getElementById("seller-register-comReg").value=dataseller.commercial_registration;

    },
    updateProfile: async function(e){
        e.preventDefault();
        var id=JSON.parse(localStorage.getItem("sellerSession")).sessionData.id;               
        let email = document.getElementById("seller-register-email").value;
        let password = document.getElementById("seller-register-password").value;
        let phone = document.getElementById("seller-register-phone").value;
        let name = document.getElementById("seller-register-name").value;
        let nationalId = document.getElementById("seller-register-nationalId").value;
        let comReg = document.getElementById("seller-register-comReg").value;

        var rules = {
            'seller-register-email': { required: true, email: true },
            'seller-register-password': { required: true },
            'seller-register-name': { required: true },
            //'seller-register-nationalId': { required: true, regex: /^[2-3]\d{13}$/ },

        }
        var messages = {
            'seller-register-email': 'please enter valid email',
            'seller-register-password': 'please enter password',
            'seller-register-name': 'please enter name',
            //'seller-register-nationalId': 'please enter National ID',
        }

        if (general.validateForm('seller-edit-form', rules, messages)) {
                var seller = {
                    full_name: name,
                    phone: phone,
                    email: email,
                    status_user: 2,
                    national_id: nationalId,
                    password: password,
                    commercial_registration: comReg
                }
                var done = await dbController.updateItem('sellers',id,seller);
                console.log(done);
                if (done) {
                   toastr.success("the data is updated successfully !")
                } else {
                    toastr.error("something went wrong please try agin later");
                }
            
        }

    },
    logout: function () {
        localStorage.removeItem('sellerSession');
        window.location.href = 'login.html';
    },
    getloggedsellername:function(){
        var name=JSON.parse(localStorage.getItem("sellerSession")).sessionData.name;
        document.getElementById("logged-seller").innerText=name;
    },
    getloggedsellerid:function(){
        var id=JSON.parse(localStorage.getItem("sellerSession")).sessionData.id;
        return id;
    }
}
window.adminAuth = adminAuth;
window.sellerAuth = seller;

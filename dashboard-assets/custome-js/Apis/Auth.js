import { dbController } from "../indexedDb.js";
export var clientAuth = {
    login: async function (email, password) {
        let isValid = false;
        let data = await dbController.getItemsByUniqueKey('users', 'email', email);
        if (data.length > 0) {
            if (data[0].password ==parseInt(password)) {
                isValid = true;
                let sessionData = {
                    email: email,
                    name:data.full_name,
                    id:data.id,
                    loginTime: new Date().getTime()
                }
                let expiryTime = new Date().getTime() + 24*60 * 60 * 1000;
                localStorage.setItem('clientSession', JSON.stringify({ sessionData, expiryTime }));
            }

        }
        console.log(isValid);

    },
    checkSession: function () {
        let storedSession = JSON.parse(localStorage.getItem('clientSession'));

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
        localStorage.removeItem('clientSession');
    },
    register: async function(name,email, password,address,phone,gender,governorate,avatar=""){
         let isAdded=false;
        var user={
            full_name: name,
            username: name,
            email: email,
            address: address,
            phone:phone,
            status_user: 1,
            gov:governorate,
            gender:gender,
            password:password,
            avatar: avatar

        }
       
        isAdded= await dbController.addItem('users',user); 
        return isAdded;
    },
    getloggedInUserData:async function(userId){
        var data= await dbController.getItem('users',userId);
        return data;

    }
}
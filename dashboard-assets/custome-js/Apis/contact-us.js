import { dbController } from "../indexedDb.js";
export var contactus={
      add: async function(first_name,lastName,email,message){
        let isadded=false;
        if(email==null|| email==''||email==undefined){
          isadded=false
        }else{
            var contactData={
                first_name:first_name,
                second_name:lastName,
                email:email,
                message:message
            }
            isadded=await dbController.addItem("contactus",contactData);
            
        }
        return isadded;
      }

}
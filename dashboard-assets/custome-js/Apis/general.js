export var generalClient={

    //example of rules and messages 
    // rules= {
    //     'admin-login-email': { required: true, email: true },
    //     'admin-login-password': { required: true, },         

    // },
    // messages= {
    //     'admin-login-email': "Please enter valid email",
    //     'admin-login-password': "Please enter password",
    // }
    validateForm: function (formId, rules, messages) {
        var form = $(`#${formId}`);
        if (form.length) {
            $.validator.addMethod(
                "regex",
                function (value, element, regex) {
                    return this.optional(element) || regex.test(value);
                },
                "Invalid format."
            );
            
            form.validate({
                rules: rules,
                messages: messages
            });
    
            var isValid = form.valid();
            return isValid;
        }
        return false;
    }
}
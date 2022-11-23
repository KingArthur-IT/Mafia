const validatePassword = (password) => {
    const withoutSpaces = /\s/;
    const uppers = /[A-Z]/; // Есть хотя бы одна буква в верхнем регистре
    const lowers = /[a-z]/; // Есть хотя бы одна буква в нижнем регистре
    const numbers = /\d/; // Есть хотя бы одна цифра
    const special = /[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/; 
    const minMaxLength = /^[\s\S]{8,32}$/;

    return  !withoutSpaces.test(password) && 
            uppers.test(password) && 
            lowers.test(password) && 
            numbers.test(password) && 
            // special.test(password) && 
            minMaxLength.test(password);
};

const validateEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

export {
    validatePassword, validateEmail
}
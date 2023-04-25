const shuffle = (str) => {
    var a = str.split(""),
        n = a.length;
  
    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}

const getJWTCookie = (str, name = 'jwt') => {
    return str.split('; ').reduce((res, item) => { 
        const data = item.trim().split('='); 
        return { ...res, [data[0]] : data[1] }; 
    }, {})[name]
}

module.exports = {
    shuffle, getJWTCookie
}
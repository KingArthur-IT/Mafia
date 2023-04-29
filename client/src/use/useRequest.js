import axios from "axios";

async function sendRequest(url, method = 'GET', data = null){
    return await axios({
        method: method,
        url: url,
        headers: {},
        data: {...data}
    })
        .then((response) => {
            return response
        })
        .catch((error) => {
            return error
        })
}

export {
    sendRequest
}

// { withCredentials: true }
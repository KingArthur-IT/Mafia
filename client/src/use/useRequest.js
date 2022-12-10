import axios from "axios";

async function sendRequest(url, method = 'GET', data = null){
    const apiUrl = 'http://localhost:3000/api';

    return await axios({
        method: method,
        url: apiUrl + url,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            // 'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        ...data
    })
        .then((response) => {
            console.log('from use, res =' + response);
            return response.data
        })
        .catch((error) => {
            console.log('from use, err =' + error);
            return error
        })
}

export {
    sendRequest
}
import axios from 'axios';

const api = axios.create({
    //baseURL:'https://api.finamassa.online/ZmluYW1hc3Nh',
    baseURL:'http://192.168.0.121:3000/ZmluYW1hc3Nh',
    timeout: 20000
});

export default api;
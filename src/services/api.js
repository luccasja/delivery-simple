import axios from 'axios';

const api = axios.create({
    //baseURL:'https://api.finamassa.online/ZmluYW1hc3Nh',
    baseURL:'http://localhost:3000',
    timeout: 20000
});

export default api;
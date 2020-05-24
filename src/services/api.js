import axios from 'axios';

const api = axios.create({
    //baseURL:'https://api.finamassa.online',
    baseURL:'http://192.168.0.120:3000',
    timeout: 20000
});

export default api;
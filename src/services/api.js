import axios from 'axios';

const api = axios.create({
    baseURL:'https://api.finamassa.online',
    timeout: 15000
});

export default api;
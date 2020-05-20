import axios from 'axios';

const api = axios.create({
    baseURL:'https://api.finamassa.online',
});

export default api;
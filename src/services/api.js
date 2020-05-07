import axios from 'axios';

const api = axios.create({
    baseURL:'http://localhost:2525',
});

export default api;
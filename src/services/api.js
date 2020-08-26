import axios from 'axios';
import Config from '../config/global'

const api = axios.create({
    baseURL: Config.api+'ZmluYW1hc3Nh',
    timeout: 30000
});

export default api;
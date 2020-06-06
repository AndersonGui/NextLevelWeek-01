import axios from 'axios';

const api = axios.create({ baseURL: 'http://192.168.0.105:4200' })

export default api;
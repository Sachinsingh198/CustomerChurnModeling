import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000', // Aapke FastAPI ka URL
});

export const predictChurn = (data) => API.post('/predict', data);
import axios from "axios";

const api = axios.create({
  baseURL: "https://bizup.id/api",
});

// untuk mengambil data
export const fetchQuizzes = () => api.get("/quiz");

// untuk menambahkan data ke database
export const createQuiz = (data) => api.post("/quiz", data);

//
export const updateQuiz = (id, data) => api.put(`/quiz/${id}`, data);

//
export const deleteQuiz = (id) => api.delete(`/quiz/${id}`);

export default api;

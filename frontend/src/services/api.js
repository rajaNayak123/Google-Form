import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error || err.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export const questionsApi = {
  getAll: () => api.get("/questions").then((r) => r.data),
  create: (data) => api.post("/questions", data).then((r) => r.data),
  update: (id, data) => api.put(`/questions/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/questions/${id}`),
};

export const formsApi = {
  getAll: () => api.get("/forms").then((r) => r.data),
  getById: (id) => api.get(`/forms/${id}`).then((r) => r.data),
  getBySlug: (slug) => api.get(`/forms/slug/${slug}`).then((r) => r.data),
  create: (data) => api.post("/forms", data).then((r) => r.data),
  update: (id, data) => api.put(`/forms/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/forms/${id}`),
};

export const responsesApi = {
  submit: (slug, answers) =>
    api.post(`/f/${slug}/responses`, { answers }).then((r) => r.data),
  getForForm: (formId) =>
    api.get(`/forms/${formId}/responses`).then((r) => r.data),
};


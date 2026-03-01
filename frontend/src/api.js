const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Request failed");
  return json.data;
}

export const api = {
  getLogs:    ()           => request("/logs"),
  createLog:  (payload)    => request("/logs", { method: "POST", body: JSON.stringify(payload) }),
  deleteLog:  (id)         => request(`/logs/${id}`, { method: "DELETE" }),
  updateLog:  (id, payload)=> request(`/logs/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
};

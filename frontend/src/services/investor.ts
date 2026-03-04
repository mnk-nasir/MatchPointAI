import api from "./api";

export const investorService = {
  async getDashboardStats() {
    const res = await api.get("/investor/dashboard-stats");
    return res.data;
  },
  async getRecentStartups(limit = 5) {
    const res = await api.get("/startups", { params: { limit } });
    // Support both {results: []} and [] shapes
    const data: any = res.data;
    return Array.isArray(data) ? data : data?.results || [];
  },
  async getEvaluationDetail(id: string) {
    const res = await api.get(`/evaluations/${id}/`);
    return res.data;
  },
};

const backendDomain =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api/v1/";

export const summaryApi = {
  Boards: {
    url: `${backendDomain}boards/`,
  },
  Columns: {
    url: `${backendDomain}columns/`,
  },
  Tasks: {
    url: `${backendDomain}tasks/`,
  },
};

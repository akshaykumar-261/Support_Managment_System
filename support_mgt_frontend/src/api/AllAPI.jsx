import axiosInstance from "./axiosInstance.jsx";

// Helper function to get token header dynamically
const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 1. Tickets Services
export const fetchTickets = async ({
  statusFilter,
  priorityFilter,
  page,
  perPage,
}) => {
  const params = { page, limit: perPage };
  if (statusFilter) params.status = statusFilter;
  if (priorityFilter) params.priority = priorityFilter;

  const response = await axiosInstance.get("/ticket/getTicketListByAdmin", {
    headers: getAuthHeader(),
    params,
  });
  return response.data.data.tickets;
};

export const fetchSingleTicket = async (id) => {
  const response = await axiosInstance.get("/ticket/getTicketListByAdmin", {
    headers: getAuthHeader(),
    params: { page: 1, limit: 1000 },
  });

  const tickets = response.data?.data?.tickets?.data || [];
  const foundTicket = tickets.find((t) => String(t.id) === String(id));

  if (!foundTicket) throw new Error("Ticket Not Found");
  return foundTicket;
};

export const updateTicketStatus = async ({ id, status }) => {
  const response = await axiosInstance.put(
    `/ticket/updateTicketStatus/${id}`,
    { status },
    { headers: getAuthHeader() },
  );
  return response.data;
};

export const updateTicketPriority = async ({ id, priority }) => {
  const response = await axiosInstance.put(
    `/ticket/updateTicketPriority/${id}`,
    { priority },
    { headers: getAuthHeader() },
  );
  return response.data;
};

export const fetchDahboardData = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await axiosInstance.get("/ticket/adminDashBoard", {
    headers: token ? { Authorization: `Beare ${token}` } : {}, 
  });
  return response.data.data.dashboard;
};

export const fetchOpenTickets = async () => {
  const response = await axiosInstance.get(
    "/ticket/getTicketListByAdmin?status=open",
    {
      headers: getAuthHeader(),
    },
  );
  return response.data?.data?.tickets?.data || [];
};

export const deleteTicket = async (ticketId) => {
  return axiosInstance.delete(`/ticket/deleteTicket/${ticketId}`, {
    headers: getAuthHeader(),
  });
};

export const assignTicket = async ({ ticketId, agentId }) => {
  return axiosInstance.post(
    `/ticket/assignTicket/${ticketId}`,
    { agent_Id: agentId },
    { headers: getAuthHeader() },
  );
};

// 2. Agents Services
export const fetchAgents = async () => {
  const response = await axiosInstance.get("/ticket/getAgentsList", {
    headers: getAuthHeader(),
  });
  return response.data?.data?.users || [];
};

export const fetchAgentsList = async ({
  page,
  perPage,
  name,
  email,
  status,
}) => {
  let url = `/users/getUser?page=${page + 1}&limit=${perPage}&role=Agent`;
  if (name) url += `&name=${name}`;
  if (email) url += `&email=${email}`;
  if (status !== "all") url += `&is_active=${status}`;

  const response = await axiosInstance.get(url);
  const dataPayload = response.data;

  let finalRows = [];
  let finalCount = 0;

  if (
    dataPayload?.data?.data?.rows &&
    Array.isArray(dataPayload.data.data.rows)
  ) {
    finalRows = dataPayload.data.data.rows;
    finalCount = dataPayload.data.data.count;
  } else if (dataPayload?.data?.rows && Array.isArray(dataPayload.data.rows)) {
    finalRows = dataPayload.data.rows;
    finalCount = dataPayload.data.count;
  } else if (dataPayload?.rows && Array.isArray(dataPayload.rows)) {
    finalRows = dataPayload.rows;
    finalCount = dataPayload.count;
  } else if (dataPayload?.data?.data && Array.isArray(dataPayload.data.data)) {
    finalRows = dataPayload.data.data;
    finalCount = dataPayload.data.data.length;
  } else if (dataPayload?.data && Array.isArray(dataPayload.data)) {
    finalRows = dataPayload.data;
    finalCount = dataPayload.data.length;
  } else if (Array.isArray(dataPayload)) {
    finalRows = dataPayload;
    finalCount = dataPayload.length;
  }

  if (finalRows.length === 0 && dataPayload) {
    const l1 = dataPayload;
    const l2 = dataPayload?.data;
    const l3 = dataPayload?.data?.data;

    const scanForArray = (obj) => {
      if (!obj || typeof obj !== "object") return null;
      return Object.values(obj).find((val) => Array.isArray(val));
    };

    const foundArray = scanForArray(l3) || scanForArray(l2) || scanForArray(l1);
    const foundCount = l3?.count || l2?.count || l1?.count;

    if (foundArray) {
      finalRows = foundArray;
      finalCount = foundCount || foundArray.length;
    }
  }

  return {
    rows: finalRows,
    count: Number(finalCount) || finalRows.length,
  };
};

export const createAgentProfile = async (formDataPayload) => {
  const response = await axiosInstance.post("users/create", formDataPayload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// 3. Ticket History & Department Services
export const fetchTicketHistoryList = async (agentId = "") => {
  const url = agentId
    ? `/ticketHistory/getAgentHistory/${agentId}`
    : "/ticketHistory/getTicketList";

  const response = await axiosInstance.get(url, { headers: getAuthHeader() });
  return response.data?.data?.history || [];
};

export const fetchDepartments = async () => {
  try {
    const response = await axiosInstance.get("/department/getDepartmentList", {
      headers: getAuthHeader(),
    });
    return response.data?.data?.departments || [];
  } catch (err) {
    return [
      { id: 1, name: "Billing" },
      { id: 2, name: "Technical Support" },
      { id: 3, name: "Sales" },
    ];
  }
};

export const fetchTicketTimeline = async (ticketId) => {
  if (!ticketId) return [];
  const response = await axiosInstance.get(
    `/ticketHistory/getTicketHistoryList/${ticketId}`,
    {
      headers: getAuthHeader(),
    },
  );
  return response.data?.data?.ticketId || [];
};

export const reassignTicket = async (formData) => {
  const response = await axiosInstance.post(
    "/ticketHistory/reAssignTicket",
    formData,
    {
      headers: getAuthHeader(),
    },
  );
  return response.data;
};

export const deleteHistoryRecord = async (logId) => {
  return axiosInstance.delete(`/ticketHistory/deleteHistory/${logId}`, {
    headers: getAuthHeader(),
  });
};

// 4. Customer Support Services
export const fetchCustomerTickets = async (userId) => {
  if (!userId) return [];
  const response = await axiosInstance.get(
    `/ticket/getTicketByCustomer/${userId}`,
  );

  if (response.data && response.data.data) {
    const ticketData = response.data.data.ticket;
    return Array.isArray(ticketData)
      ? ticketData
      : ticketData
        ? [ticketData]
        : [];
  }
  return [];
};

export const createCustomerTicket = async (formData) => {
  const response = await axiosInstance.post("/ticket/createTicket", formData);
  return response.data;
};
export const fetchCustomersList = async ({
  page,
  perPage,
  name,
  email,
  status,
}) => {
  let url = `/users/getUser?page=${page + 1}&limit=${perPage}&role=Customer`;

  if (name) url += `&name=${name}`;
  if (email) url += `&email=${email}`;
  if (status !== "all") url += `&is_active=${status}`;

  const response = await axiosInstance.get(url);
  const dataPayload = response.data;

  let finalRows = [];
  let finalCount = 0;

  if (!dataPayload) return { rows: [], count: 0 };

  // --- DEEP NESTING EXTRACTION LOGIC ---
  if (
    dataPayload?.data?.data?.rows &&
    Array.isArray(dataPayload.data.data.rows)
  ) {
    finalRows = dataPayload.data.data.rows;
    finalCount = dataPayload.data.data.count;
  } else if (dataPayload?.data?.rows && Array.isArray(dataPayload.data.rows)) {
    finalRows = dataPayload.data.rows;
    finalCount = dataPayload.data.count;
  } else if (dataPayload?.rows && Array.isArray(dataPayload.rows)) {
    finalRows = dataPayload.rows;
    finalCount = dataPayload.count;
  } else if (dataPayload?.data?.data && Array.isArray(dataPayload.data.data)) {
    finalRows = dataPayload.data.data;
    finalCount = dataPayload.data.data.length;
  } else if (dataPayload?.data && Array.isArray(dataPayload.data)) {
    finalRows = dataPayload.data;
    finalCount = dataPayload.data.length;
  } else if (Array.isArray(dataPayload)) {
    finalRows = dataPayload;
    finalCount = dataPayload.length;
  }

  // --- ULTRA BLACK-BOX FALLBACK ---
  if (finalRows.length === 0) {
    const l1 = dataPayload;
    const l2 = dataPayload?.data;
    const l3 = dataPayload?.data?.data;

    const scanForArray = (obj) => {
      if (!obj || typeof obj !== "object") return null;
      return Object.values(obj).find((val) => Array.isArray(val));
    };

    const foundArray = scanForArray(l3) || scanForArray(l2) || scanForArray(l1);
    const foundCount = l3?.count || l2?.count || l1?.count;

    if (foundArray) {
      finalRows = foundArray;
      finalCount = foundCount || foundArray.length;
    }
  }

  return {
    rows: finalRows,
    count: Number(finalCount) || finalRows.length,
  };
};
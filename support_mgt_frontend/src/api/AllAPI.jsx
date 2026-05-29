import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance.jsx";
const fetchTickets = async ({
  statusFilter,
  priorityFilter,
  page,
  perPage,
}) => {
  const token = localStorage.getItem("accessToken");
  const headers = {
    Authorization: token ? `Bearer ${token}` : "",
  };
  const params = {};
  if (statusFilter) {
    params.status = statusFilter;
  }
  if (priorityFilter) {
    params.priority = priorityFilter;
  }
  params.page = page;
  params.limit = perPage;
  const response = await axiosInstance.get("/ticket/getTicketListByAdmin", {
    headers,
    params,
  });
  return response.data.data.tickets;
};
export const useGetAllTickets = ({
  statusFilter,
  priorityFilter,
  page,
  perPage,
}) => {
  return useQuery({
    queryKey: ["tickets", statusFilter, priorityFilter, page, perPage],

    queryFn: () =>
      fetchTickets({
        statusFilter,
        priorityFilter,
        page,
        perPage,
      }),

    keepPreviousData: true,
  });
};

const fetchSingleTicket = async (id) => {
  const token = localStorage.getItem("accessToken");

  const headers = {
    Authorization: token ? `Bearer ${token}` : "",
  };

  const response = await axiosInstance.get("/ticket/getTicketListByAdmin", {
    headers,
    params: {
      page: 1,
      limit: 1000,
    },
  });

  const tickets = response.data?.data?.tickets?.data || [];

  const foundTicket = tickets.find((t) => String(t.id) === String(id));

  if (!foundTicket) {
    throw new Error("Ticket Not Found");
  }

  return foundTicket;
};

export const useGetSingleTicket = (id) => {
  return useQuery({
    queryKey: ["single-ticket", id],

    queryFn: () => fetchSingleTicket(id),

    enabled: !!id,
  });
};

const updateTicketStatus = async ({ id, status }) => {
  const token = localStorage.getItem("accessToken");

  const headers = {
    Authorization: token ? `Bearer ${token}` : "",
  };

  const response = await axiosInstance.put(
    `/ticket/updateTicketStatus/${id}`,
    { status },
    { headers },
  );

  return response.data;
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTicketStatus,

    onSuccess: () => {
      queryClient.invalidateQueries(["single-ticket"]);
      queryClient.invalidateQueries(["tickets"]);
    },
  });
};

const updateTicketPriority = async ({ id, priority }) => {
  const token = localStorage.getItem("accessToken");
  const headers = {
    Authorization: token ? `Bearer ${token}` : "",
  };
  const response = await axiosInstance.put(
    `/ticket/updateTicketPriority/${id}`,
    { priority },
    { headers },
  );
  return response.data;
};

export const useUpdateTicketPriority = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTicketPriority,
    onSuccess: () => {
      queryClient.invalidateQueries(["single-ticket"]);
      queryClient.invalidateQueries(["tickets"]);
    },
  });
};

const fetchDahboardData = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await axiosInstance.get("/ticket/adminDashBoard", {
    headers: {
      Authorization: token ? `Beare ${token}` : "",
    },
  });
  return response.data.data.dashboard;
};
export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard-data"],
    queryFn: fetchDahboardData,
    staleTime: 1000 * 60 * 5,
  });
};
const fetchOpenTickets = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await axiosInstance.get(
    "/ticket/getTicketListByAdmin?status=open",
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
  );

  return response.data?.data?.tickets?.data || [];
};

export const useOpenTickets = () => {
  return useQuery({
    queryKey: ["open-tickets"],

    queryFn: fetchOpenTickets,
  });
};
const fetchAgents = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await axiosInstance.get("/ticket/getAgentsList", {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return response.data?.data?.users || [];
};
export const useAgents = () => {
  return useQuery({
    queryKey: ["agents"],

    queryFn: fetchAgents,
  });
};
const deleteTicket = async (ticketId) => {
  const token = localStorage.getItem("accessToken");

  return axiosInstance.delete(`/ticket/deleteTicket/${ticketId}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
};

export const useDeleteTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["open-tickets"],
      });
    },
  });
};
const assignTicket = async ({ ticketId, agentId }) => {
  const token = localStorage.getItem("accessToken");

  return axiosInstance.post(
    `/ticket/assignTicket/${ticketId}`,
    {
      agent_Id: agentId,
    },
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
  );
};
export const useAssignTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["open-tickets"],
      });
    },
  });
};

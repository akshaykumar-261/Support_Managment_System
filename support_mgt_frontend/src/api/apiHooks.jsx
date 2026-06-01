import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "./AllAPI.jsx";
export const useGetAllTickets = ({
  statusFilter,
  priorityFilter,
  page,
  perPage,
}) => {
  return useQuery({
    queryKey: ["tickets", statusFilter, priorityFilter, page, perPage],
    queryFn: () =>
      api.fetchTickets({ statusFilter, priorityFilter, page, perPage }),
    keepPreviousData: true,
  });
};

export const useGetSingleTicket = (id) => {
  return useQuery({
    queryKey: ["single-ticket", id],
    queryFn: () => api.fetchSingleTicket(id),
    enabled: !!id,
  });
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateTicketStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["single-ticket"]);
      queryClient.invalidateQueries(["tickets"]);
    },
  });
};

export const useUpdateTicketPriority = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateTicketPriority,
    onSuccess: () => {
      queryClient.invalidateQueries(["single-ticket"]);
      queryClient.invalidateQueries(["tickets"]);
    },
  });
};

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard-data"],
    queryFn: api.fetchDahboardData,
    staleTime: 1000 * 60 * 5,
  });
};

export const useOpenTickets = () => {
  return useQuery({
    queryKey: ["open-tickets"],
    queryFn: api.fetchOpenTickets,
  });
};

export const useDeleteTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["open-tickets"] });
    },
  });
};

export const useAssignTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.assignTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["open-tickets"] });
    },
  });
};

export const useAgents = () => {
  return useQuery({
    queryKey: ["agents"],
    queryFn: api.fetchAgents,
  });
};

export const useGetAgentsManagedList = ({
  page,
  perPage,
  name,
  email,
  status,
}) => {
  return useQuery({
    queryKey: ["managed-agents", page, perPage, name, email, status],
    queryFn: () => api.fetchAgentsList({ page, perPage, name, email, status }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateAgentProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createAgentProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["managed-agents"]);
    },
  });
};


export const useGetTicketHistory = (agentId) => {
  return useQuery({
    queryKey: ["ticket-history", agentId],
    queryFn: () => api.fetchTicketHistoryList(agentId),
  });
};

export const useGetDepartments = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: api.fetchDepartments,
  });
};

export const useGetTicketTimeline = (ticketId) => {
  return useQuery({
    queryKey: ["ticket-timeline", ticketId],
    queryFn: () => api.fetchTicketTimeline(ticketId),
    enabled: false,
  });
};

export const useReassignTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.reassignTicket,
    onSuccess: () => {
      queryClient.invalidateQueries(["ticket-history"]);
    },
  });
};

export const useDeleteHistoryRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteHistoryRecord,
    onSuccess: () => {
      queryClient.invalidateQueries(["ticket-history"]);
    },
  });
};

export const useGetCustomerTickets = (userId) => {
  return useQuery({
    queryKey: ["customer-tickets", userId],
    queryFn: () => api.fetchCustomerTickets(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 1,
  });
};

export const useCreateCustomerTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createCustomerTicket,
    onSuccess: () => {
      queryClient.invalidateQueries(["customer-tickets"]);
    },
  });
};

export const useGetCustomersManagedList = ({
  page,
  perPage,
  name,
  email,
  status,
}) => {
  return useQuery({
    queryKey: ["managed-customers", page, perPage, name, email, status],
    queryFn: () =>
      api.fetchCustomersList({ page, perPage, name, email, status }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 2, 
  });
};

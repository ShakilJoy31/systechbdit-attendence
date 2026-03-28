import { SMS, SMSResponse, SMSStats } from "@/utils/interface/smsConfiguration";
import { apiSlice } from "../apiSlice";
import { SMSSendResponse } from "@/utils/interface/sendSmsInterface";
import { SMSHistoryFilters, SMSHistoryResponse } from "@/utils/interface/smsHistoryInterface";

// Add Payment Interfaces
export interface PaymentTransaction {
  id: number;
  transactionId: string;
  amount: string;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: string;
  cardType: string | null;
  cardIssuer: string | null;
  cardBrand: string | null;
  bankTransactionId: string | null;
  valId: string | null;
  riskLevel: string | null;
  errorMessage: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface UserPaymentsResponse {
  success: boolean;
  message: string;
  data: {
    userId: number;
    totalTransactions: number;
    transactions: PaymentTransaction[];
  };
}

export interface PaymentStatusResponse {
  success: boolean;
  message: string;
  data: {
    transaction: PaymentTransaction;
    user: unknown | null;
    userData: unknown | null;
  };
}

export interface ProcessPaymentRequest {
  userId: number | string;
  amount: number;
  paymentMethod: string;
  payload: unknown;
}

export interface ProcessPaymentResponse {
  success: boolean;
  message: string;
  data: {
    gatewayUrl: string;
    transactionId: string;
  };
}

export const smsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all SMS for a client
    getClientSMS: builder.query<SMSResponse, {
      clientId: string | number;
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      type?: string;
    }>({
      query: ({ clientId, page = 1, limit = 10, ...params }) => {
        const queryParams = new URLSearchParams();
        queryParams.append('page', page.toString());
        queryParams.append('limit', limit.toString());

        if (params.search) queryParams.append('search', params.search);
        if (params.status) queryParams.append('status', params.status);
        if (params.type) queryParams.append('type', params.type);

        return {
          url: `/sms-configurations/${clientId}/all?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ['SMS'],
    }),

    // Get SMS stats for a client
    getSMSStats: builder.query<{ data: SMSStats; message: string }, string | number>({
      query: (clientId) => `/sms-configurations/${clientId}/stats`,
    }),

    // Get single SMS config
    getSMSById: builder.query<{ data: SMS; message: string }, { clientId: string | number; id: string | number }>({
      query: ({ clientId, id }) => `/sms-configurations/${clientId}/get/${id}`,
      providesTags: (_result, _error, { id }) => [{ type: 'SMS', id }],
    }),

    // Create SMS config
    createSMS: builder.mutation<{ data: SMS; message: string }, { clientId: string | number; data: Partial<SMS> }>({
      query: ({ clientId, data }) => ({
        url: `/sms-configurations/${clientId}/create`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SMS'],
    }),

    // Update SMS config
    updateSMS: builder.mutation<{ data: SMS; message: string }, { clientId: string | number; id: string | number; data: Partial<SMS> }>({
      query: ({ clientId, id, data }) => ({
        url: `/sms-configurations/${clientId}/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'SMS', id }, 'SMS'],
    }),

    // Delete SMS config
    deleteSMS: builder.mutation<{ message: string }, { clientId: string | number; id: string | number }>({
      query: ({ clientId, id }) => ({
        url: `/sms-configurations/${clientId}/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SMS'],
    }),

    // Test SMS config
    testSMS: builder.mutation<{ data; message: string }, { clientId: string | number; id: string | number; phoneNumber: string; customMessage?: string }>({
      query: ({ clientId, id, ...data }) => ({
        url: `/sms-configurations/${clientId}/test/${id}`,
        method: 'POST',
        body: data,
      }),
    }),

    // Toggle SMS status
    toggleSMSStatus: builder.mutation<{ data: { id: number; status: boolean }; message: string }, { clientId: string | number; id: string | number }>({
      query: ({ clientId, id }) => ({
        url: `/sms-configurations/${clientId}/toggle-status/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'SMS', id }, 'SMS'],
    }),

    //! SMS sending api
    sendSMS: builder.mutation<SMSSendResponse, {
      clientId: string | number;
      configId: string | number;
      phoneNumbers: string[];
      messages?: string[];
    }>({
      query: ({ clientId, configId, phoneNumbers, messages }) => ({
        url: `/sms/${clientId}/send`,
        method: 'POST',
        body: {
          configId,
          phoneNumbers,
          ...(messages && { messages })
        },
      }),
      invalidatesTags: ['SMS'],
    }),

    //! SMS History API (Admin)
    getSMSHistory: builder.query<SMSHistoryResponse, SMSHistoryFilters>({
      query: (filters) => {
        const queryParams = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            queryParams.append(key, value.toString());
          }
        });

        return {
          url: `/sms/history?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['SMSHistory'],
    }),

    //! ========== PAYMENT ENDPOINTS ==========

    // Get user payments by user ID
    getUserPayments: builder.query<UserPaymentsResponse, string | number>({
      query: (userId) => ({
        url: `/payment/user/${userId}`,
        method: 'GET',
      }),
      providesTags: (result, error, userId) => [{ type: 'Payments', id: userId }],
    }),

    // Get specific payment status by transaction ID
    getPaymentStatus: builder.query<PaymentStatusResponse, string>({
      query: (transactionId) => ({
        url: `/payment/status/${transactionId}`,
        method: 'GET',
      }),
      providesTags: (result, error, transactionId) => [{ type: 'Payment', id: transactionId }],
    }),

    // Process new payment
    processPayment: builder.mutation<ProcessPaymentResponse, ProcessPaymentRequest>({
      query: (paymentData) => ({
        url: `/payment/process-payment`,
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'Payments', id: userId }],
    }),
  }),
});

export const {
  useGetClientSMSQuery,
  useGetSMSStatsQuery,
  useGetSMSByIdQuery,
  useCreateSMSMutation,
  useUpdateSMSMutation,
  useDeleteSMSMutation,
  useTestSMSMutation,
  useToggleSMSStatusMutation,
  useSendSMSMutation,
  useGetSMSHistoryQuery,
  // Payment hooks
  useGetUserPaymentsQuery,
  useGetPaymentStatusQuery,
  useProcessPaymentMutation,
} = smsApi;
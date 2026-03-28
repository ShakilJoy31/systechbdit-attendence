// redux/api/authentication/authApi.ts
import { apiSlice } from "../apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Existing client login
    login: builder.mutation({
      query: (credentials: { email: string; password: string }) => ({
        url: "/authentication/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Client"],
    }),

    // Enterprise login with phone number
    enterpriseLogin: builder.mutation({
      query: (credentials: { phoneNo: string; password: string }) => ({
        url: "/authentication/login-enterprise",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Enterprise"],
    }),

    // Employee login with phone number
    employeeLogin: builder.mutation({
      query: (credentials: { phoneNo: string; password: string }) => ({
        url: "/authentication/login-employee",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Employee"],
    }),

    registerClient: builder.mutation({
      query: (clientData: {
        fullName: string;
        photo?: string;
        dateOfBirth: string;
        age: number;
        sex: string;
        nidOrPassportNo: string;
        nidPhotoFrontSide?: string;
        nidPhotoBackSide?: string;
        mobileNo: string;
        email: string;
        password: string;
        status: string;
        role: string;
      }) => ({
        url: "/authentication/register-new-client",
        method: "POST",
        body: clientData,
      }),
      invalidatesTags: ["Client"],
    }),

    // Register enterprise
    registerEnterprise: builder.mutation({
      query: (enterpriseData: {
        companyName: string;
        tradeLicenseNo?: string;
        binNo?: string;
        tinNo?: string;
        ownerName: string;
        ownerPhoto?: string;
        ownerNidOrPassportNo?: string;
        ownerNidFrontSide?: string;
        ownerNidBackSide?: string;
        phoneNo: string;
        email: string;
        website?: string;
        address: string;
        city: string;
        state: string;
        postalCode?: string;
        country?: string;
        businessType?: string;
        yearOfEstablishment?: number;
        numberOfEmployees?: number;
        bankName?: string;
        bankAccountNo?: string;
        bankBranch?: string;
        status?: string;
        role?: string;
        notes?: string;
        password?: string;
      }) => ({
        url: "/authentication/register-enterprise",
        method: "POST",
        body: enterpriseData,
      }),
      invalidatesTags: ["Enterprise"],
    }),

    updateClient: builder.mutation({
      query: ({ id, ...data }: { id: number;[key: string]: unknown }) => ({
        url: `/authentication/update-client/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Client', id },
        { type: 'Client', id: 'LIST' },
      ],
    }),

    // Update enterprise
    updateEnterprise: builder.mutation({
      query: ({ id, ...data }: { id: number;[key: string]: unknown }) => ({
        url: `/authentication/update-enterprise/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Enterprise', id },
        { type: 'Enterprise', id: 'LIST' },
      ],
    }),

    getAllClients: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        status = "",
        role = "client"
      }: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        role?: string;
      }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (search) params.append("search", search);
        if (status) params.append("status", status);
        if (role) params.append("role", role);

        return {
          url: `/authentication/get-clients?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) => {
        return result?.data
          ? [
            ...result.data.map(({ id }: { id: string }) => ({ type: 'Client' as const, id })),
            { type: 'Client', id: 'LIST' },
          ]
          : [{ type: 'Client', id: 'LIST' }];
      },
    }),

    // Get all enterprises
    getAllEnterprises: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        status = "",
        city = ""
      }: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        city?: string;
      }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (search) params.append("search", search);
        if (status) params.append("status", status);
        if (city) params.append("city", city);

        return {
          url: `/authentication/get-enterprises?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) => {
        return result?.data
          ? [
            ...result.data.map(({ id }: { id: string }) => ({ type: 'Enterprise' as const, id })),
            { type: 'Enterprise', id: 'LIST' },
          ]
          : [{ type: 'Enterprise', id: 'LIST' }];
      },
    }),

    getClientById: builder.query({
      query: (id: string) => ({
        url: `/authentication/get-client-according-to-id/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: 'Client', id }],
    }),

    // Get enterprise by ID
    getEnterpriseById: builder.query({
      query: (id: string) => ({
        url: `/authentication/get-enterprise/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: 'Enterprise', id }],
    }),

    getPendingClientForAccountActivatoinById: builder.query({
      query: (id: string) => ({
        url: `/authentication/get-pending-client-for-account-activation/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: 'Client', id }],
    }),

    // Get pending enterprise for activation
    getPendingEnterpriseForActivationById: builder.query({
      query: (id: string) => ({
        url: `/authentication/get-pending-enterprise-for-activation/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: 'Enterprise', id }],
    }),

    deleteClient: builder.mutation({
      query: (id: number) => ({
        url: `/authentication/delete-client/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Client', id: 'LIST' }],
    }),

    // Delete enterprise
    deleteEnterprise: builder.mutation({
      query: (id: number) => ({
        url: `/authentication/delete-enterprise/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Enterprise', id: 'LIST' }],
    }),

    updateClientStatus: builder.mutation({
      query: ({ id, status }: { id: number; status: 'active' | 'pending' | 'inactive' }) => ({
        url: `/authentication/update-client/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Client', id },
        { type: 'Client', id: 'LIST' },
      ],
    }),

    // Update enterprise status
    updateEnterpriseStatus: builder.mutation({
      query: ({ id, status }: { id: number; status: 'active' | 'pending' | 'inactive' }) => ({
        url: `/authentication/update-enterprise-status/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Enterprise', id },
        { type: 'Enterprise', id: 'LIST' },
      ],
    }),

    changePassword: builder.mutation({
      query: ({ id, currentPassword, newPassword, confirmNewPassword }: {
        id: string;
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
      }) => ({
        url: `/authentication/change-password/${id}`,
        method: 'PUT',
        body: { currentPassword, newPassword, confirmNewPassword },
      }),
    }),

    // Change enterprise password
    changeEnterprisePassword: builder.mutation({
      query: ({ id, currentPassword, newPassword, confirmNewPassword }: {
        id: string;
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
      }) => ({
        url: `/authentication/change-enterprise-password/${id}`,
        method: 'PUT',
        body: { currentPassword, newPassword, confirmNewPassword },
      }),
    }),

    // Get enterprise statistics
    getEnterpriseStats: builder.query({
      query: () => ({
        url: '/authentication/get-enterprise-stats',
        method: 'GET',
      }),
      providesTags: ['Enterprise'],
    }),

    //! User payment api______________________________
    processPayment: builder.mutation({
      query: (data) => ({
        url: '/payment/process-payment',
        method: 'POST',
        body: data,
      }),
    }),

    processRechargePayment: builder.mutation({
      query: (data) => ({
        url: '/payment/process-recharge',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'Payments', id: userId }],
    }),

    refreshToken: builder.mutation({
      query: (refreshToken: string) => ({
        url: "/authentication/refresh",
        method: "POST",
        body: { refreshToken },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useEnterpriseLoginMutation,
  useEmployeeLoginMutation,
  useRegisterClientMutation,
  useRegisterEnterpriseMutation,
  useUpdateClientMutation,
  useUpdateEnterpriseMutation,
  useGetAllClientsQuery,
  useGetAllEnterprisesQuery,
  useGetClientByIdQuery,
  useGetEnterpriseByIdQuery,
  useGetPendingClientForAccountActivatoinByIdQuery,
  useGetPendingEnterpriseForActivationByIdQuery,
  useRefreshTokenMutation,
  useDeleteClientMutation,
  useDeleteEnterpriseMutation,
  useUpdateClientStatusMutation,
  useUpdateEnterpriseStatusMutation,
  useChangePasswordMutation,
  useChangeEnterprisePasswordMutation,
  useGetEnterpriseStatsQuery,
  useProcessPaymentMutation,
  useProcessRechargePaymentMutation
} = authApi;
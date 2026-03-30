import { apiSlice } from "../apiSlice";

export interface WifiIpConfig {
    id: number;
    ipAddress: string;
    name: string;
    isActive: boolean;
    createdBy?: number;
    updatedBy?: number;
    createdAt: string;
    updatedAt: string;
}

export interface WifiIpConfigResponse {
    success: boolean;
    message: string;
    data: WifiIpConfig[];
    pagination?: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        itemsPerPage: number;
    };
}

export interface WifiIpConfigStatsResponse {
    success: boolean;
    message: string;
    data: {
        total: number;
        active: number;
        inactive: number;
        recentlyAdded: number;
    };
}

export interface IpValidationResponse {
    success: boolean;
    message: string;
    data: {
        ipAddress: string;
        isValid: boolean;
        config: {
            id: number;
            name: string;
        } | null;
    };
}

export const wifiIpConfigApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Create new IP configuration
        createIpConfig: builder.mutation<{ success: boolean; message: string; data: WifiIpConfig }, Partial<WifiIpConfig>>({
            query: (data) => ({
                url: '/wifi-ip-config/create',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['WifiIpConfig'],
        }),

        // Get all IP configurations with pagination and filters
        getAllIpConfigs: builder.query<WifiIpConfigResponse, {
            page?: number;
            limit?: number;
            search?: string;
            isActive?: string;
        }>({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== '') {
                        queryParams.append(key, value.toString());
                    }
                });

                return {
                    url: `/wifi-ip-config/all?${queryParams.toString()}`,
                    method: 'GET',
                };
            },
            providesTags: ['WifiIpConfig'],
        }),

        // Get active IP configurations (for attendance)
        getActiveIpConfigs: builder.query<{ success: boolean; message: string; data: WifiIpConfig[] }, void>({
            query: () => ({
                url: '/wifi-ip-config/active',
                method: 'GET',
            }),
            providesTags: ['ActiveWifiIpConfig'],
        }),

        // Get IP configuration by ID
        getIpConfigById: builder.query<{ success: boolean; message: string; data: WifiIpConfig }, number>({
            query: (id) => ({
                url: `/wifi-ip-config/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'WifiIpConfig', id }],
        }),

        // Update IP configuration
        updateIpConfig: builder.mutation<{ success: boolean; message: string; data: WifiIpConfig }, { id: number; data: Partial<WifiIpConfig> }>({
            query: ({ id, data }) => ({
                url: `/wifi-ip-config/update/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'WifiIpConfig', id }, 'WifiIpConfig', 'ActiveWifiIpConfig'],
        }),

        // Toggle IP configuration status
        toggleIpConfigStatus: builder.mutation<{ success: boolean; message: string; data: WifiIpConfig }, { id: number; isActive: boolean }>({
            query: ({ id, isActive }) => ({
                url: `/wifi-ip-config/toggle-status/${id}`,
                method: 'PATCH',
                body: { isActive },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'WifiIpConfig', id }, 'WifiIpConfig', 'ActiveWifiIpConfig'],
        }),

        // Delete IP configuration
        deleteIpConfig: builder.mutation<{ success: boolean; message: string }, number>({
            query: (id) => ({
                url: `/wifi-ip-config/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['WifiIpConfig', 'ActiveWifiIpConfig'],
        }),

        // Bulk import IP configurations
        bulkImportIpConfigs: builder.mutation<{ 
            success: boolean; 
            message: string; 
            data: { 
                successful: WifiIpConfig[]; 
                failed: Array<{ data: Partial<WifiIpConfig>; reason: string }> 
            } 
        }, { configs: Partial<WifiIpConfig>[] }>({
            query: (data) => ({
                url: '/wifi-ip-config/bulk-import',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['WifiIpConfig', 'ActiveWifiIpConfig'],
        }),

        // Validate IP address
        validateIp: builder.query<IpValidationResponse, string>({
            query: (ipAddress) => ({
                url: `/wifi-ip-config/validate/${ipAddress}`,
                method: 'GET',
            }),
        }),

        // Get IP configuration statistics
        getIpConfigStats: builder.query<WifiIpConfigStatsResponse, void>({
            query: () => ({
                url: '/wifi-ip-config/stats',
                method: 'GET',
            }),
            providesTags: ['WifiIpConfigStats'],
        }),
    }),
});

export const {
    useCreateIpConfigMutation,
    useGetAllIpConfigsQuery,
    useGetActiveIpConfigsQuery,
    useGetIpConfigByIdQuery,
    useUpdateIpConfigMutation,
    useToggleIpConfigStatusMutation,
    useDeleteIpConfigMutation,
    useBulkImportIpConfigsMutation,
    useValidateIpQuery,
    useGetIpConfigStatsQuery,
} = wifiIpConfigApi;
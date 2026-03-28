import { apiSlice } from "../apiSlice";


export interface PhoneNumberData {
    phoneNumber: string;
    message: string;
}

export interface Audience {
    id: number;
    clientId: number;
    configId: number;
    phoneNumbers: PhoneNumberData[];
    totalNumbers: number;
    configName?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AudienceResponse {
    message: string;
    data: Audience[];
    smsConfigs: Array<{ id: number; appName: string }>;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

export interface AudienceStats {
    clientId: number;
    totalAudiences: number;
    totalPhoneNumbers: number;
    averageNumbersPerAudience: string;
    audiencesByConfig: Record<string, {
        audienceCount: number;
        phoneNumberCount: number;
    }>;
}

export interface AudienceStatsResponse {
    message: string;
    data: AudienceStats;
}

export interface SingleAudienceResponse {
    message: string;
    data: {
        id: number;
        clientId: number;
        configId: number;
        configInfo?: {
            id: number;
            appName: string;
            senderId: string;
            type: string;
            status: boolean;
        };
        phoneNumbers: PhoneNumberData[];
        totalNumbers: number;
        createdAt: string;
        updatedAt: string;
    };
}

export interface AddAudienceRequest {
    configId: number;
    phoneNumbers: PhoneNumberData[];
}

export interface UpdateAudienceRequest {
    phoneNumbers: PhoneNumberData[];
}

export interface AddPhoneNumbersRequest {
    phoneNumbers: PhoneNumberData[];
}

export interface RemovePhoneNumbersRequest {
    phoneNumbers: string[];
}

export interface SendSMSRequest {
    phoneNumbers: string[];
}

export interface BulkSendResponse {
    message: string;
    data: {
        total: number;
        sent: number;
        failed: number;
        details: Array<{
            phoneNumber: string;
            status: string;
            messageLength?: number;
            reason?: string;
            error?: string;
            simulated?: boolean;
        }>;
    };
}

export const audienceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get all audiences for a client
        getClientAudiences: builder.query<AudienceResponse, {
            clientId: string | number;
            page?: number;
            limit?: number;
            configId?: string;
            search?: string;
        }>({
            query: ({ clientId, page = 1, limit = 10, ...params }) => {
                const queryParams = new URLSearchParams();
                queryParams.append('page', page.toString());
                queryParams.append('limit', limit.toString());

                if (params.configId) queryParams.append('configId', params.configId);
                if (params.search) queryParams.append('search', params.search);

                return {
                    url: `/audience-configuration/${clientId}/all?${queryParams.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ['Audience'],
        }),

        // Get audience statistics
        getAudienceStats: builder.query<AudienceStatsResponse, string | number>({
            query: (clientId) => `/audience-configuration/${clientId}/stats`,
            providesTags: ['AudienceStats'],
        }),

        // Get single audience
        getAudienceById: builder.query<SingleAudienceResponse, {
            clientId: string | number;
            id: string | number;
        }>({
            query: ({ clientId, id }) => `/audience-configuration/${clientId}/get/${id}`,
            providesTags: (result, error, { id }) => [{ type: 'Audience', id }],
        }),

        // Create audience
        createAudience: builder.mutation<SingleAudienceResponse, {
            clientId: string | number;
            data: AddAudienceRequest;
        }>({
            query: ({ clientId, data }) => ({
                url: `/audience-configuration/${clientId}/create`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Audience', 'AudienceStats'],
        }),

        // Update audience
        updateAudience: builder.mutation<SingleAudienceResponse, {
            clientId: string | number;
            id: string | number;
            data: UpdateAudienceRequest;
        }>({
            query: ({ clientId, id, data }) => ({
                url: `/audience-configuration/${clientId}/update/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Audience', id }, 'Audience', 'AudienceStats'],
        }),

        // Delete audience
        deleteAudience: builder.mutation<{ message: string }, {
            clientId: string | number;
            id: string | number;
        }>({
            query: ({ clientId, id }) => ({
                url: `/audience-configuration/${clientId}/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Audience', 'AudienceStats'],
        }),

        // Add phone numbers to audience
        addPhoneNumbers: builder.mutation<{
            message: string;
            data: {
                id: number;
                addedCount: number;
                totalNumbers: number;
                updatedAt: string;
            };
        }, {
            clientId: string | number;
            id: string | number;
            data: AddPhoneNumbersRequest;
        }>({
            query: ({ clientId, id, data }) => ({
                url: `/audience-configuration/${clientId}/${id}/add-numbers`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Audience', id }, 'Audience', 'AudienceStats'],
        }),

        // Remove phone numbers from audience
        removePhoneNumbers: builder.mutation<{
            message: string;
            data: {
                id: number;
                removedCount: number;
                totalNumbers: number;
                updatedAt: string;
            };
        }, {
            clientId: string | number;
            id: string | number;
            data: RemovePhoneNumbersRequest;
        }>({
            query: ({ clientId, id, data }) => ({
                url: `/audience-configuration/${clientId}/${id}/remove-numbers`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Audience', id }, 'Audience', 'AudienceStats'],
        }),

        // Send SMS to specific numbers
        sendSMSToAudience: builder.mutation<BulkSendResponse, {
            clientId: string | number;
            id: string | number;
            data: SendSMSRequest;
        }>({
            query: ({ clientId, id, data }) => ({
                url: `/audience-configuration/${clientId}/${id}/send-sms`,
                method: 'POST',
                body: data,
            }),
        }),

        // Send SMS to all numbers
        sendSMSToAllAudience: builder.mutation<BulkSendResponse, {
            clientId: string | number;
            id: string | number;
        }>({
            query: ({ clientId, id }) => ({
                url: `/audience-configuration/${clientId}/${id}/send-all`,
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useGetClientAudiencesQuery,
    useGetAudienceStatsQuery,
    useGetAudienceByIdQuery,
    useCreateAudienceMutation,
    useUpdateAudienceMutation,
    useDeleteAudienceMutation,
    useAddPhoneNumbersMutation,
    useRemovePhoneNumbersMutation,
    useSendSMSToAudienceMutation,
    useSendSMSToAllAudienceMutation,
} = audienceApi;
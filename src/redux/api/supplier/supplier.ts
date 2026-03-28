import { apiSlice } from "../apiSlice";
import { 
  SupplierResponse, 
  SupplierStatsResponse, 
  SearchSupplierResponse,
  Supplier 
} from "@/utils/interface/supplierInterface";

export const supplierApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create supplier
    createSupplier: builder.mutation<{ data: Supplier; message: string }, Partial<Supplier>>({
      query: (data) => ({
        url: '/suppliers/create-supplier',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Supplier'],
    }),

    // Get all suppliers with pagination and filters
    getAllSuppliers: builder.query<SupplierResponse, {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      city?: string;
      supplierType?: string;
      rating?: string;
      sortBy?: string;
      sortOrder?: string;
    }>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            queryParams.append(key, value.toString());
          }
        });

        return {
          url: `/suppliers/get-suppliers?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Supplier'],
    }),

    // Get supplier by ID
    getSupplierById: builder.query<{ data: Supplier; message: string }, string | number>({
      query: (id) => ({
        url: `/suppliers/get-supplier/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Supplier', id }],
    }),

    // Update supplier
    updateSupplier: builder.mutation<{ data: Supplier; message: string }, { id: string | number; data: Partial<Supplier> }>({
      query: ({ id, data }) => ({
        url: `/suppliers/update-supplier/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Supplier', id }, 'Supplier'],
    }),

    // Delete supplier
    deleteSupplier: builder.mutation<{ message: string }, string | number>({
      query: (id) => ({
        url: `/suppliers/delete-supplier/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Supplier'],
    }),

    // Update supplier status
    updateSupplierStatus: builder.mutation<{ data: Supplier; message: string }, { id: string | number; status: string }>({
      query: ({ id, status }) => ({
        url: `/suppliers/update-supplier-status/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Supplier', id }, 'Supplier'],
    }),

    // Update supplier rating
    updateSupplierRating: builder.mutation<{ data: Supplier; message: string }, { id: string | number; rating: number }>({
      query: ({ id, rating }) => ({
        url: `/suppliers/update-supplier-rating/${id}`,
        method: 'PUT',
        body: { rating },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Supplier', id }, 'Supplier'],
    }),

    // Bulk import suppliers
    bulkImportSuppliers: builder.mutation<{ 
      success: boolean; 
      message: string; 
      data: { 
        successful: Supplier[]; 
        failed: Array<{ data: any; reason: string }> 
      } 
    }, { suppliers: Partial<Supplier>[] }>({
      query: (data) => ({
        url: '/suppliers/bulk-import-suppliers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Supplier'],
    }),

    // Get supplier statistics
    getSupplierStats: builder.query<SupplierStatsResponse, void>({
      query: () => ({
        url: '/suppliers/stats',
        method: 'GET',
      }),
      providesTags: ['SupplierStats'],
    }),

    // Search suppliers (for dropdown)
    searchSuppliers: builder.query<SearchSupplierResponse, { q?: string; limit?: number }>({
      query: ({ q = '', limit = 20 }) => ({
        url: `/suppliers/search?q=${q}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['SupplierSearch'],
    }),
  }),
});

export const {
  useCreateSupplierMutation,
  useGetAllSuppliersQuery,
  useGetSupplierByIdQuery,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useUpdateSupplierStatusMutation,
  useUpdateSupplierRatingMutation,
  useBulkImportSuppliersMutation,
  useGetSupplierStatsQuery,
  useSearchSuppliersQuery,
} = supplierApi;
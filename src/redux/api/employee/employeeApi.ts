// redux/api/employee/employeeApi.ts
import { apiSlice } from "../apiSlice";
import { Employee, EmployeeResponse, EmployeeStatsResponse } from "@/utils/interface/employeeInterface";

export const employeeApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Create employee
        createEmployee: builder.mutation<{ data: Employee; message: string }, Partial<Employee>>({
            query: (data) => ({
                url: '/employees/create-employee',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Employee'],
        }),

        // Get all employees with pagination and filters
        getAllEmployees: builder.query<EmployeeResponse, {
            page?: number;
            limit?: number;
            search?: string;
            status?: string;
            department?: string;
            shift?: string;
        }>({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== '') {
                        queryParams.append(key, value.toString());
                    }
                });

                return {
                    url: `/employees/get-employees?${queryParams.toString()}`,
                    method: 'GET',
                };
            },
            providesTags: ['Employee'],
        }),

        // Get employee by ID
        getEmployeeById: builder.query<{ data: Employee; message: string }, string | number>({
            query: (id) => ({
                url: `/employees/get-employee/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Employee', id }],
        }),

        // Update employee
        updateEmployee: builder.mutation<{ data: Employee; message: string }, { id: string | number; data: Partial<Employee> }>({
            query: ({ id, data }) => ({
                url: `/employees/update-employee/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Employee', id }, 'Employee'],
        }),

        // Delete employee
        deleteEmployee: builder.mutation<{ message: string }, string | number>({
            query: (id) => ({
                url: `/employees/delete-employee/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Employee'],
        }),

        // Update employee status
        updateEmployeeStatus: builder.mutation<{ data: Employee; message: string }, { id: string | number; status: string }>({
            query: ({ id, status }) => ({
                url: `/employees/update-employee-status/${id}`,
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Employee', id }, 'Employee'],
        }),

        // Bulk import employees
        bulkImportEmployees: builder.mutation<{ 
            success: boolean; 
            message: string; 
            data: { 
                successful: Employee[]; 
                failed: Array<{ data: Partial<Employee>; reason: string }> 
            } 
        }, { employees: Partial<Employee>[] }>({
            query: (data) => ({
                url: '/employees/bulk-import-employees',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Employee'],
        }),

        // Get employee statistics
        getEmployeeStats: builder.query<EmployeeStatsResponse, void>({
            query: () => ({
                url: '/employees/stats',
                method: 'GET',
            }),
            providesTags: ['EmployeeStats'],
        }),

        // Search employees (for dropdown)
        searchEmployees: builder.query<{ data: Employee[]; message: string }, { q?: string; limit?: number }>({
            query: ({ q = '', limit = 20 }) => ({
                url: `/employees/search?q=${q}&limit=${limit}`,
                method: 'GET',
            }),
            providesTags: ['EmployeeSearch'],
        }),
    }),
});

export const {
    useCreateEmployeeMutation,
    useGetAllEmployeesQuery,
    useGetEmployeeByIdQuery,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation,
    useUpdateEmployeeStatusMutation,
    useBulkImportEmployeesMutation,
    useGetEmployeeStatsQuery,
    useSearchEmployeesQuery,
} = employeeApi;
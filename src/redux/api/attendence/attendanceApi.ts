// redux/api/attendance/attendanceApi.ts
import { apiSlice } from "../apiSlice";
import { 
    Attendance, 
    AttendanceResponse, 
    DailyAttendanceReport,
    MonthlyAttendanceReport,
    AttendanceSummary,
    TodayAttendanceResponse
} from "@/utils/interface/attendanceInterface";

export const attendanceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Admin: Mark attendance (bulk)
        markAttendance: builder.mutation<{ 
            success: boolean; 
            message: string; 
            data: { 
                successful: Array<{ employeeId: number; name: string; status: string; created: string }>;
                failed: Array<{ employeeId: number; reason: string }>;
            } 
        }, { date: string; attendance: Array<{ employeeId: number; status: string; checkIn?: string; checkOut?: string; note?: string }> }>({
            query: (data) => ({
                url: '/attendance/mark',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Attendance', 'AttendanceReport'],
        }),

        // Employee: Self check-in
        selfCheckIn: builder.mutation<{ success: boolean; message: string; data: Attendance }, { 
            note?: string; 
            location?: { lat: number; lng: number; address?: string }; 
            deviceInfo?: string;
            ipAddress?: string;
        }>({
            query: (data) => ({
                url: '/attendance/self/check-in',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Attendance', 'MyAttendance'],
        }),

        // Employee: Self check-out
        selfCheckOut: builder.mutation<{ success: boolean; message: string; data: Attendance }, { 
            note?: string; 
            location?: { lat: number; lng: number; address?: string }; 
            deviceInfo?: string;
            ipAddress?: string;
        }>({
            query: (data) => ({
                url: '/attendance/self/check-out',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Attendance', 'MyAttendance'],
        }),

        // Employee: Get today's attendance
       getMyTodayAttendance: builder.query<TodayAttendanceResponse, void>({
            query: () => ({
                url: '/attendance/self/today',
                method: 'GET',
            }),
            providesTags: ['MyAttendance'],
        }),

        // Admin: Get daily attendance report
        getDailyAttendanceReport: builder.query<{ success: boolean; message: string; data: DailyAttendanceReport }, { date?: string }>({
            query: ({ date }) => ({
                url: `/attendance/reports/daily${date ? `?date=${date}` : ''}`,
                method: 'GET',
            }),
            providesTags: ['AttendanceReport'],
        }),

        // Admin: Get monthly attendance report
        getMonthlyAttendanceReport: builder.query<{ success: boolean; message: string; data: MonthlyAttendanceReport }, { year?: number; month?: number; department?: string }>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params.year) queryParams.append('year', params.year.toString());
                if (params.month) queryParams.append('month', params.month.toString());
                if (params.department) queryParams.append('department', params.department);
                return {
                    url: `/attendance/reports/monthly?${queryParams.toString()}`,
                    method: 'GET',
                };
            },
            providesTags: ['AttendanceReport'],
        }),

        // Admin: Get attendance by date range
        getAttendanceByDateRange: builder.query<AttendanceResponse, { 
            startDate: string; 
            endDate: string; 
            employeeId?: number; 
            status?: string;
            department?: string;
            shift?: string;
            page?: number;
            limit?: number;
        }>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                queryParams.append('startDate', params.startDate);
                queryParams.append('endDate', params.endDate);
                if (params.employeeId) queryParams.append('employeeId', params.employeeId.toString());
                if (params.status) queryParams.append('status', params.status);
                if (params.department) queryParams.append('department', params.department);
                if (params.shift) queryParams.append('shift', params.shift);
                if (params.page) queryParams.append('page', params.page.toString());
                if (params.limit) queryParams.append('limit', params.limit.toString());
                return {
                    url: `/attendance/reports/range?${queryParams.toString()}`,
                    method: 'GET',
                };
            },
            providesTags: ['Attendance'],
        }),

        // Admin: Get employee attendance summary
        getEmployeeAttendanceSummary: builder.query<{ success: boolean; message: string; data: AttendanceSummary }, { 
            employeeId: number; 
            year?: number; 
            month?: number;
        }>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                queryParams.append('employeeId', params.employeeId.toString());
                if (params.year) queryParams.append('year', params.year.toString());
                if (params.month) queryParams.append('month', params.month.toString());
                return {
                    url: `/attendance/reports/summary?${queryParams.toString()}`,
                    method: 'GET',
                };
            },
            providesTags: ['AttendanceSummary'],
        }),

        // Admin: Update attendance record
        updateAttendance: builder.mutation<{ success: boolean; message: string; data: Attendance }, { 
            id: number; 
            status?: string; 
            checkIn?: string; 
            checkOut?: string; 
            note?: string;
        }>({
            query: ({ id, ...data }) => ({
                url: `/attendance/update/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Attendance', 'AttendanceReport', 'AttendanceSummary'],
        }),



        //! The new for employee. 
        
    }),
});

export const {
    useMarkAttendanceMutation,
    useSelfCheckInMutation,
    useSelfCheckOutMutation,
    useGetMyTodayAttendanceQuery,
    useGetDailyAttendanceReportQuery,
    useGetMonthlyAttendanceReportQuery,
    useGetAttendanceByDateRangeQuery,
    useGetEmployeeAttendanceSummaryQuery,
    useUpdateAttendanceMutation,
} = attendanceApi;
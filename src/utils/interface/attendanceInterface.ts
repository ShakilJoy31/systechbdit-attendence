// utils/interface/attendanceInterface.ts
export interface Attendance {
    id?: number;
    employeeId: number;
    date: string;
    status: 'present' | 'absent' | 'late' | 'half-day';
    checkIn?: string;
    checkOut?: string;
    checkInNote?: string;
    checkOutNote?: string;
    markedBy?: number;
    markedByRole?: 'admin' | 'employee';
    overtime?: number;
    location?: {
        lat: number;
        lng: number;
        address?: string;
    };
    ipAddress?: string;
    deviceInfo?: string;
    createdAt?: string;
    updatedAt?: string;
    employee?: {
        id: number;
        name: string;
        employeeId: string;
        designation: string;
        department: string;
        shift: string;
        profileImage?: string;
    };
}

export interface AttendanceResponse {
    success: boolean;
    message: string;
    data: Attendance[];
    pagination?: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        itemsPerPage: number;
    };
}

export interface DailyAttendanceReport {
    date: string;
    totalEmployees: number;
    present: number;
    absent: number;
    late: number;
    halfDay: number;
    attendanceRate: number;
    records: Attendance[];
}

export interface MonthlyAttendanceReport {
    year: number;
    month: number;
    report: Array<{
        employee: {
            id: number;
            name: string;
            employeeId: string;
            designation: string;
            department: string;
            shift: string;
        };
        summary: {
            totalDays: number;
            present: number;
            absent: number;
            late: number;
            halfDay: number;
            totalOvertime: number;
        };
    }>;
}

export interface AttendanceSummary {
    employeeId: number;
    year: number;
    month: number;
    totalDays: number;
    present: number;
    absent: number;
    late: number;
    halfDay: number;
    totalOvertime: number;
    attendanceRate: number;
}

// Fixed: This should match your API response structure
// Your API returns: { success: true, message: string, data: TodayAttendance }
export interface TodayAttendanceResponse {
    success: boolean;
    message: string;
    data: {
        attendance: Attendance | null;
        employee: {
            id: number;
            name: string;
            employeeId: string;
            designation: string;
            department: string;
            shift: string;
        };
        hasCheckedIn: boolean;
        hasCheckedOut: boolean;
    };
}
// utils/interface/employeeInterface.ts
export interface Employee {
    id?: number;
    employeeId: string;
    name: string;
    email: string;
    phone: string;
    designation: string;
    department: string;
    joiningDate: string;
    shift: 'morning' | 'evening' | 'night';
    status: 'active' | 'inactive';
    biometricId?: string;
    profileImage?: string;
    address?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface EmployeeResponse {
    data: Employee[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
    message: string;
}

export interface EmployeeStatsResponse {
    data: {
        totalEmployees: number;
        activeEmployees: number;
        presentToday: number;
        onLeave: number;
        lateToday: number;
    };
    message: string;
}
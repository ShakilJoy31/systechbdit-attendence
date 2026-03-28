// app/employees/page.tsx
import EmployeeList from "@/components/employee/EmployeeList";
import { generateDynamicMetadata } from "@/metadata/generateMetadata";
import { Suspense } from "react";

export async function generateMetadata() {
    return generateDynamicMetadata({
        title: "Employees | Attendance Management System",
        description: "Manage your employees - Add, edit, and track all employee information and attendance records.",
        keywords: [
            "employees", "staff management", "attendance", "workforce",
            "employee directory", "HR management", "staff records"
        ],
    });
}

const EmployeesPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl text-gray-300">Loading Employee Dashboard...</p>
                </div>
            </div>
        }>
            <div className="min-h-screen p-4 md:p-6 lg:p-8">
                <EmployeeList />
            </div>
        </Suspense>
    );
};

export default EmployeesPage;
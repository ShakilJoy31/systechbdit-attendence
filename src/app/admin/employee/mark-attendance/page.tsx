// app/employee/attendance/page.tsx
import EmployeeAttendance from "@/components/employee-attendence/EmployeeAttendance";
import { generateDynamicMetadata } from "@/metadata/generateMetadata";
import { Suspense } from "react";

export async function generateMetadata() {
    return generateDynamicMetadata({
        title: "My Attendance | Employee Attendance System",
        description: "Mark your daily attendance with check-in and check-out. Location and time tracking for accurate attendance records.",
        keywords: ["employee attendance", "check in", "check out", "daily attendance"],
    });
}

const EmployeeAttendancePage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl text-gray-300">Loading Attendance System...</p>
                </div>
            </div>
        }>
            <EmployeeAttendance />
        </Suspense>
    );
};

export default EmployeeAttendancePage;
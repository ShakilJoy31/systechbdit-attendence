// app/attendance/page.tsx (Admin View)
import MarkAttendance from "@/components/attendence/MarkAttendance";
import { generateDynamicMetadata } from "@/metadata/generateMetadata";
import { Suspense } from "react";

export async function generateMetadata() {
    return generateDynamicMetadata({
        title: "Mark Attendance | Attendance Management System",
        description: "Record daily attendance for employees - present, late, half-day, or absent.",
        keywords: ["attendance", "mark attendance", "daily attendance", "employee attendance"],
    });
}

const AttendancePage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl text-gray-300">Loading Attendance Dashboard...</p>
                </div>
            </div>
        }>
            <div className="min-h-screen p-2 md:p-6">
                <MarkAttendance />
            </div>
        </Suspense>
    );
};

export default AttendancePage;
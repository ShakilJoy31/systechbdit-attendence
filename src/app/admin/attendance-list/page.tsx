import AttendanceReport from "@/components/attendence/AttendanceReport";
import { generateDynamicMetadata } from "@/metadata/generateMetadata";
import { Suspense } from "react";

export async function generateMetadata() {
    return generateDynamicMetadata({
        title: "Attendance Report | Attendance Management System",
        description: "View detailed attendance reports with filters for present, late, half-day, and absent employees.",
        keywords: ["attendance report", "daily attendance", "employee attendance", "attendance summary"],
    });
}

const AttendanceReportPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl text-gray-300">Loading Attendance Report...</p>
                </div>
            </div>
        }>
            <AttendanceReport />
        </Suspense>
    );
};

export default AttendanceReportPage;
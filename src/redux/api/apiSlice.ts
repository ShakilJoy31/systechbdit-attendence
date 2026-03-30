import { appConfiguration } from "@/utils/constant/appConfiguration";
import { shareWithCookies } from "@/utils/helper/shareWithCookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = appConfiguration.baseUrl;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = shareWithCookies("get", `${appConfiguration.appCode}token`, 0) as string | null;
    
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["EmployeeSearch",
    "Employee",
    "EmployeeStats","Attendance",
    "AttendanceReport",
    "AttendanceSummary",
    "MyAttendance",
    "WifiIpConfigStats",
    "WifiIpConfig",
    "ActiveWifiIpConfig",
                      
    
    
    
    
    "Enterprise", "Supplier","SupplierStats","SupplierSearch", "Client", "File", "SMS", 'Audience', 'AudienceStats', 'SMSHistory', 'Payments', 'Payment'],
  endpoints: () => ({}),
});
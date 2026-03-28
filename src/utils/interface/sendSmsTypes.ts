export interface SMSConfig {
  id: string | number;
  appName: string;
  status: boolean;
  senderId: string;
  message: string;
  type: string;
  createdAt: string;
}

// Response from useGetClientSMSQuery
export interface GetClientSMSResponse {
  data: SMSConfig[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Full API response structure
export interface SMSApiResponse {
  data: GetClientSMSResponse;
  message: string;
  success: boolean;
}

// For SMS sending response
export interface SMSSendResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    successful: number;
    failed: number;
    results: SMSSendResult[];
    errors?: SMSSendError[];
  };
}

export interface SMSSendResult {
  phoneNumber: string;
  success: boolean;
  messageId?: string;
  response: string;
  messageUsed: string;
}

export interface SMSSendError {
  phoneNumber: string;
  error: string;
  response?: string;
}

// Alternative type for the query response (if the structure is different)
export interface SMSQueryResponse {
  data?: GetClientSMSResponse;
  message?: string;
  success?: boolean;
}

// Type for user info
export interface UserInfo {
  id: string | number;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

// Type guard to check response structure
export function isSMSApiResponse(response: unknown): response is SMSApiResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'data' in response &&
    'message' in response &&
    'success' in response &&
    typeof (response as SMSApiResponse).success === 'boolean'
  );
}

export function isGetClientSMSResponse(response: unknown): response is GetClientSMSResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'data' in response &&
    Array.isArray((response as GetClientSMSResponse).data)
  );
}
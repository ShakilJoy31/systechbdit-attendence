export interface SMS {
  id: number;
  clientId: number;
  appName: string;
  apiKey: string;
  type: 'unicode' | 'text' | 'flash';
  senderId: string;
  message: string;
  status: boolean;
  baseUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface SMSResponse {
  data: SMS[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SMSStats {
  totalConfigs: number;
  activeConfigs: number;
  inactiveConfigs: number;
  totalSMS: number;
  smsSentThisMonth: number;
  unicodeCount: number;
  textCount: number;
  flashCount: number;
}

export interface SMSSendResult {
  phoneNumber: string;
  success: boolean;
  messageId?: string;
  response?: unknown;
  error?: string;
  messageUsed?: 'config' | 'custom';
}

export interface SMSSendResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    successful: number;
    failed: number;
    results: SMSSendResult[];
    errors?: Array<{
      phoneNumber: string;
      error: string;
      response?: unknown;
    }>;
  };
}
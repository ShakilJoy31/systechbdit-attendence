// utils/interface/smsHistoryInterface.ts
export interface ClientDetails {
  id: number;
  fullName: string;
  mobileNo: string;
  email: string;
}

export interface ConfigDetails {
  id: number;
  appName: string;
  senderId: string;
  type: string;
  clientId: number;
}

export interface SMSHistory {
  id: number;
  clientId: number;
  configId: number;
  phoneNumber: string;
  message: string;
  messageType: 'config' | 'custom';
  gatewayMessageId: string | null;
  gatewayResponse: string | null;
  status: 'sent' | 'failed' | 'delivered' | 'pending';
  deliveryStatus: 'pending' | 'delivered' | 'failed' | 'unknown';
  deliveryConfirmedAt: string | null;
  sentAt: string;
  cost: string;
  characterCount: number;
  smsCount: number;
  createdAt: string;
  updatedAt: string;
  clientDetails?: ClientDetails | null;
  configDetails?: ConfigDetails | null;
}

export interface SMSHistoryResponse {
  success: boolean;
  message: string;
  data: {
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    history: SMSHistory[];
  };
}

export interface SMSHistoryFilters {
  page?: number;
  limit?: number;
  clientId?: number | string;
  configId?: number | string;
  phoneNumber?: string;
  messageType?: 'config' | 'custom';
  status?: 'sent' | 'failed' | 'delivered' | 'pending';
  deliveryStatus?: 'pending' | 'delivered' | 'failed' | 'unknown';
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface Client {
  id: number;
  fullName: string;
  mobileNo: string;
  email: string;
  status: string;
  role: string;
}
export interface SMS {
    id: number;
    clientId: number;
    appName: string;
    apiKey: string;
    type: "unicode" | "text" | "flash";
    senderId: string;
    message: string;
    status: boolean;
    baseUrl: string;
    createdAt?: string;
    updatedAt?: string;
    client?: {
        id: number;
        fullName: string;
        email: string;
        mobileNo: string;
        photo?: string;
    };
}

export interface SMSResponse {
    data: SMS[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
    message: string;
}

export interface SMSStats {
    clientId: number;
    totalSMS: number;
    activeSMS: number;
    inactiveSMS: number;
    byService: {
        [key: string]: number;
    };
}
export interface Supplier {
  id: number;
  supplierName: string;
  supplierType: 'manufacturer' | 'distributor' | 'wholesaler' | 'retailer';
  companyName: string;
  tradeLicenseNo?: string;
  binNo?: string;
  tinNo?: string;
  
  // Contact Person
  contactPersonName: string;
  contactPersonDesignation?: string;
  contactPersonPhoto?: string;
  contactPersonNidOrPassportNo?: string;
  
  // Contact Information
  phoneNo: string;
  alternatePhoneNo?: string;
  email: string;
  website?: string;
  
  // Address
  address: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
  
  // Business Details
  productsSupplied?: string[] | string;
  yearOfEstablishment?: number;
  paymentTerms: 'immediate' | '7days' | '15days' | '30days' | '45days' | '60days';
  creditLimit: number;
  
  // Bank Details
  bankName?: string;
  bankAccountNo?: string;
  bankBranch?: string;
  bankAccountHolderName?: string;
  routingNumber?: string;
  
  // Documents
  documents?: Record<string, any>;
  
  // System Fields
  status: 'active' | 'inactive' | 'blacklisted';
  rating: number;
  notes?: string;
  
  // Statistics
  totalPurchases: number;
  totalPurchaseAmount: number;
  lastPurchaseDate?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  joinedDate?: string;
  lastPurchaseDateFormatted?: string;
  creditLimitFormatted?: string;
  totalPurchaseAmountFormatted?: string;
  displayName?: string;
  ratingStars?: string;
  
  createdBy?: number;
  updatedBy?: number;
}

export interface SupplierResponse {
  success: boolean;
  message: string;
  data: Supplier[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

export interface SupplierStats {
  total: number;
  active: number;
  inactive: number;
  blacklisted: number;
  averageRating: string;
  totalPurchaseAmount: string;
  byCity: Array<{ city: string; count: number }>;
  byType: Array<{ supplierType: string; count: number }>;
}

export interface SupplierStatsResponse {
  success: boolean;
  message: string;
  data: SupplierStats;
}

export interface SearchSupplierResult {
  id: number;
  name: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  displayName: string;
}

export interface SearchSupplierResponse {
  success: boolean;
  message: string;
  data: SearchSupplierResult[];
}
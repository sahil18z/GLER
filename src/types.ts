export type VendorType = 'Independent' | 'Company';

export type ServiceOffering = 'Housekeeping' | 'Window Cleaning' | 'Car Valet';

/** "Pending" providers render as "—" in the Status column (matches the Figma). */
export type ProviderStatus = 'Onboarded' | 'Rejected' | 'Pending';

export interface ServiceProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  postcode: string;
  country: string;
  vendorType: VendorType;
  serviceOffering: ServiceOffering;
  /** ISO date string (YYYY-MM-DD) — formatted for display in the UI. */
  signupDate: string;
  status: ProviderStatus;
  note: string;
}

export type SortableColumn =
  | 'email'
  | 'phone'
  | 'postcode'
  | 'vendorType'
  | 'serviceOffering'
  | 'signupDate'
  | 'status';

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  column: SortableColumn;
  direction: SortDirection;
}

/** Sidebar filter values (applied only when "Apply Filters" is pressed). */
export interface SidebarFilters {
  postcode: string;
  registrationStatus: Array<'Onboarded' | 'Rejected'>;
  dateFrom: string; // ISO (YYYY-MM-DD) or ''
  dateTo: string; // ISO (YYYY-MM-DD) or ''
  vendorTypes: VendorType[];
  serviceOfferings: ServiceOffering[];
}

/** Per-column quick filters (live, in the table header). */
export interface ColumnFilters {
  email: string;
  phone: string;
  postcode: string;
  vendorType: '' | VendorType;
  serviceOffering: '' | ServiceOffering;
  signupFrom: string;
  signupTo: string;
  status: '' | ProviderStatus;
}

export const EMPTY_SIDEBAR_FILTERS: SidebarFilters = {
  postcode: '',
  registrationStatus: [],
  dateFrom: '',
  dateTo: '',
  vendorTypes: [],
  serviceOfferings: [],
};

export const EMPTY_COLUMN_FILTERS: ColumnFilters = {
  email: '',
  phone: '',
  postcode: '',
  vendorType: '',
  serviceOffering: '',
  signupFrom: '',
  signupTo: '',
  status: '',
};

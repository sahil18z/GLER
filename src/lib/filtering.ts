import type {
  ServiceProvider,
  SidebarFilters,
  ColumnFilters,
  SortState,
} from '../types';
import { withinDateRange } from './format';

/** Normalise a search term: trim + collapse whitespace + lowercase. */
export function normalizeQuery(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ').toLowerCase();
}

/** Free-text search across every text-bearing column (partial, case-insensitive). */
export function applySearch(
  rows: ServiceProvider[],
  rawQuery: string
): ServiceProvider[] {
  const q = normalizeQuery(rawQuery);
  if (!q) return rows;

  return rows.filter((r) => {
    const haystack = [
      r.name,
      r.email,
      r.phone,
      r.phone.replace(/\s+/g, ''),
      r.postcode,
      r.postcode.replace(/\s+/g, ''),
      r.vendorType,
      r.serviceOffering,
      r.status === 'Pending' ? '' : r.status,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

/** Sidebar filters — applied only on "Apply Filters". */
export function applySidebarFilters(
  rows: ServiceProvider[],
  f: SidebarFilters
): ServiceProvider[] {
  const postcode = normalizeQuery(f.postcode).replace(/\s+/g, '');

  return rows.filter((r) => {
    if (postcode && !r.postcode.toLowerCase().replace(/\s+/g, '').includes(postcode)) {
      return false;
    }
    if (
      f.registrationStatus.length > 0 &&
      !f.registrationStatus.includes(r.status as 'Onboarded' | 'Rejected')
    ) {
      return false;
    }
    if (!withinDateRange(r.signupDate, f.dateFrom, f.dateTo)) return false;
    if (f.vendorTypes.length > 0 && !f.vendorTypes.includes(r.vendorType)) return false;
    if (
      f.serviceOfferings.length > 0 &&
      !f.serviceOfferings.includes(r.serviceOffering)
    ) {
      return false;
    }
    return true;
  });
}

/** Live per-column filters from the table header. */
export function applyColumnFilters(
  rows: ServiceProvider[],
  c: ColumnFilters
): ServiceProvider[] {
  const email = normalizeQuery(c.email);
  const phone = normalizeQuery(c.phone).replace(/\s+/g, '');
  const postcode = normalizeQuery(c.postcode).replace(/\s+/g, '');

  return rows.filter((r) => {
    if (email && !r.email.toLowerCase().includes(email)) return false;
    if (phone && !r.phone.toLowerCase().replace(/\s+/g, '').includes(phone)) return false;
    if (
      postcode &&
      !r.postcode.toLowerCase().replace(/\s+/g, '').includes(postcode)
    ) {
      return false;
    }
    if (c.vendorType && r.vendorType !== c.vendorType) return false;
    if (c.serviceOffering && r.serviceOffering !== c.serviceOffering) return false;
    if (!withinDateRange(r.signupDate, c.signupFrom, c.signupTo)) return false;
    if (c.status && r.status !== c.status) return false;
    return true;
  });
}

const STATUS_ORDER: Record<ServiceProvider['status'], number> = {
  Onboarded: 0,
  Rejected: 1,
  Pending: 2,
};

/** Stable sort on any sortable column. */
export function applySort(
  rows: ServiceProvider[],
  sort: SortState | null
): ServiceProvider[] {
  if (!sort) return rows;
  const dir = sort.direction === 'asc' ? 1 : -1;

  const withIndex = rows.map((row, index) => ({ row, index }));
  withIndex.sort((a, b) => {
    let cmp = 0;
    switch (sort.column) {
      case 'signupDate':
        cmp = a.row.signupDate.localeCompare(b.row.signupDate);
        break;
      case 'status':
        cmp = STATUS_ORDER[a.row.status] - STATUS_ORDER[b.row.status];
        break;
      default:
        cmp = String(a.row[sort.column]).localeCompare(
          String(b.row[sort.column]),
          undefined,
          { sensitivity: 'base', numeric: true }
        );
    }
    if (cmp === 0) return a.index - b.index; // keep original order for ties
    return cmp * dir;
  });

  return withIndex.map((x) => x.row);
}

export interface PageResult<T> {
  rows: T[];
  page: number;
  pageCount: number;
  total: number;
  from: number;
  to: number;
}

export function paginate<T>(rows: T[], page: number, pageSize: number): PageResult<T> {
  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * pageSize;
  const slice = rows.slice(start, start + pageSize);
  return {
    rows: slice,
    page: safePage,
    pageCount,
    total,
    from: total === 0 ? 0 : start + 1,
    to: start + slice.length,
  };
}

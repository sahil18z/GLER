import type {
  ServiceProvider,
  SortState,
  SortableColumn,
  ColumnFilters,
} from '../../types';
import { formatTableDate, normalizeInputDate } from '../../lib/format';
import { Icon } from '../ui/Icon';
import { Checkbox } from '../ui/Checkbox';
import { StatusBadge } from './StatusBadge';
import styles from './ProvidersTable.module.css';

interface Column {
  key: string;
  label: string;
  sortKey?: SortableColumn;
}

const COLUMNS: Column[] = [
  { key: 'email', label: 'Email', sortKey: 'email' },
  { key: 'phone', label: 'Phone Number', sortKey: 'phone' },
  { key: 'postcode', label: 'Postcode', sortKey: 'postcode' },
  { key: 'vendorType', label: 'Vendor Type', sortKey: 'vendorType' },
  { key: 'serviceOffering', label: 'Service Offering', sortKey: 'serviceOffering' },
  { key: 'signupDate', label: 'Signup Date', sortKey: 'signupDate' },
  { key: 'status', label: 'Status', sortKey: 'status' },
  { key: 'actions', label: 'Actions' },
];

const TOTAL_COLS = COLUMNS.length + 1; // + selection column

/** Allow the email to wrap cleanly after "@" on narrow screens. */
function renderEmail(email: string) {
  const at = email.indexOf('@');
  if (at === -1) return email;
  return (
    <>
      {email.slice(0, at + 1)}
      <wbr />
      {email.slice(at + 1)}
    </>
  );
}

interface ProvidersTableProps {
  rows: ServiceProvider[];
  sort: SortState | null;
  onSort: (column: SortableColumn) => void;
  showColumnFilters: boolean;
  columnFilters: ColumnFilters;
  onColumnFilterChange: (next: ColumnFilters) => void;
  selectedIds: Set<string>;
  onToggleRow: (id: string) => void;
  onTogglePage: () => void;
  pageAllSelected: boolean;
  pageSomeSelected: boolean;
  onEdit: (provider: ServiceProvider) => void;
  onView: (provider: ServiceProvider) => void;
}

export function ProvidersTable({
  rows,
  sort,
  onSort,
  showColumnFilters,
  columnFilters,
  onColumnFilterChange,
  selectedIds,
  onToggleRow,
  onTogglePage,
  pageAllSelected,
  pageSomeSelected,
  onEdit,
  onView,
}: ProvidersTableProps) {
  const setCol = <K extends keyof ColumnFilters>(
    key: K,
    value: ColumnFilters[K]
  ) => onColumnFilterChange({ ...columnFilters, [key]: value });

  const sortIcon = (col?: SortableColumn) => {
    if (!col) return null;
    if (sort?.column !== col) return <Icon name="sort" size={14} className={styles.sortIdle} />;
    return (
      <Icon
        name={sort.direction === 'asc' ? 'sort-asc' : 'sort-desc'}
        size={14}
        className={styles.sortActive}
      />
    );
  };

  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.checkCell} scope="col">
              <Checkbox
                label="Select all rows on this page"
                hideLabel
                checked={pageAllSelected}
                indeterminate={pageSomeSelected}
                onChange={onTogglePage}
              />
            </th>
            {COLUMNS.map((col) => (
              <th key={col.key} scope="col">
                {col.sortKey ? (
                  <button
                    type="button"
                    className={styles.sortBtn}
                    onClick={() => onSort(col.sortKey!)}
                    aria-label={`Sort by ${col.label}`}
                  >
                    {col.label}
                    {sortIcon(col.sortKey)}
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>

          {showColumnFilters && (
            <tr className={styles.filterRow}>
              <td className={styles.checkCell} />
              <td>
                <input
                  className={styles.filterInput}
                  placeholder="Filter email"
                  aria-label="Filter by email"
                  value={columnFilters.email}
                  onChange={(e) => setCol('email', e.target.value)}
                />
              </td>
              <td>
                <input
                  className={styles.filterInput}
                  placeholder="Filter phone"
                  aria-label="Filter by phone"
                  value={columnFilters.phone}
                  onChange={(e) => setCol('phone', e.target.value)}
                />
              </td>
              <td>
                <input
                  className={styles.filterInput}
                  placeholder="Filter postcode"
                  aria-label="Filter by postcode"
                  value={columnFilters.postcode}
                  onChange={(e) => setCol('postcode', e.target.value)}
                />
              </td>
              <td>
                <select
                  className={styles.filterInput}
                  aria-label="Filter by vendor type"
                  value={columnFilters.vendorType}
                  onChange={(e) =>
                    setCol('vendorType', e.target.value as ColumnFilters['vendorType'])
                  }
                >
                  <option value="">All</option>
                  <option value="Independent">Independent</option>
                  <option value="Company">Company</option>
                </select>
              </td>
              <td>
                <select
                  className={styles.filterInput}
                  aria-label="Filter by service offering"
                  value={columnFilters.serviceOffering}
                  onChange={(e) =>
                    setCol(
                      'serviceOffering',
                      e.target.value as ColumnFilters['serviceOffering']
                    )
                  }
                >
                  <option value="">All</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Window Cleaning">Window Cleaning</option>
                  <option value="Car Valet">Car Valet</option>
                </select>
              </td>
              <td>
                <div className={styles.filterDates}>
                  <input
                    type="date"
                    className={styles.filterInput}
                    aria-label="Signup date from"
                    value={columnFilters.signupFrom}
                    max={columnFilters.signupTo || undefined}
                    onChange={(e) =>
                      setCol('signupFrom', normalizeInputDate(e.target.value))
                    }
                  />
                  <input
                    type="date"
                    className={styles.filterInput}
                    aria-label="Signup date to"
                    value={columnFilters.signupTo}
                    min={columnFilters.signupFrom || undefined}
                    onChange={(e) =>
                      setCol('signupTo', normalizeInputDate(e.target.value))
                    }
                  />
                </div>
              </td>
              <td>
                <select
                  className={styles.filterInput}
                  aria-label="Filter by status"
                  value={columnFilters.status}
                  onChange={(e) =>
                    setCol('status', e.target.value as ColumnFilters['status'])
                  }
                >
                  <option value="">All</option>
                  <option value="Onboarded">Onboarded</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Pending">Pending</option>
                </select>
              </td>
              <td />
            </tr>
          )}
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={TOTAL_COLS} className={styles.empty}>
                No service providers match your filters.
              </td>
            </tr>
          ) : (
            rows.map((p) => {
              const selected = selectedIds.has(p.id);
              return (
                <tr key={p.id} className={selected ? styles.rowSelected : undefined}>
                  <td className={styles.checkCell}>
                    <Checkbox
                      label={`Select ${p.email}`}
                      hideLabel
                      checked={selected}
                      onChange={() => onToggleRow(p.id)}
                    />
                  </td>
                  <td className={styles.emailCell}>
                    <span className={styles.email}>{renderEmail(p.email)}</span>
                  </td>
                  <td className={styles.nowrap}>{p.phone}</td>
                  <td className={styles.nowrap}>{p.postcode}</td>
                  <td>{p.vendorType}</td>
                  <td className={styles.nowrap}>{p.serviceOffering}</td>
                  <td className={styles.nowrap}>{formatTableDate(p.signupDate)}</td>
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => onEdit(p)}
                        aria-label={`Edit ${p.email}`}
                        title="Edit details"
                      >
                        <Icon name="edit" size={16} />
                      </button>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => onView(p)}
                        aria-label={`Open ${p.email} profile in new tab`}
                        title="Open profile"
                      >
                        <Icon name="external" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import {
  EMPTY_COLUMN_FILTERS,
  EMPTY_SIDEBAR_FILTERS,
  type ColumnFilters,
  type ServiceProvider,
  type SidebarFilters,
  type SortableColumn,
  type SortState,
} from '../../types';
import { PAGE_SIZE, SERVICE_PROVIDERS } from '../../data/providers';
import {
  applyColumnFilters,
  applySearch,
  applySidebarFilters,
  applySort,
  paginate,
} from '../../lib/filtering';
import { useToast } from '../../hooks/useToast';
import { TopNav } from '../layout/TopNav';
import { Sidebar } from '../layout/Sidebar';
import { FilterPanel } from '../filters/FilterPanel';
import { ProviderModal } from '../modal/ProviderModal';
import { Icon } from '../ui/Icon';
import { SearchBar } from './SearchBar';
import { TabSwitcher, type WaitlistTab } from './TabSwitcher';
import { ProvidersTable } from './ProvidersTable';
import { Pagination } from './Pagination';
import styles from './WaitlistPage.module.css';

function countActiveSidebarFilters(f: SidebarFilters): number {
  return (
    (f.postcode.trim() ? 1 : 0) +
    (f.registrationStatus.length ? 1 : 0) +
    (f.dateFrom || f.dateTo ? 1 : 0) +
    (f.vendorTypes.length ? 1 : 0) +
    (f.serviceOfferings.length ? 1 : 0)
  );
}

export function WaitlistPage() {
  const { notify } = useToast();

  const [providers, setProviders] = useState<ServiceProvider[]>(SERVICE_PROVIDERS);
  const [tab, setTab] = useState<WaitlistTab>('Service Providers');
  const [search, setSearch] = useState('');
  const [sidebarFilters, setSidebarFilters] = useState<SidebarFilters>(
    EMPTY_SIDEBAR_FILTERS
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFilters>(
    EMPTY_COLUMN_FILTERS
  );
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [sort, setSort] = useState<SortState | null>(null);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [modalProvider, setModalProvider] = useState<ServiceProvider | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Full result set after every filter, before pagination.
  const filtered = useMemo(() => {
    let rows = providers;
    rows = applySidebarFilters(rows, sidebarFilters);
    rows = applySearch(rows, search);
    rows = applyColumnFilters(rows, columnFilters);
    rows = applySort(rows, sort);
    return rows;
  }, [providers, sidebarFilters, search, columnFilters, sort]);

  const pageResult = useMemo(
    () => paginate(filtered, page, PAGE_SIZE),
    [filtered, page]
  );

  // Any change to the query resets pagination to the first page.
  useEffect(() => {
    setPage(1);
  }, [sidebarFilters, search, columnFilters, sort, tab]);

  const activeSidebarCount = countActiveSidebarFilters(sidebarFilters);
  const columnFilterCount = useMemo(
    () =>
      Object.entries(columnFilters).filter(([, v]) => v !== '').length,
    [columnFilters]
  );

  /* ----- selection ----- */
  const pageRows = pageResult.rows;
  const pageAllSelected =
    pageRows.length > 0 && pageRows.every((r) => selectedIds.has(r.id));
  const pageSomeSelected =
    pageRows.some((r) => selectedIds.has(r.id)) && !pageAllSelected;

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const togglePage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (pageAllSelected) {
        pageRows.forEach((r) => next.delete(r.id));
      } else {
        pageRows.forEach((r) => next.add(r.id));
      }
      return next;
    });
  };

  /* ----- sorting ----- */
  const handleSort = (column: SortableColumn) => {
    setSort((prev) => {
      if (prev?.column !== column) return { column, direction: 'asc' };
      if (prev.direction === 'asc') return { column, direction: 'desc' };
      return null; // third click clears the sort
    });
  };

  /* ----- sidebar filters ----- */
  const handleApplyFilters = (next: SidebarFilters) => {
    setSidebarFilters(next);
    setDrawerOpen(false);
    const n = countActiveSidebarFilters(next);
    notify(
      n === 0 ? 'Filters applied — showing all providers' : `Filters applied — ${n} active`,
      'success'
    );
  };

  const handleClearFilters = () => {
    setSidebarFilters(EMPTY_SIDEBAR_FILTERS);
    setColumnFilters(EMPTY_COLUMN_FILTERS);
    setSearch('');
    setSort(null);
    notify('Filters cleared', 'info');
  };

  /* ----- row actions ----- */
  const handleEdit = (provider: ServiceProvider) => setModalProvider(provider);

  const handleView = (provider: ServiceProvider) => {
    notify(`Opening ${provider.name}'s profile…`, 'info');
    window.open(
      `https://example.com/service-providers/${provider.id}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleUpdateProvider = (
    id: string,
    patch: Partial<ServiceProvider>,
    message: string
  ) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
    setModalProvider((prev) => (prev && prev.id === id ? { ...prev, ...patch } : prev));
    notify(message, 'success');
  };

  return (
    <div className={styles.shell}>
      <TopNav onOpenSidebar={() => setDrawerOpen(true)} />

      <div className={styles.layout}>
        <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <FilterPanel
            applied={sidebarFilters}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
          />
        </Sidebar>

        <main className={styles.main}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.title}>Waitlist</h1>
              <TabSwitcher active={tab} onChange={setTab} />
            </div>
            {tab === 'Service Providers' && (
              <SearchBar value={search} onChange={setSearch} />
            )}
          </div>

          {tab === 'Customers' ? (
            <div className={styles.placeholder}>
              <Icon name="user" size={26} />
              <p className={styles.placeholderTitle}>Customers waitlist</p>
              <p>
                This assessment covers the <strong>Service Providers</strong>{' '}
                view. Switch back to see the table.
              </p>
            </div>
          ) : (
            <>
              <div className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                  <button
                    type="button"
                    className={styles.drawerBtn}
                    onClick={() => setDrawerOpen(true)}
                  >
                    <Icon name="filter" size={15} />
                    Filters
                    {activeSidebarCount > 0 && (
                      <span className={styles.countPill}>{activeSidebarCount}</span>
                    )}
                  </button>

                  <button
                    type="button"
                    className={`${styles.columnsBtn} ${
                      showColumnFilters ? styles.columnsBtnActive : ''
                    }`}
                    onClick={() => setShowColumnFilters((v) => !v)}
                    aria-pressed={showColumnFilters}
                  >
                    <Icon name="sort" size={15} />
                    Column filters
                    {columnFilterCount > 0 && (
                      <span className={styles.countPill}>{columnFilterCount}</span>
                    )}
                  </button>

                  {selectedIds.size > 0 && (
                    <span className={styles.selectionInfo}>
                      {selectedIds.size} selected
                      <button
                        type="button"
                        className={styles.linkBtn}
                        onClick={() => setSelectedIds(new Set())}
                      >
                        Clear
                      </button>
                    </span>
                  )}
                </div>

                <p className={styles.resultCount}>
                  {pageResult.total > 0
                    ? `Showing ${pageResult.from}–${pageResult.to} of ${pageResult.total}`
                    : '0 results'}
                </p>
              </div>

              <ProvidersTable
                rows={pageRows}
                sort={sort}
                onSort={handleSort}
                showColumnFilters={showColumnFilters}
                columnFilters={columnFilters}
                onColumnFilterChange={setColumnFilters}
                selectedIds={selectedIds}
                onToggleRow={toggleRow}
                onTogglePage={togglePage}
                pageAllSelected={pageAllSelected}
                pageSomeSelected={pageSomeSelected}
                onEdit={handleEdit}
                onView={handleView}
              />

              <div className={styles.footerRow}>
                <Pagination
                  page={pageResult.page}
                  pageCount={pageResult.pageCount}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </main>
      </div>

      {modalProvider && (
        <ProviderModal
          provider={modalProvider}
          onClose={() => setModalProvider(null)}
          onUpdate={handleUpdateProvider}
        />
      )}
    </div>
  );
}

import { Icon } from '../ui/Icon';
import styles from './Pagination.module.css';

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

/** Compact page list with ellipses, e.g. 1 … 4 [5] 6 … 12 */
function pageList(current: number, total: number): Array<number | '...'> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: Array<number | '...'> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push('...');
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push('...');
  pages.push(total);
  return pages;
}

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  const go = (p: number) => onPageChange(Math.min(Math.max(1, p), pageCount));

  return (
    <nav className={styles.pagination} aria-label="Table pagination">
      <button
        type="button"
        className={styles.arrow}
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <Icon name="chevron-left" size={16} />
      </button>

      <ul className={styles.pages}>
        {pageList(page, pageCount).map((p, i) =>
          p === '...' ? (
            <li key={`gap-${i}`} className={styles.gap} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                className={p === page ? styles.pageActive : styles.page}
                onClick={() => go(p)}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            </li>
          )
        )}
      </ul>

      <button
        type="button"
        className={styles.arrow}
        onClick={() => go(page + 1)}
        disabled={page >= pageCount}
        aria-label="Next page"
      >
        <Icon name="chevron-right" size={16} />
      </button>
    </nav>
  );
}

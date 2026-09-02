import type { ProviderStatus } from '../../types';
import styles from './StatusBadge.module.css';

export function StatusBadge({ status }: { status: ProviderStatus }) {
  if (status === 'Pending') {
    return (
      <span className={styles.pending} aria-label="No status yet">
        —
      </span>
    );
  }

  return (
    <span
      className={`${styles.badge} ${
        status === 'Onboarded' ? styles.onboarded : styles.rejected
      }`}
    >
      <span className={styles.dot} aria-hidden="true" />
      {status}
    </span>
  );
}

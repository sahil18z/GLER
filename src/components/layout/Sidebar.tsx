import { useEffect, type ReactNode } from 'react';
import { Icon } from '../ui/Icon';
import styles from './Sidebar.module.css';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Sidebar({ open, onClose, children }: SidebarProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`${styles.overlay} ${open ? styles.overlayShown : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}
        aria-label="Filters"
      >
        <div className={styles.brandRow}>
          <div className={styles.brand}>
            <span className={styles.brandName}>gler</span>
            <span className={styles.brandSpark} aria-hidden="true">
              ✦
            </span>
            <span className={styles.brandSub}>Admin Panel</span>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close filters"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className={styles.navItem} aria-current="page">
          User Management
        </div>

        <div className={styles.scroll}>{children}</div>
      </aside>
    </>
  );
}

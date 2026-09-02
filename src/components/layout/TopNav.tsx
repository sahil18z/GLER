import { Icon } from '../ui/Icon';
import styles from './TopNav.module.css';

const NAV_ITEMS = [
  'Service Dashboard',
  'Finance Forecast',
  'Human Resources',
  'Users',
  'Compliances & Verification',
];

const ACTIVE_ITEM = 'Human Resources';

export function TopNav({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  return (
    <header className={styles.nav}>
      <button
        type="button"
        className={styles.menuBtn}
        onClick={onOpenSidebar}
        aria-label="Open filters"
      >
        <Icon name="menu" size={20} />
      </button>

      <nav className={styles.links} aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <a
            key={item}
            href="#"
            onClick={(e) => e.preventDefault()}
            className={item === ACTIVE_ITEM ? styles.linkActive : styles.link}
            aria-current={item === ACTIVE_ITEM ? 'page' : undefined}
          >
            {item}
          </a>
        ))}
      </nav>

      <div className={styles.actions}>
        <button type="button" className={styles.iconBtn} aria-label="Notifications">
          <Icon name="bell" size={19} />
          <span className={styles.dot} />
        </button>
        <button type="button" className={styles.iconBtn} aria-label="Messages">
          <Icon name="chat" size={19} />
        </button>
        <div className={styles.user}>
          <span className={styles.avatar} aria-hidden="true">
            MS
          </span>
          <span className={styles.userMeta}>
            <span className={styles.userName}>Max Smith</span>
            <span className={styles.userLoc}>London, UK</span>
          </span>
        </div>
      </div>
    </header>
  );
}

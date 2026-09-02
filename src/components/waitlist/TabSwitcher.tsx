import styles from './TabSwitcher.module.css';

export type WaitlistTab = 'Service Providers' | 'Customers';

const TABS: WaitlistTab[] = ['Service Providers', 'Customers'];

interface TabSwitcherProps {
  active: WaitlistTab;
  onChange: (tab: WaitlistTab) => void;
}

export function TabSwitcher({ active, onChange }: TabSwitcherProps) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Waitlist segment">
      {TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={tab === active}
          className={tab === active ? styles.tabActive : styles.tab}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

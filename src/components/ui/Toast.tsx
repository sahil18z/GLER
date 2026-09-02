import { useToast } from '../../hooks/useToast';
import { Icon } from './Icon';
import styles from './Toast.module.css';

export function ToastViewport() {
  const { toasts, dismiss } = useToast();

  return (
    <div className={styles.viewport} role="region" aria-label="Notifications">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${styles.toast} ${styles[t.variant]}`}
          role="status"
        >
          <span className={styles.icon}>
            <Icon
              name={t.variant === 'error' ? 'close' : 'check-circle'}
              size={18}
            />
          </span>
          <p className={styles.message}>{t.message}</p>
          <button
            type="button"
            className={styles.close}
            onClick={() => dismiss(t.id)}
            aria-label="Dismiss notification"
          >
            <Icon name="close" size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}

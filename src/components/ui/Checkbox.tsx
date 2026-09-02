import { useEffect, useRef } from 'react';
import styles from './Checkbox.module.css';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
  label: string;
  /** Render the label text visibly (default) or for screen readers only. */
  hideLabel?: boolean;
  disabled?: boolean;
}

export function Checkbox({
  checked,
  onChange,
  indeterminate = false,
  label,
  hideLabel = false,
  disabled = false,
}: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate && !checked;
  }, [indeterminate, checked]);

  return (
    <label className={`${styles.wrap} ${disabled ? styles.disabled : ''}`}>
      <input
        ref={ref}
        type="checkbox"
        className={styles.input}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={styles.box} aria-hidden="true" />
      <span className={hideLabel ? 'visually-hidden' : styles.label}>{label}</span>
    </label>
  );
}

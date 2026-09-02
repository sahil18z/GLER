import { useEffect, useRef, useState } from 'react';
import {
  isoToMmddyyyy,
  maskMmddyyyy,
  mmddyyyyToIso,
} from '../../lib/format';
import { Icon } from '../ui/Icon';
import styles from './DateField.module.css';

interface DateFieldProps {
  /** ISO value (`YYYY-MM-DD`) or `''`. */
  value: string;
  /** Emits an ISO string, or `''` while the text is incomplete / invalid. */
  onChange: (iso: string) => void;
  caption: string;
  placeholder: string;
  ariaLabel: string;
}

export function DateField({
  value,
  onChange,
  caption,
  placeholder,
  ariaLabel,
}: DateFieldProps) {
  const [text, setText] = useState(() => isoToMmddyyyy(value));
  const nativeRef = useRef<HTMLInputElement>(null);

  // Reflect external resets (e.g. "Clear Filters") back into the text field.
  useEffect(() => {
    setText(isoToMmddyyyy(value));
  }, [value]);

  const handleText = (raw: string) => {
    const masked = maskMmddyyyy(raw);
    setText(masked);
    onChange(mmddyyyyToIso(masked));
  };

  const invalid = text.length === 10 && mmddyyyyToIso(text) === '';

  return (
    <label className={styles.field}>
      <span className={styles.caption}>{caption}</span>
      <span className={styles.inputWrap}>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          className={`${styles.input} ${invalid ? styles.inputInvalid : ''}`}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-invalid={invalid || undefined}
          value={text}
          onChange={(e) => handleText(e.target.value)}
        />
        <button
          type="button"
          className={styles.pickBtn}
          aria-label={`Open calendar (${placeholder.toLowerCase()})`}
          onClick={() => {
            const el = nativeRef.current;
            if (!el) return;
            if (typeof el.showPicker === 'function') el.showPicker();
            else el.focus();
          }}
        >
          <Icon name="calendar" size={15} />
        </button>
        <input
          ref={nativeRef}
          type="date"
          className={styles.nativePicker}
          tabIndex={-1}
          aria-hidden="true"
          value={mmddyyyyToIso(text)}
          onChange={(e) => {
            const iso = e.target.value;
            setText(isoToMmddyyyy(iso));
            onChange(iso);
          }}
        />
      </span>
    </label>
  );
}

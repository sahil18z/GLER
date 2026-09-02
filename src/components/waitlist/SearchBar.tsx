import { useEffect, useRef, useState } from 'react';
import { Icon } from '../ui/Icon';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  /** Committed search value (already applied to the table). */
  value: string;
  /** Fired live (debounced) as the user types, and immediately on Enter. */
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [text, setText] = useState(value);
  const debounceRef = useRef<number>();

  // Keep the input in sync if the value is reset elsewhere (e.g. Clear Filters).
  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => () => window.clearTimeout(debounceRef.current), []);

  const commit = (next: string) => {
    window.clearTimeout(debounceRef.current);
    onChange(next.trim());
  };

  const handleInput = (next: string) => {
    setText(next);
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => onChange(next.trim()), 250);
  };

  return (
    <div className={styles.wrap}>
      <Icon name="search" size={17} className={styles.icon} />
      <input
        type="search"
        className={styles.input}
        placeholder="Search User"
        aria-label="Search service providers"
        autoComplete="off"
        value={text}
        onChange={(e) => handleInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit(text);
          }
        }}
      />
    </div>
  );
}

import { useState, type FormEvent } from 'react';
import {
  EMPTY_SIDEBAR_FILTERS,
  type SidebarFilters,
  type VendorType,
  type ServiceOffering,
} from '../../types';
import { Checkbox } from '../ui/Checkbox';
import { DateField } from './DateField';
import styles from './FilterPanel.module.css';

interface FilterPanelProps {
  applied: SidebarFilters;
  onApply: (filters: SidebarFilters) => void;
  onClear: () => void;
}

const REG_STATUS: Array<'Onboarded' | 'Rejected'> = ['Onboarded', 'Rejected'];
const VENDOR_TYPES: VendorType[] = ['Independent', 'Company'];
const SERVICE_OFFERINGS: ServiceOffering[] = [
  'Housekeeping',
  'Window Cleaning',
  'Car Valet',
];

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

export function FilterPanel({ applied, onApply, onClear }: FilterPanelProps) {
  const [draft, setDraft] = useState<SidebarFilters>(applied);

  const set = <K extends keyof SidebarFilters>(key: K, val: SidebarFilters[K]) =>
    setDraft((d) => ({ ...d, [key]: val }));

  const handleApply = (e: FormEvent) => {
    e.preventDefault();
    onApply(draft);
  };

  const handleClear = () => {
    setDraft(EMPTY_SIDEBAR_FILTERS);
    onClear();
  };

  return (
    <form className={styles.panel} onSubmit={handleApply}>
      {/* Postcode */}
      <div className={styles.group}>
        <label className="field-label" htmlFor="f-postcode">
          Postcode
        </label>
        <input
          id="f-postcode"
          type="text"
          className="text-input"
          placeholder="ZIP"
          autoComplete="off"
          value={draft.postcode}
          onChange={(e) => set('postcode', e.target.value)}
        />
      </div>

      {/* Registration Status */}
      <fieldset className={styles.group}>
        <legend className="field-label">Registration Status</legend>
        <div className={styles.checks}>
          {REG_STATUS.map((s) => (
            <Checkbox
              key={s}
              label={s}
              checked={draft.registrationStatus.includes(s)}
              onChange={() =>
                set('registrationStatus', toggle(draft.registrationStatus, s))
              }
            />
          ))}
        </div>
      </fieldset>

      {/* Date Registered */}
      <fieldset className={styles.group}>
        <legend className="field-label">Date Registered</legend>
        <div className={styles.dateRow}>
          <DateField
            caption="Date"
            placeholder="Start"
            ariaLabel="Registered from date"
            value={draft.dateFrom}
            onChange={(iso) => set('dateFrom', iso)}
          />
          <DateField
            caption="Date"
            placeholder="End"
            ariaLabel="Registered to date"
            value={draft.dateTo}
            onChange={(iso) => set('dateTo', iso)}
          />
        </div>
        <p className={styles.dateHelp}>MM/DD/YYYY</p>
      </fieldset>

      {/* Vendor Type */}
      <fieldset className={styles.group}>
        <legend className="field-label">Vendor Type</legend>
        <div className={styles.checks}>
          {VENDOR_TYPES.map((v) => (
            <Checkbox
              key={v}
              label={v}
              checked={draft.vendorTypes.includes(v)}
              onChange={() => set('vendorTypes', toggle(draft.vendorTypes, v))}
            />
          ))}
        </div>
      </fieldset>

      {/* Service Offering */}
      <fieldset className={styles.group}>
        <legend className="field-label">Service Offering</legend>
        <div className={styles.checks}>
          {SERVICE_OFFERINGS.map((s) => (
            <Checkbox
              key={s}
              label={s}
              checked={draft.serviceOfferings.includes(s)}
              onChange={() =>
                set('serviceOfferings', toggle(draft.serviceOfferings, s))
              }
            />
          ))}
        </div>
      </fieldset>

      <div className={styles.actions}>
        <button type="submit" className="btn btn-primary">
          Apply Filters
        </button>
        <button type="button" className="btn btn-ghost" onClick={handleClear}>
          Clear Filters
        </button>
      </div>
    </form>
  );
}

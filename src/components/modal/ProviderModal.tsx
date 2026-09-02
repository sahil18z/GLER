import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ServiceProvider, ProviderStatus } from '../../types';
import { formatShortDate } from '../../lib/format';
import { Icon } from '../ui/Icon';
import styles from './ProviderModal.module.css';

interface ProviderModalProps {
  provider: ServiceProvider;
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<ServiceProvider>, message: string) => void;
}

export function ProviderModal({ provider, onClose, onUpdate }: ProviderModalProps) {
  const [note, setNote] = useState(provider.note);
  const [editingNote, setEditingNote] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);

  const noteDirty = note.trim() !== provider.note.trim();

  const persistNoteIfDirty = () => {
    if (noteDirty) {
      onUpdate(provider.id, { note: note.trim() }, 'Internal note saved');
    }
  };

  const closeWithNote = () => {
    persistNoteIfDirty();
    onClose();
  };

  // Lock body scroll + move focus into the dialog on mount.
  useEffect(() => {
    dialogRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  // Re-bind Escape each render so it always sees the current note.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeWithNote();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  const decide = (status: ProviderStatus) => {
    onUpdate(
      provider.id,
      { status, note: note.trim() },
      `${provider.name} ${status === 'Onboarded' ? 'onboarded' : 'rejected'}`
    );
    onClose();
  };

  const startEditingNote = () => {
    setEditingNote(true);
    window.setTimeout(() => noteRef.current?.focus(), 0);
  };

  return createPortal(
    <div className={styles.overlay} onMouseDown={closeWithNote}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="provider-modal-title"
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <span className={styles.headerTitle}>
            <Icon name="user" size={16} />
            User Details
          </span>
          <button
            type="button"
            className={styles.close}
            onClick={closeWithNote}
            aria-label="Close dialog"
          >
            <Icon name="close" size={18} />
          </button>
        </header>

        <div className={styles.body}>
          <div className={styles.identity}>
            <div>
              <h2 id="provider-modal-title" className={styles.name}>
                {provider.name}
              </h2>
              <p className={styles.subEmail}>
                <Icon name="mail" size={13} /> {provider.email}
              </p>
            </div>
            <div className={styles.tags}>
              <span className={styles.tag}>{provider.vendorType}</span>
              <span className={styles.tagSoft}>invited</span>
            </div>
          </div>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Contact Information</h3>
            <dl className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <Icon name="mail" size={14} />
                <span>{provider.email}</span>
              </div>
              <div className={styles.infoItem}>
                <Icon name="phone" size={14} />
                <span>{provider.phone}</span>
              </div>
              <div className={styles.infoItem}>
                <Icon name="pin" size={14} />
                <span>
                  {provider.postcode}, {provider.country}
                </span>
              </div>
              <div className={styles.infoItem}>
                <Icon name="calendar" size={14} />
                <span>Signed up {formatShortDate(provider.signupDate)}</span>
              </div>
            </dl>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Vendor Details</h3>
            <div className={styles.infoItem}>
              <Icon name="user" size={14} />
              <span>{provider.vendorType}</span>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Service Offering</h3>
            <p className={styles.offering}>{provider.serviceOffering}</p>
          </section>

          <section className={styles.section}>
            <div className={styles.notesHead}>
              <h3 className={styles.sectionTitle}>Internal Notes</h3>
              {!editingNote && (
                <button
                  type="button"
                  className={styles.editNote}
                  onClick={startEditingNote}
                >
                  <Icon name="edit" size={13} /> Edit
                </button>
              )}
            </div>
            {editingNote ? (
              <textarea
                ref={noteRef}
                className={styles.noteInput}
                placeholder="Add an internal note…"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            ) : (
              <p className={styles.noteText}>
                {provider.note || 'No note added yet'}
              </p>
            )}
          </section>
        </div>

        <footer className={styles.footer}>
          {editingNote && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                persistNoteIfDirty();
                setEditingNote(false);
              }}
            >
              Save Note
            </button>
          )}
          <div className={styles.footerMain}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => decide('Onboarded')}
            >
              Onboard
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => decide('Rejected')}
            >
              Reject
            </button>
          </div>
        </footer>
      </div>
    </div>,
    document.body
  );
}

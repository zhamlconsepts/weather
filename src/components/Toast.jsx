import React, { useEffect } from 'react';

export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className="toast-container">
      <div className="toast-box">
        <span style={{ fontSize: '1.2rem' }}>{toast.icon || '✨'}</span>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

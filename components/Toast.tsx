import React, { useState, useEffect, useCallback } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const icons = {
    success: <Check size={14} className="text-emerald-400" />,
    error: <AlertCircle size={14} className="text-red-400" />,
    info: <AlertCircle size={14} className="text-indigo-400" />,
  };

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl liquid-glass max-w-xs w-full animate-enter visible"
      style={{ minWidth: 220 }}
    >
      <div className="shrink-0">{icons[toast.type]}</div>
      <p className="text-sm text-white/90 flex-1">{toast.message}</p>
      <button onClick={() => onDismiss(toast.id)} className="shrink-0 text-white/30 hover:text-white/70 transition-colors">
        <X size={12} />
      </button>
    </div>
  );
};

// ── Toast container ──────────────────────────────

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none">
    {toasts.map(t => (
      <div key={t.id} className="pointer-events-auto">
        <ToastItem toast={t} onDismiss={onDismiss} />
      </div>
    ))}
  </div>
);

// ── Hook ────────────────────────────────────────

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success', duration = 3000) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  return { toasts, showToast, dismiss };
}

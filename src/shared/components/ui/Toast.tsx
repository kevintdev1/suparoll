"use client";

import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap, useGSAP } from "@/shared/lib/motion/gsap";
import { dur, ease } from "@/shared/lib/motion/tokens";

type ToastAction = {
  label: string;
  onAction: () => void;
};

type ToastItem = {
  id: string;
  message: string;
  action?: ToastAction;
};

type ToastContextValue = {
  toasts: ToastItem[];
  showToast: (message: string, action?: ToastAction) => void;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);
const TOAST_MS = 5000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, action?: ToastAction) => {
      const id = `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setToasts((current) => [...current, { id, message, action }]);

      window.setTimeout(() => {
        dismissToast(id);
      }, TOAST_MS);
    },
    [dismissToast],
  );

  const value = useMemo(
    () => ({ toasts, showToast, dismissToast }),
    [dismissToast, showToast, toasts],
  );

  return (
    <ToastContext value={value}>
      {children}
      <ToastViewport />
    </ToastContext>
  );
}

export function useToast() {
  const value = use(ToastContext);

  if (!value) {
    throw new Error("useToast debe usarse dentro de ToastProvider.");
  }

  return value;
}

function ToastViewport() {
  const { toasts, dismissToast } = useToast();

  return (
    <div
      className="pointer-events-none fixed bottom-6 left-1/2 z-[80] flex w-[min(100%-2rem,24rem)] -translate-x-1/2 flex-col gap-2"
      aria-live="polite"
      aria-relevant="additions"
    >
      {toasts.map((toast) => (
        <ToastCard
          key={toast.id}
          toast={toast}
          onDismiss={() => dismissToast(toast.id)}
        />
      ))}
    </div>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  const cardRef = useRef<HTMLOutputElement>(null);

  useGSAP(
    () => {
      const card = cardRef.current;

      if (!card) {
        return;
      }

      gsap.fromTo(
        card,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: dur.base, ease: ease.out },
      );
    },
    { scope: cardRef },
  );

  return (
    <output
      ref={cardRef}
      className="pointer-events-auto flex items-center justify-between gap-4 rounded-[8px] bg-ink px-4 py-3 text-small text-paper shadow-instant"
    >
      <p>{toast.message}</p>
      <div className="flex shrink-0 items-center gap-2">
        {toast.action ? (
          <button
            type="button"
            className="font-mono text-label uppercase tracking-wider text-paper focus-visible:focus-ring"
            onClick={() => {
              toast.action?.onAction();
              onDismiss();
            }}
          >
            {toast.action.label}
          </button>
        ) : null}
        <button
          type="button"
          className="text-paper/70 focus-visible:focus-ring"
          onClick={onDismiss}
          aria-label="Cerrar aviso"
        >
          ×
        </button>
      </div>
    </output>
  );
}

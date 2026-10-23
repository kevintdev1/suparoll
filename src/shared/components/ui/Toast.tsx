"use client";

import { X } from "lucide-react";
import {
  createContext,
  type ReactNode,
  type RefObject,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useFocusWithin } from "@/shared/hooks/useFocusWithin";
import { useHovered } from "@/shared/hooks/useHovered";
import { gsap, useGSAP } from "@/shared/lib/motion/gsap";
import { MOTION_OK } from "@/shared/lib/motion/media";
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
  showToast: (message: string, action?: ToastAction) => void;
  setHost: (host: HTMLElement | null) => void;
};

type ToastProviderProps = {
  children: ReactNode;
  dismissLabel: string;
};

const ToastContext = createContext<ToastContextValue | null>(null);
const TOAST_MS = 5000;

export function ToastProvider({ children, dismissLabel }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [host, setHost] = useState<HTMLElement | null>(null);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, action?: ToastAction) => {
    const id = `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((current) => [...current, { id, message, action }]);
  }, []);

  const value = useMemo(() => ({ showToast, setHost }), [showToast]);

  const viewport = (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 left-1/2 z-80 flex w-[min(100%-2rem,24rem)] -translate-x-1/2 flex-col gap-2"
    >
      {toasts.map((toast) => (
        <ToastCard
          key={toast.id}
          toast={toast}
          dismissLabel={dismissLabel}
          onDismiss={dismissToast}
        />
      ))}
    </div>
  );

  return (
    <ToastContext value={value}>
      {children}
      {host ? createPortal(viewport, host) : viewport}
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

export function useToastHost(
  hostRef: RefObject<HTMLElement | null>,
  active: boolean,
) {
  const { setHost } = useToast();

  useEffect(() => {
    if (!active) {
      return;
    }

    setHost(hostRef.current);

    return () => setHost(null);
  }, [active, hostRef, setHost]);
}

type ToastCardProps = {
  toast: ToastItem;
  dismissLabel: string;
  onDismiss: (id: string) => void;
};

function ToastCard({ toast, dismissLabel, onDismiss }: ToastCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const hovered = useHovered(cardRef);
  const focused = useFocusWithin(cardRef);
  const paused = hovered || focused;

  useEffect(() => {
    if (paused) {
      return;
    }

    const timer = window.setTimeout(() => onDismiss(toast.id), TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [onDismiss, paused, toast.id]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.from(cardRef.current, {
          y: 16,
          opacity: 0,
          duration: dur.base,
          ease: ease.out,
        });
      });

      return () => mm.revert();
    },
    { scope: cardRef },
  );

  return (
    <div
      ref={cardRef}
      className="pointer-events-auto flex items-center justify-between gap-2 rounded-input bg-ink py-1 pr-1 pl-4 text-small text-paper shadow-instant"
    >
      <p>{toast.message}</p>
      <div className="flex shrink-0 items-center">
        {toast.action ? (
          <button
            type="button"
            className="min-h-11 px-3 font-mono-label focus-visible:focus-ring"
            onClick={() => {
              toast.action?.onAction();
              onDismiss(toast.id);
            }}
          >
            {toast.action.label}
          </button>
        ) : null}
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center text-paper/70 hover:text-paper focus-visible:focus-ring"
          onClick={() => onDismiss(toast.id)}
          aria-label={dismissLabel}
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>
    </div>
  );
}

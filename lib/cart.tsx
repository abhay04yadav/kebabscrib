"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type CartLine = {
  id: string;
  name: string;
  detail: string;
  price: number;
  qty: number;
  img: string;
  note?: string;
};

export type NewLine = Omit<CartLine, "id" | "qty"> & { qty?: number };

type CartState = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  ready: boolean;
  cartOpen: boolean;
  toast: string | null;
  add: (line: NewLine) => void;
  setQty: (id: string, delta: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartState | null>(null);

const STORAGE_KEY = "kc.cart.v1";

function readStored(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine =>
        !!l &&
        typeof l === "object" &&
        typeof (l as CartLine).name === "string" &&
        typeof (l as CartLine).price === "number" &&
        typeof (l as CartLine).qty === "number",
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // hydrate from localStorage after mount so SSR and first paint agree
  useEffect(() => {
    setLines(readStored());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* private mode / quota — the cart still works for this session */
    }
  }, [lines, ready]);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  const fireToast = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const add = useCallback(
    (line: NewLine) => {
      const qty = line.qty ?? 1;
      setLines((prev) => {
        const i = prev.findIndex(
          (l) =>
            l.name === line.name &&
            l.detail === line.detail &&
            (l.note || "") === (line.note || ""),
        );
        if (i > -1) {
          const next = prev.slice();
          next[i] = { ...next[i], qty: next[i].qty + qty };
          return next;
        }
        return prev.concat([
          {
            ...line,
            qty,
            id:
              "l" +
              Date.now().toString(36) +
              Math.random().toString(36).slice(2, 7),
          },
        ]);
      });
      fireToast(line.name + " added");
    },
    [fireToast],
  );

  const setQty = useCallback((id: string, delta: number) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.id === id);
      if (i < 0) return prev;
      const next = prev.slice();
      const qty = next[i].qty + delta;
      if (qty < 1) next.splice(i, 1);
      else next[i] = { ...next[i], qty };
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartState>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.price * l.qty, 0);
    return {
      lines,
      count,
      subtotal,
      ready,
      cartOpen,
      toast,
      add,
      setQty,
      remove,
      clear,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
    };
  }, [lines, ready, cartOpen, toast, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

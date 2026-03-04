export type WatchItem = {
  id: string;
  name?: string;
  industry?: string | null;
  funding_ask?: number | string | null;
  risk_score?: number | null;
  saved_at: number;
};

function keyFor(userId: string | number | null | undefined): string {
  const uid = userId ? String(userId) : "anon";
  return `mp_watchlist_${uid}`;
}

export const watchlist = {
  load(userId?: string | number | null): WatchItem[] {
    try {
      const raw = localStorage.getItem(keyFor(userId || null));
      return raw ? (JSON.parse(raw) as WatchItem[]) : [];
    } catch {
      return [];
    }
  },
  save(userId: string | number | null | undefined, items: WatchItem[]) {
    try {
      localStorage.setItem(keyFor(userId || null), JSON.stringify(items));
    } catch {
      // ignore
    }
  },
  has(userId: string | number | null | undefined, id: string): boolean {
    return this.load(userId).some((w) => w.id === id);
  },
  add(userId: string | number | null | undefined, item: Omit<WatchItem, "saved_at">) {
    const list = this.load(userId);
    if (list.find((w) => w.id === item.id)) return;
    list.unshift({ ...item, saved_at: Date.now() });
    this.save(userId, list);
  },
  remove(userId: string | number | null | undefined, id: string) {
    const list = this.load(userId).filter((w) => w.id !== id);
    this.save(userId, list);
  },
  clear(userId: string | number | null | undefined) {
    this.save(userId, []);
  },
};


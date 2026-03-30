"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  getArtists, createArtist, updateArtist, deleteArtist,
  getBookings, updateBooking, deleteBooking,
  getServices, createService, updateService, deleteService,
  getPortfolio, createPortfolioItem, updatePortfolioItem, deletePortfolioItem,
  isAuthenticated, removeToken,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  UsersIcon, CalendarIcon, BriefcaseIcon, ImageIcon,
  PlusIcon, Trash2Icon, PencilIcon, XIcon, CheckIcon,
  LayoutDashboardIcon, LogOutIcon, RefreshCwIcon,
} from "lucide-react";

/* ── Types ── */
type Tab = "artists" | "bookings" | "services" | "portfolio";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  CONFIRMED: "bg-green-500/20 text-green-400 border-green-500/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
  COMPLETED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const statusLabels: Record<string, string> = {
  PENDING: "Ожидает",
  CONFIRMED: "Подтверждена",
  CANCELLED: "Отменена",
  COMPLETED: "Завершена",
};

/* ════════════════════════════════════════
   ADMIN PAGE
   ════════════════════════════════════════ */

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("bookings");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.push("/admin/login");
  };

  // Data
  const [artists, setArtists] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);

  // Modals
  const [showArtistForm, setShowArtistForm] = useState(false);
  const [editingArtist, setEditingArtist] = useState<any>(null);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const load = async () => {
    if (!isAuthenticated()) {
      router.push("/admin/login");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled([getArtists(), getBookings(), getServices(), getPortfolio()]);
      if (results[0].status === "fulfilled") setArtists(results[0].value);
      if (results[1].status === "fulfilled") setBookings(results[1].value);
      if (results[2].status === "fulfilled") setServices(results[2].value);
      if (results[3].status === "fulfilled") setPortfolio(results[3].value);

      const failed = results.filter(r => r.status === "rejected");
      if (failed.length === 4) {
        setError("Не удалось загрузить данные. Убедитесь, что бэкенд запущен на порту 4000.");
      }
    } catch (e: any) {
      if (e.message === "Unauthorized") return;
      setError("Не удалось загрузить данные. Убедитесь, что бэкенд запущен на порту 4000.");
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const tabs: { id: Tab; label: string; icon: ReactNode; count: number }[] = [
    { id: "bookings", label: "Заявки", icon: <CalendarIcon className="size-4" />, count: bookings.length },
    { id: "artists", label: "Мастера", icon: <UsersIcon className="size-4" />, count: artists.length },
    { id: "services", label: "Услуги", icon: <BriefcaseIcon className="size-4" />, count: services.length },
    { id: "portfolio", label: "Портфолио", icon: <ImageIcon className="size-4" />, count: portfolio.length },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card p-6 md:flex md:flex-col">
        <div className="flex items-center gap-2 mb-10">
          <LayoutDashboardIcon className="size-5 text-primary" />
          <span className="text-lg font-bold">Клякса Admin</span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                tab === t.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {t.icon}
              {t.label}
              <span className="ml-auto text-xs opacity-60">{t.count}</span>
            </button>
          ))}
        </nav>

        <a href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-4">
          На сайт
        </a>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors mt-2">
          <LogOutIcon className="size-4" />
          Выйти
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-8">
        {/* Mobile tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 md:hidden">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                tab === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{tabs.find((t) => t.id === tab)?.label}</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCwIcon className={`size-4 mr-1 ${loading ? "animate-spin" : ""}`} />
              Обновить
            </Button>
            {tab === "artists" && (
              <Button size="sm" onClick={() => { setEditingArtist(null); setShowArtistForm(true); }}>
                <PlusIcon className="size-4 mr-1" /> Добавить мастера
              </Button>
            )}
            {tab === "services" && (
              <Button size="sm" onClick={() => { setEditingService(null); setShowServiceForm(true); }}>
                <PlusIcon className="size-4 mr-1" /> Добавить услугу
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>
        )}

        {/* Content */}
        {tab === "bookings" && <BookingsTab bookings={bookings} onUpdate={load} />}
        {tab === "artists" && <ArtistsTab artists={artists} onEdit={(a) => { setEditingArtist(a); setShowArtistForm(true); }} onDelete={async (id) => { await deleteArtist(id); load(); }} />}
        {tab === "services" && <ServicesTab services={services} onEdit={(s) => { setEditingService(s); setShowServiceForm(true); }} onDelete={async (id) => { await deleteService(id); load(); }} />}
        {tab === "portfolio" && <PortfolioTab items={portfolio} />}

        {/* Artist form modal */}
        {showArtistForm && (
          <Modal onClose={() => setShowArtistForm(false)}>
            <ArtistForm
              initial={editingArtist}
              onSave={async (data) => {
                if (editingArtist) await updateArtist(editingArtist.id, data);
                else await createArtist(data);
                setShowArtistForm(false);
                load();
              }}
            />
          </Modal>
        )}

        {/* Service form modal */}
        {showServiceForm && (
          <Modal onClose={() => setShowServiceForm(false)}>
            <ServiceForm
              initial={editingService}
              onSave={async (data) => {
                if (editingService) await updateService(editingService.id, data);
                else await createService(data);
                setShowServiceForm(false);
                load();
              }}
            />
          </Modal>
        )}
      </main>
    </div>
  );
}

/* ── BOOKINGS TAB ── */
function BookingsTab({ bookings, onUpdate }: { bookings: any[]; onUpdate: () => void }) {
  const handleStatus = async (id: string, status: string) => {
    await updateBooking(id, { status });
    onUpdate();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить заявку?")) return;
    await deleteBooking(id);
    onUpdate();
  };

  if (!bookings.length) return <EmptyState text="Заявок пока нет" />;

  return (
    <div className="space-y-3">
      {bookings.map((b) => (
        <div key={b.id} className="rounded-lg border border-border bg-card p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold">{b.name}</p>
              <p className="text-sm text-muted-foreground">{b.phone} {b.email && `/ ${b.email}`}</p>
              {b.message && <p className="mt-1 text-sm text-muted-foreground italic">{b.message}</p>}
              <p className="mt-1 text-xs text-muted-foreground">
                Мастер: {b.artist?.name || "—"} / Дата: {new Date(b.date).toLocaleDateString("ru", { timeZone: "UTC" })} в {new Date(b.date).toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColors[b.status] || ""}`}>
                {statusLabels[b.status] || b.status}
              </span>
              <select
                value={b.status}
                onChange={(e) => handleStatus(b.id, e.target.value)}
                className="rounded-md border border-border bg-background px-2 py-1 text-xs"
              >
                <option value="PENDING">Ожидает</option>
                <option value="CONFIRMED">Подтверждена</option>
                <option value="CANCELLED">Отменена</option>
                <option value="COMPLETED">Завершена</option>
              </select>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(b.id)} className="text-red-400 hover:text-red-300">
                <Trash2Icon className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── ARTISTS TAB ── */
function ArtistsTab({ artists, onEdit, onDelete }: { artists: any[]; onEdit: (a: any) => void; onDelete: (id: string) => void }) {
  if (!artists.length) return <EmptyState text="Мастеров пока нет" />;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {artists.map((a) => (
        <div key={a.id} className="rounded-lg border border-border bg-card overflow-hidden">
          {a.photoUrl && <img src={a.photoUrl} alt={a.name} className="h-40 w-full object-cover" />}
          <div className="p-4">
            <h3 className="font-semibold">{a.name}</h3>
            {a.bio && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{a.bio}</p>}
            {a.styles?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {a.styles.map((s: string) => (
                  <Badge key={s} variant="secondary" className="text-[.65rem]">{s}</Badge>
                ))}
              </div>
            )}
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(a)}><PencilIcon className="size-3 mr-1" /> Изменить</Button>
              <Button variant="ghost" size="sm" className="text-red-400" onClick={() => { if (confirm("Удалить мастера?")) onDelete(a.id); }}>
                <Trash2Icon className="size-3 mr-1" /> Удалить
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── SERVICES TAB ── */
function ServicesTab({ services, onEdit, onDelete }: { services: any[]; onEdit: (s: any) => void; onDelete: (id: string) => void }) {
  if (!services.length) return <EmptyState text="Услуг пока нет" />;

  return (
    <div className="space-y-3">
      {services.map((s) => (
        <div key={s.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
          <div>
            <p className="font-semibold">{s.name}</p>
            {s.description && <p className="text-sm text-muted-foreground">{s.description}</p>}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold text-primary">{s.price.toLocaleString("ru")} ₽</span>
            <Button variant="ghost" size="icon" onClick={() => onEdit(s)}><PencilIcon className="size-4" /></Button>
            <Button variant="ghost" size="icon" className="text-red-400" onClick={() => { if (confirm("Удалить услугу?")) onDelete(s.id); }}>
              <Trash2Icon className="size-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── PORTFOLIO TAB ── */
function PortfolioTab({ items }: { items: any[] }) {
  if (!items.length) return <EmptyState text="Работ в портфолио пока нет" />;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {items.map((p) => (
        <div key={p.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-card">
          <img src={p.imageUrl} alt={p.title || ""} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 left-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            {p.style && <span className="text-[.6rem] font-semibold uppercase tracking-wider text-primary">{p.style}</span>}
            {p.title && <p className="text-sm font-medium text-white">{p.title}</p>}
            {p.artist?.name && <p className="text-xs text-white/60">{p.artist.name}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── FORMS ── */
function ArtistForm({ initial, onSave }: { initial?: any; onSave: (data: any) => void }) {
  const [name, setName] = useState(initial?.name || "");
  const [bio, setBio] = useState(initial?.bio || "");
  const [photoUrl, setPhotoUrl] = useState(initial?.photoUrl || "");
  const [styles, setStyles] = useState(initial?.styles?.join(", ") || "");

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ name, bio, photoUrl, styles: styles.split(",").map((s: string) => s.trim()).filter(Boolean) }); }} className="space-y-4">
      <h2 className="text-lg font-bold">{initial ? "Редактировать мастера" : "Новый мастер"}</h2>
      <Input label="Имя *" value={name} onChange={setName} required />
      <Input label="Описание" value={bio} onChange={setBio} />
      <Input label="URL фото" value={photoUrl} onChange={setPhotoUrl} placeholder="https://..." />
      <Input label="Стили (через запятую)" value={styles} onChange={setStyles} placeholder="Реализм, Графика, Ориентал" />
      <Button type="submit" className="w-full">{initial ? "Сохранить" : "Создать"}</Button>
    </form>
  );
}

function ServiceForm({ initial, onSave }: { initial?: any; onSave: (data: any) => void }) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [price, setPrice] = useState(initial?.price?.toString() || "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || "");

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ name, description, price: Number(price), imageUrl }); }} className="space-y-4">
      <h2 className="text-lg font-bold">{initial ? "Редактировать услугу" : "Новая услуга"}</h2>
      <Input label="Название *" value={name} onChange={setName} required />
      <Input label="Описание" value={description} onChange={setDescription} />
      <Input label="Цена (₽) *" value={price} onChange={setPrice} type="number" required />
      <Input label="URL изображения" value={imageUrl} onChange={setImageUrl} placeholder="https://..." />
      <Button type="submit" className="w-full">{initial ? "Сохранить" : "Создать"}</Button>
    </form>
  );
}

/* ── Helpers ── */
function Input({ label, value, onChange, ...props }: { label: string; value: string; onChange: (v: string) => void } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        {...props}
      />
    </div>
  );
}

function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <XIcon className="size-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <p className="text-lg">{text}</p>
      <p className="text-sm mt-1">Данные появятся здесь после добавления</p>
    </div>
  );
}

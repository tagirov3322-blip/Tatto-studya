"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  getArtists, createArtist, updateArtist, deleteArtist,
  getBookings, updateBooking, deleteBooking,
  getServices, createService, updateService, deleteService,
  getPortfolio, createPortfolioItem, updatePortfolioItem, deletePortfolioItem,
  getArtistSchedule, updateArtistSchedule,
  uploadFile,
  isAuthenticated, removeToken,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  UsersIcon, CalendarIcon, BriefcaseIcon, ImageIcon, ClockIcon,
  PlusIcon, Trash2Icon, PencilIcon, XIcon, CheckIcon,
  LayoutDashboardIcon, LogOutIcon, RefreshCwIcon, UploadIcon,
} from "lucide-react";

/* ── Types ── */
type Tab = "artists" | "bookings" | "services" | "portfolio" | "schedule";

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
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<any>(null);

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
    { id: "schedule", label: "График", icon: <ClockIcon className="size-4" />, count: artists.length },
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
            {tab === "portfolio" && (
              <Button size="sm" onClick={() => { setEditingPortfolio(null); setShowPortfolioForm(true); }}>
                <PlusIcon className="size-4 mr-1" /> Добавить работу
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
        {tab === "portfolio" && <PortfolioTab items={portfolio} artists={artists} onEdit={(p) => { setEditingPortfolio(p); setShowPortfolioForm(true); }} onDelete={async (id) => { await deletePortfolioItem(id); load(); }} />}
        {tab === "schedule" && <ScheduleTab artists={artists} />}

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

        {/* Portfolio form modal */}
        {showPortfolioForm && (
          <Modal onClose={() => setShowPortfolioForm(false)}>
            <PortfolioForm
              initial={editingPortfolio}
              artists={artists}
              onSave={async (data) => {
                if (editingPortfolio) await updatePortfolioItem(editingPortfolio.id, data);
                else await createPortfolioItem(data);
                setShowPortfolioForm(false);
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
function PortfolioTab({ items, artists, onEdit, onDelete }: { items: any[]; artists: any[]; onEdit: (p: any) => void; onDelete: (id: string) => void }) {
  if (!items.length) return <EmptyState text="Работ в портфолио пока нет" />;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {items.map((p) => (
        <div key={p.id} className="group relative overflow-hidden rounded-lg border border-border bg-card">
          <div className="aspect-square overflow-hidden">
            <img src={p.imageUrl} alt={p.title || ""} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          </div>
          <div className="p-3">
            {p.title && <p className="text-sm font-semibold truncate">{p.title}</p>}
            <div className="flex items-center gap-2 mt-1">
              {p.style && <Badge variant="secondary" className="text-[.6rem]">{p.style}</Badge>}
              {p.artist?.name && <span className="text-xs text-muted-foreground">{p.artist.name}</span>}
            </div>
            <div className="flex gap-1.5 mt-2">
              <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => onEdit(p)}>
                <PencilIcon className="size-3 mr-1" /> Изменить
              </Button>
              <Button variant="ghost" size="sm" className="text-red-400 text-xs" onClick={() => { if (confirm("Удалить работу?")) onDelete(p.id); }}>
                <Trash2Icon className="size-3" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── SCHEDULE TAB ── */
const ALL_TIMES = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
const WEEKDAYS_FULL = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
const MONTHS_RU_SCHED = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

function pad2(n: number) { return n.toString().padStart(2, "0"); }
function dateKey(y: number, m: number, d: number) { return `${y}-${pad2(m + 1)}-${pad2(d)}`; }

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function ScheduleTab({ artists }: { artists: any[] }) {
  const [selectedArtist, setSelectedArtist] = useState<string>(artists[0]?.id || "");
  const [schedule, setSchedule] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [weekStart, setWeekStart] = useState<Date>(() => getMonday(new Date()));

  // 7 days of the current week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const weekLabel = `${pad2(weekDays[0].getDate())} ${MONTHS_RU_SCHED[weekDays[0].getMonth()]} — ${pad2(weekDays[6].getDate())} ${MONTHS_RU_SCHED[weekDays[6].getMonth()]} ${weekDays[6].getFullYear()}`;

  useEffect(() => {
    if (!selectedArtist) return;
    setLoading(true);
    setSaved(false);
    getArtistSchedule(selectedArtist)
      .then((s) => setSchedule(s || {}))
      .catch(() => setSchedule({}))
      .finally(() => setLoading(false));
  }, [selectedArtist]);

  const toggleTime = (key: string, time: string) => {
    setSaved(false);
    setSchedule((prev) => {
      const slots = prev[key] || [];
      const has = slots.includes(time);
      const updated = has ? slots.filter((t) => t !== time) : [...slots, time].sort();
      const copy = { ...prev };
      if (updated.length === 0) { delete copy[key]; return copy; }
      return { ...copy, [key]: updated };
    });
  };

  const toggleDate = (key: string) => {
    setSaved(false);
    setSchedule((prev) => {
      const slots = prev[key] || [];
      const allSelected = ALL_TIMES.every((t) => slots.includes(t));
      const copy = { ...prev };
      if (allSelected) { delete copy[key]; return copy; }
      return { ...copy, [key]: [...ALL_TIMES] };
    });
  };

  const prevWeek = () => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const nextWeek = () => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  const goToday = () => setWeekStart(getMonday(new Date()));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateArtistSchedule(selectedArtist, schedule);
      setSaved(true);
    } catch { /* ignore */ }
    setSaving(false);
  };

  const isPast = (date: Date) => {
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return date < t;
  };

  if (!artists.length) return <EmptyState text="Сначала добавьте мастеров" />;

  return (
    <div className="space-y-6">
      {/* Artist selector */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground">Мастер:</span>
        {artists.map((a) => (
          <button
            key={a.id}
            onClick={() => setSelectedArtist(a.id)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedArtist === a.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {a.photoUrl ? (
              <img src={a.photoUrl} alt="" className="size-5 rounded-full object-cover" />
            ) : (
              <div className="size-5 rounded-full bg-primary/20 flex items-center justify-center text-[.6rem] font-bold">
                {a.name?.charAt(0)}
              </div>
            )}
            {a.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10 text-muted-foreground">Загрузка...</div>
      ) : (
        <>
          {/* Week navigation */}
          <div className="flex items-center justify-between">
            <button onClick={prevWeek} className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              ← Назад
            </button>
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold">{weekLabel}</span>
              <button onClick={goToday} className="rounded-md px-3 py-1 text-xs bg-muted text-muted-foreground hover:text-foreground transition-colors">
                Сегодня
              </button>
            </div>
            <button onClick={nextWeek} className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              Вперёд →
            </button>
          </div>

          {/* Schedule grid — 7 days × times */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground w-48">День</th>
                  {ALL_TIMES.map((t) => (
                    <th key={t} className="p-3 font-medium text-muted-foreground text-center">{t}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weekDays.map((date, i) => {
                  const key = dateKey(date.getFullYear(), date.getMonth(), date.getDate());
                  const daySlots = schedule[key] || [];
                  const allSelected = ALL_TIMES.every((t) => daySlots.includes(t));
                  const past = isPast(date);
                  const isWeekend = i >= 5;
                  const isToday = date.toDateString() === new Date().toDateString();

                  return (
                    <tr key={key} className={`border-b border-border last:border-0 transition-colors ${past ? "opacity-40" : "hover:bg-muted/30"} ${isWeekend ? "bg-muted/10" : ""}`}>
                      <td className="p-4">
                        <button
                          onClick={() => !past && toggleDate(key)}
                          disabled={past}
                          className="flex items-center gap-3 text-left hover:text-primary transition-colors disabled:cursor-not-allowed disabled:hover:text-inherit"
                        >
                          <div className={`size-5 rounded border flex items-center justify-center transition-colors ${
                            allSelected ? "bg-primary border-primary" : daySlots.length > 0 ? "border-primary bg-primary/20" : "border-border"
                          }`}>
                            {allSelected && <CheckIcon className="size-3.5 text-primary-foreground" />}
                          </div>
                          <div>
                            <span className={`font-semibold text-base ${isWeekend ? "text-orange-400" : ""} ${isToday ? "text-primary" : ""}`}>
                              {pad2(date.getDate())}.{pad2(date.getMonth() + 1)}
                            </span>
                            <span className={`ml-2 text-sm ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                              {WEEKDAYS_FULL[i]}
                              {isToday && " · сегодня"}
                            </span>
                          </div>
                        </button>
                      </td>
                      {ALL_TIMES.map((t) => {
                        const active = daySlots.includes(t);
                        return (
                          <td key={t} className="p-2 text-center">
                            <button
                              onClick={() => !past && toggleTime(key, t)}
                              disabled={past}
                              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                                active
                                  ? "bg-primary/20 text-primary border-2 border-primary/50 shadow-[0_0_8px_rgba(34,197,94,0.15)]"
                                  : past
                                    ? "bg-transparent text-muted-foreground/30 border border-transparent"
                                    : "bg-muted/50 text-muted-foreground border border-transparent hover:border-border hover:text-foreground hover:bg-muted"
                              }`}
                            >
                              {active ? "✓" : "—"}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Save */}
          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Сохраняем..." : "Сохранить график"}
            </Button>
            {saved && (
              <span className="flex items-center gap-1 text-sm text-green-400">
                <CheckIcon className="size-4" /> Сохранено
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Кликните на дату слева, чтобы выделить/снять все часы. Листайте по неделям кнопками «Назад» и «Вперёд».
            Выходные подсвечены оранжевым. Клиенты смогут записаться только на отмеченные слоты.
          </p>
        </>
      )}
    </div>
  );
}

/* ── FORMS ── */
function ArtistForm({ initial, onSave }: { initial?: any; onSave: (data: any) => void }) {
  const [name, setName] = useState(initial?.name || "");
  const [bio, setBio] = useState(initial?.bio || "");
  const [photoUrl, setPhotoUrl] = useState(initial?.photoUrl || "");
  const [styles, setStyles] = useState(initial?.styles?.join(", ") || "");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  return (
    <form onSubmit={async (e) => { e.preventDefault(); if (submitting) return; setSubmitting(true); await onSave({ name, bio, photoUrl, styles: styles.split(",").map((s: string) => s.trim()).filter(Boolean) }); }} className="space-y-4">
      <h2 className="text-lg font-bold">{initial ? "Редактировать мастера" : "Новый мастер"}</h2>
      <Input label="Имя *" value={name} onChange={setName} required />
      <Input label="Описание" value={bio} onChange={setBio} />
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">Фото</label>
        <ImageUpload value={photoUrl} onChange={setPhotoUrl} uploading={uploading} setUploading={setUploading} />
      </div>
      <Input label="Стили (через запятую)" value={styles} onChange={setStyles} placeholder="Реализм, Графика, Ориентал" />
      <Button type="submit" className="w-full" disabled={uploading || submitting}>{submitting ? "Сохранение..." : initial ? "Сохранить" : "Создать"}</Button>
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

function PortfolioForm({ initial, artists, onSave }: { initial?: any; artists: any[]; onSave: (data: any) => void }) {
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || "");
  const [title, setTitle] = useState(initial?.title || "");
  const [style, setStyle] = useState(initial?.style || "");
  const [artistId, setArtistId] = useState(initial?.artistId || artists[0]?.id || "");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  return (
    <form onSubmit={async (e) => { e.preventDefault(); if (submitting) return; setSubmitting(true); await onSave({ imageUrl, title, style, artistId }); }} className="space-y-4">
      <h2 className="text-lg font-bold">{initial ? "Редактировать работу" : "Новая работа"}</h2>
      <ImageUpload value={imageUrl} onChange={setImageUrl} uploading={uploading} setUploading={setUploading} />
      <Input label="Название" value={title} onChange={setTitle} placeholder="Например: Реализм на предплечье" />
      <Input label="Стиль" value={style} onChange={setStyle} placeholder="Реализм, Графика, Япония..." />
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">Мастер *</label>
        <select
          value={artistId}
          onChange={(e) => setArtistId(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          required
        >
          {artists.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>
      <Button type="submit" className="w-full" disabled={uploading || !imageUrl || submitting}>{submitting ? "Сохранение..." : initial ? "Сохранить" : "Добавить"}</Button>
    </form>
  );
}

/* ── Image Upload ── */
function ImageUpload({ value, onChange, uploading, setUploading }: { value: string; onChange: (url: string) => void; uploading: boolean; setUploading: (v: boolean) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Только изображения (JPG, PNG, WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Максимальный размер — 5 МБ");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (e: any) {
      setError(e.message || "Ошибка загрузки");
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      {/* Preview */}
      {value && (
        <div className="relative rounded-lg overflow-hidden border border-border aspect-video">
          <img src={value} alt="Превью" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 rounded-full bg-black/70 p-1 text-white hover:bg-black transition-colors"
          >
            <XIcon className="size-4" />
          </button>
        </div>
      )}

      {/* Drop zone */}
      {!value && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          }`}
        >
          {uploading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCwIcon className="size-5 animate-spin" />
              Загружаем...
            </div>
          ) : (
            <>
              <UploadIcon className="size-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Перетащите фото сюда или <span className="text-primary">нажмите для выбора</span></p>
              <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG, WebP · до 5 МБ</p>
            </>
          )}
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleInputChange} />

      {/* URL input as fallback */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground shrink-0">или URL:</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          placeholder="https://..."
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
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

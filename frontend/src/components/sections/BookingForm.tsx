"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { getArtists, createBooking, getBookedSlots } from "@/lib/api";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { GlowBorder } from "@/components/ui/glow-border";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { CheckCircle2Icon } from "lucide-react";

export function BookingForm() {
  const [artists, setArtists] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    date: "",
    artistId: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  useEffect(() => {
    getArtists().then(setArtists).catch(() => {});
  }, []);

  // Load booked slots when artist changes
  useEffect(() => {
    if (form.artistId) {
      getBookedSlots(form.artistId).then(setBookedSlots).catch(() => setBookedSlots([]));
    } else {
      setBookedSlots([]);
    }
  }, [form.artistId]);

  useEffect(() => {
    const handler = (e: Event) => {
      const artistId = (e as CustomEvent).detail;
      if (artistId) setForm((prev) => ({ ...prev, artistId }));
    };
    window.addEventListener("select-artist", handler);
    return () => window.removeEventListener("select-artist", handler);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Клиентская валидация с конкретными сообщениями
    if (!form.name.trim()) {
      setError("Вы не указали имя");
      return;
    }
    if (!form.phone.trim()) {
      setError("Вы не указали телефон");
      return;
    }
    if (!form.artistId) {
      setError("Вы не выбрали мастера");
      return;
    }
    if (!form.date) {
      setError("Вы не указали дату и время. Выберите дату в календаре, затем выберите время");
      return;
    }

    setLoading(true);

    try {
      await createBooking({
        ...form,
        date: form.date + ":00.000Z",
      });
      setSuccess(true);
      setForm({ name: "", phone: "", email: "", message: "", date: "", artistId: "" });
    } catch (err: any) {
      if (err.message?.includes("409") || err.message?.includes("активная заявка")) {
        setError("С этого номера уже есть активная заявка. Дождитесь ответа или используйте другой номер");
      } else if (err.message?.includes("429") || err.message?.includes("Слишком много")) {
        setError("Слишком много заявок. Попробуйте позже");
      } else {
        setError(err.message || "Не удалось отправить заявку. Попробуйте позже");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section id="booking" className="bg-black py-24 px-4">
        <div className="max-w-xl mx-auto text-center">
          <CheckCircle2Icon className="size-16 text-green-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white">Заявка отправлена</h2>
          <p className="text-neutral-400 mt-3">Мы свяжемся с вами в ближайшее время для подтверждения записи.</p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-8 rounded-full bg-green-600 px-8 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
          >
            Записаться ещё
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="bg-black py-24 px-4 border-y border-green-500/30">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <ScrollReveal>
            <span className="text-green-400 text-sm uppercase tracking-widest font-medium">Запись</span>
          </ScrollReveal>
          <TextReveal className="mt-3">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Записаться на сеанс</h2>
          </TextReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-neutral-400 mt-4 text-base">Заполните форму — мы свяжемся с вами для подтверждения</p>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <GlowBorder hoverScale={1} allowOverflow>
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1.5">Имя *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-green-500/20 bg-neutral-950 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-green-500/50 focus:outline-none transition-colors"
                    placeholder="Ваше имя"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1.5">Телефон *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-lg border border-green-500/20 bg-neutral-950 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-green-500/50 focus:outline-none transition-colors"
                    placeholder="+7 (___) ___-__-__"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-green-500/20 bg-neutral-950 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-green-500/50 focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1.5">Мастер *</label>
                <ArtistSelect
                  artists={artists}
                  value={form.artistId}
                  onChange={(id) => setForm({ ...form, artistId: id })}
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-neutral-400 mb-1.5">Дата и время *</label>
                <DateTimePicker
                  value={form.date}
                  onChange={(d) => setForm({ ...form, date: d })}
                  bookedSlots={bookedSlots}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1.5">Описание</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-green-500/20 bg-neutral-950 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-green-500/50 focus:outline-none transition-colors resize-none"
                  placeholder="Опишите желаемую тату или задайте вопрос"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-green-600 py-3.5 text-sm font-semibold text-white transition-all hover:bg-green-700 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:opacity-50"
              >
                {loading ? "Отправляем..." : "Отправить заявку"}
              </button>
            </form>
          </GlowBorder>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ── ArtistSelect — custom styled dropdown ── */

function ArtistSelect({ artists, value, onChange }: { artists: any[]; value: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selectedName = artists.find((a) => a.id === value)?.name || "";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      {/* Hidden input for form validation */}
      <input type="hidden" value={value} required />

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full rounded-lg border bg-neutral-950 px-4 py-3 text-sm text-left transition-colors ${
          open ? "border-green-500/50" : "border-green-500/20"
        } flex items-center justify-between`}
      >
        <span className={selectedName ? "text-white" : "text-neutral-600"}>
          {selectedName || "Выберите мастера"}
        </span>
        <ChevronRightIcon className={`size-4 text-green-500 transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
      </button>

      <div
        className="absolute z-50 mt-1 left-0 right-0 rounded-lg border border-green-500/20 bg-neutral-950 shadow-xl shadow-black/50 origin-top transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "scaleY(1)" : "scaleY(0.95)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {artists.length === 0 ? (
          <div className="px-4 py-3 text-sm text-neutral-600">Нет мастеров</div>
        ) : (
          artists.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => { onChange(a.id); setOpen(false); }}
              className={`w-full px-4 py-3 text-sm text-left transition-colors flex items-center gap-3 ${
                value === a.id
                  ? "bg-green-500/10 text-green-400"
                  : "text-neutral-300 hover:bg-green-500/5 hover:text-white"
              }`}
            >
              {a.photoUrl ? (
                <img src={a.photoUrl} alt="" className="size-7 rounded-full object-cover border border-green-500/20" />
              ) : (
                <div className="size-7 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-xs font-bold text-green-400">
                  {a.name?.charAt(0)}
                </div>
              )}
              <span className="font-medium">{a.name}</span>
              {value === a.id && <span className="ml-auto text-green-400 text-xs">&#10003;</span>}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

/* ── DateTimePicker — input + dropdown calendar ── */

const MONTHS_SHORT = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
const MONTHS_RU = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const DAYS_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const TIMES = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

function DateTimePicker({ value, onChange, bookedSlots = [] }: { value: string; onChange: (d: string) => void; bookedSlots?: string[] }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"date" | "time">("date");
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [pickedDay, setPickedDay] = useState<number | null>(null);
  const [pickedMonth, setPickedMonth] = useState<number>(today.getMonth());
  const [pickedYear, setPickedYear] = useState<number>(today.getFullYear());
  const [pickedTime, setPickedTime] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 340 });

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;

  const days = useMemo(() => {
    const arr: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [viewMonth, viewYear, daysInMonth, firstDayOfWeek]);

  const isPast = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return d < t;
  };

  const updatePos = () => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
      width: Math.min(340, rect.width),
    });
  };

  useEffect(() => {
    if (open) updatePos();
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const dropdown = document.getElementById("calendar-dropdown");
      if (
        wrapperRef.current && !wrapperRef.current.contains(target) &&
        dropdown && !dropdown.contains(target)
      ) {
        setOpen(false);
      }
    };
    const onScroll = () => { if (open) updatePos(); };
    document.addEventListener("mousedown", handler);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", handler);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  const pad = (n: number) => n.toString().padStart(2, "0");

  const displayValue = pickedDay
    ? pickedTime
      ? `${pad(pickedDay)}.${pad(pickedMonth + 1)}.${pickedYear}, ${pickedTime}`
      : `${pad(pickedDay)}.${pad(pickedMonth + 1)}.${pickedYear}`
    : "";

  const formatLocal = (y: number, mo: number, d: number, h: number, mi: number) =>
    `${y}-${pad(mo + 1)}-${pad(d)}T${pad(h)}:${pad(mi)}`;

  const selectDay = (day: number) => {
    if (isPast(day)) return;
    setPickedDay(day);
    setPickedMonth(viewMonth);
    setPickedYear(viewYear);
    setTab("time");
    if (pickedTime) {
      const [h, m] = pickedTime.split(":");
      onChange(formatLocal(viewYear, viewMonth, day, Number(h), Number(m)));
    }
  };

  const selectTime = (t: string) => {
    setPickedTime(t);
    if (pickedDay) {
      const [h, m] = t.split(":");
      onChange(formatLocal(pickedYear, pickedMonth, pickedDay, Number(h), Number(m)));
      setOpen(false);
    }
  };

  const calendarDropdown = (
    <div
      id="calendar-dropdown"
      className="rounded-xl border border-green-500/20 bg-neutral-950 shadow-2xl shadow-black/60 origin-top transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{
        position: "absolute",
        top: dropdownPos.top,
        left: dropdownPos.left,
        width: dropdownPos.width,
        zIndex: 99999,
        opacity: open ? 1 : 0,
        transform: open ? "scaleY(1) translateY(0)" : "scaleY(0.95) translateY(-8px)",
        pointerEvents: open ? "auto" : "none",
      }}
    >
      {/* Tabs */}
      <div className="flex border-b border-green-500/10">
        <button
          type="button"
          onClick={() => setTab("date")}
          className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
            tab === "date" ? "text-green-400 border-b-2 border-green-400" : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          Дата {pickedDay ? `· ${pad(pickedDay)}.${pad(pickedMonth + 1)}` : ""}
        </button>
        <button
          type="button"
          onClick={() => setTab("time")}
          className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
            tab === "time" ? "text-green-400 border-b-2 border-green-400" : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          Время {pickedTime ? `· ${pickedTime}` : ""}
        </button>
      </div>

      <div className="p-4">
        {tab === "date" && (
          <>
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); } else setViewMonth(viewMonth - 1); }} className="p-1.5 rounded-lg text-neutral-400 hover:text-green-400 hover:bg-green-500/10 transition-colors">
                <ChevronLeftIcon className="size-4" />
              </button>
              <span className="text-sm font-semibold text-white">{MONTHS_RU[viewMonth]} {viewYear}</span>
              <button type="button" onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); } else setViewMonth(viewMonth + 1); }} className="p-1.5 rounded-lg text-neutral-400 hover:text-green-400 hover:bg-green-500/10 transition-colors">
                <ChevronRightIcon className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 mb-1">
              {DAYS_RU.map((d) => (
                <div key={d} className="text-center text-[0.65rem] font-medium text-neutral-600 py-1">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {days.map((day, i) => (
                <div key={i} className="flex items-center justify-center p-0.5">
                  <button
                    type="button"
                    disabled={day === null || isPast(day)}
                    onClick={() => day && selectDay(day)}
                    className={`size-9 rounded-lg text-xs font-medium transition-all duration-200 ${
                      day === null
                        ? "invisible"
                        : isPast(day)
                          ? "text-neutral-700 cursor-not-allowed"
                          : pickedDay === day && pickedMonth === viewMonth && pickedYear === viewYear
                            ? "bg-green-600 text-white shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                            : "text-neutral-300 hover:bg-green-500/15 hover:text-green-400"
                    }`}
                  >
                    {day}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "time" && (
          <div>
            <p className="text-xs text-neutral-500 mb-3">
              {pickedDay ? `${pad(pickedDay)}.${pad(pickedMonth + 1)}.${pickedYear} — выберите время:` : "Сначала выберите дату"}
            </p>
            {pickedDay ? (
              <div className="grid grid-cols-3 gap-2">
                {TIMES.map((t) => {
                  const [h, m] = t.split(":");
                  const isBooked = bookedSlots.some((s) => {
                    const booked = new Date(s);
                    return booked.getUTCFullYear() === pickedYear
                      && booked.getUTCMonth() === pickedMonth
                      && booked.getUTCDate() === pickedDay
                      && booked.getUTCHours() === Number(h);
                  });

                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={isBooked}
                      onClick={() => !isBooked && selectTime(t)}
                      className={`py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isBooked
                          ? "bg-neutral-900/50 text-neutral-700 cursor-not-allowed line-through border border-neutral-800"
                          : pickedTime === t
                            ? "bg-green-600 text-white shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                            : "bg-neutral-900 text-neutral-400 hover:bg-green-500/15 hover:text-green-400 border border-green-500/10"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            ) : (
              <button type="button" onClick={() => setTab("date")} className="w-full py-3 rounded-lg border border-green-500/20 text-sm text-green-400 hover:bg-green-500/10 transition-colors">
                Выбрать дату
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div ref={wrapperRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        readOnly
        value={displayValue}
        onClick={() => setOpen(!open)}
        className="w-full rounded-lg border border-green-500/20 bg-neutral-950 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-green-500/50 focus:outline-none transition-colors cursor-pointer"
        placeholder="Выберите дату и время"
        required
      />
      {typeof document !== "undefined" && createPortal(calendarDropdown, document.body)}
    </div>
  );
}

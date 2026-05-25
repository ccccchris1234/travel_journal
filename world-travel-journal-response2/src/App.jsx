import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Camera, CalendarDays, Plane, Search, Globe2 } from "lucide-react";
import { places } from "./data/places";
import { Camera } from "lucide-react";

const statusStyles = {
  Visited: "bg-emerald-400/15 text-emerald-200 border-emerald-300/25",
  Wishlist: "bg-sky-400/15 text-sky-200 border-sky-300/25",
  Planned: "bg-amber-400/15 text-amber-200 border-amber-300/25"
};

function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return <div className={`border shadow-2xl ${className}`}>{children}</div>;
}

function project(lat, lng) {
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return { x, y };
}

function PhotoPanel({ place }) {
  const photoList =
    place.photos && place.photos.length > 0
      ? place.photos
      : place.photo
      ? [place.photo]
      : [];

  if (photoList.length === 1) {
    return (
      <img
        src={photoList[0]}
        alt={place.name}
        className="h-full w-full object-cover"
      />
    );
  }

  if (photoList.length > 1) {
    return (
      <div className="grid h-full w-full grid-cols-2 gap-1">
        {photoList.map((photo, index) => (
          <img
            key={photo}
            src={photo}
            alt={`${place.name} ${index + 1}`}
            className="h-full w-full object-cover"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.32),transparent_32%),linear-gradient(135deg,#0f172a,#1e3a8a,#0f766e)]">
      <Camera className="h-10 w-10 text-white/60" />
    </div>
  );
}

export default function App() {
  const [selectedId, setSelectedId] = useState(1);
  const [status, setStatus] = useState("All");
  const [query, setQuery] = useState("");

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const matchesStatus = status === "All" || place.status === status;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        [place.name, place.zh, place.country, place.countryZh, place.type, place.typeZh]
          .join(" ")
          .toLowerCase()
          .includes(q);

      return matchesStatus && matchesQuery;
    });
  }, [status, query]);

  const selected = places.find((place) => place.id === selectedId) || places[0];
  const visitedCount = places.filter((place) => place.status === "Visited").length;
  const wishlistCount = places.filter((place) => place.status === "Wishlist").length;
  const countryCount = new Set(places.map((place) => place.country)).size;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.1),transparent_25%)]" />

      <header className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <nav className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 shadow-lg ring-1 ring-white/15">
              <Globe2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">World Travel Journal</p>
            </div>
          </div>

          <Button className="bg-white text-slate-950 hover:bg-slate-200">
            <Plane className="mr-2 h-4 w-4" /> Add Place
          </Button>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-sky-200/70">
              A map of where I have been and where the next frame begins
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
              Places I have carried home.
              <span className="block text-slate-400">Places still calling.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              A cinematic travel journal for visited cities, future routes, and small memories pinned across the world.
            </p>
          </motion.div>

          <div className="grid grid-cols-3 gap-3">
            <Card className="rounded-3xl border-white/10 bg-white/5 text-white backdrop-blur">
              <div className="p-5">
                <p className="text-3xl font-semibold">{visitedCount}</p>
              </div>
            </Card>
            <Card className="rounded-3xl border-white/10 bg-white/5 text-white backdrop-blur">
              <div className="p-5">
                <p className="text-3xl font-semibold">{wishlistCount}</p>
              </div>
            </Card>
            <Card className="rounded-3xl border-white/10 bg-white/5 text-white backdrop-blur">
              <div className="p-5">
                <p className="text-3xl font-semibold">{countryCount}</p>
              </div>
            </Card>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-5 pb-12 md:px-8 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-2xl backdrop-blur md:p-6">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">World Map</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {["All", "Visited", "Wishlist", "Planned"].map((item) => (
                <Button
                  key={item}
                  onClick={() => setStatus(item)}
                  className={
                    status === item
                      ? "border border-white/10 bg-white text-slate-950 hover:bg-white"
                      : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                  }
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-slate-900 shadow-inner">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.22),transparent_35%)]" />
            <svg viewBox="0 0 1000 500" className="h-[420px] w-full opacity-70">
              <rect width="1000" height="500" fill="rgba(15,23,42,0.9)" />
              <path d="M145 140 C190 95 265 95 320 125 C350 150 345 190 305 210 C250 235 180 220 140 185 C120 165 120 155 145 140Z" fill="rgba(148,163,184,0.28)" />
              <path d="M250 235 C310 220 375 240 390 285 C405 335 350 370 290 345 C250 330 220 280 250 235Z" fill="rgba(148,163,184,0.22)" />
              <path d="M455 130 C510 88 600 92 655 128 C708 165 690 225 620 235 C545 245 470 218 440 178 C425 155 430 145 455 130Z" fill="rgba(148,163,184,0.3)" />
              <path d="M540 245 C590 240 645 270 655 325 C665 385 610 430 555 395 C512 367 505 285 540 245Z" fill="rgba(148,163,184,0.2)" />
              <path d="M670 150 C735 105 855 112 910 165 C960 212 915 270 830 258 C755 248 695 225 660 190 C640 170 645 158 670 150Z" fill="rgba(148,163,184,0.3)" />
              <path d="M800 300 C845 290 900 320 910 370 C922 430 858 448 815 405 C785 375 770 322 800 300Z" fill="rgba(148,163,184,0.22)" />
              {Array.from({ length: 8 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" x2="1000" y1={70 + i * 50} y2={70 + i * 50} stroke="rgba(255,255,255,0.05)" />
              ))}
              {Array.from({ length: 11 }).map((_, i) => (
                <line key={`v-${i}`} y1="0" y2="500" x1={80 + i * 85} x2={80 + i * 85} stroke="rgba(255,255,255,0.05)" />
              ))}
            </svg>

            {filteredPlaces.map((place) => {
              const { x, y } = project(place.lat, place.lng);
              const active = selectedId === place.id;
              return (
                <button
                  key={place.id}
                  onClick={() => setSelectedId(place.id)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 outline-none"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  title={place.name}
                >
                  <span
                    className={`relative flex h-5 w-5 items-center justify-center rounded-full border shadow-lg transition ${
                      active
                        ? "scale-125 border-white bg-white"
                        : place.status === "Visited"
                          ? "border-emerald-200 bg-emerald-400"
                          : "border-sky-200 bg-sky-400"
                    }`}
                  >
                    <span className={`absolute h-8 w-8 rounded-full ${place.status === "Visited" ? "bg-emerald-400/25" : "bg-sky-400/25"}`} />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="space-y-6">
          <Card className="overflow-hidden rounded-[2rem] border-white/10 bg-white/[0.06] text-white backdrop-blur">
            <div className="h-56">
              <PhotoPanel place={selected} />
            </div>
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-semibold">{selected.name}</h2>
                  <p className="text-slate-400">{selected.zh} · {selected.countryZh}</p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs ${statusStyles[selected.status]}`}>
                  {selected.status} · {selected.statusZh}
                </span>
              </div>
              <div className="mb-5 grid gap-3 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500" /> {selected.country} · {selected.type} / {selected.typeZh}
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-slate-500" /> {selected.date}
                </div>
              </div>
              <p className="leading-7 text-slate-300">{selected.note}</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">{selected.noteZh}</p>
            </div>
          </Card>

          <Card className="rounded-[2rem] border-white/10 bg-white/[0.06] text-white backdrop-blur">
            <div className="p-5">
              <div className="mb-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search places"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-600"
                />
              </div>
              <div className="max-h-80 space-y-2 overflow-auto pr-1">
                {filteredPlaces.map((place) => (
                  <button
                    key={place.id}
                    onClick={() => setSelectedId(place.id)}
                    className={`w-full rounded-2xl border p-3 text-left transition ${
                      selectedId === place.id ? "border-white/30 bg-white/15" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.08]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {place.name} <span className="text-slate-500">{place.zh}</span>
                        </p>
                        <p className="text-xs text-slate-500">
                          {place.country} · {place.type}
                        </p>
                      </div>
                      <span className={`rounded-full border px-2 py-1 text-[10px] ${statusStyles[place.status]}`}>
                        {place.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </aside>
      </main>
    </div>
  );
}

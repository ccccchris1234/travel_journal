import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Camera,
  CalendarDays,
  Plane,
  Search,
  Globe2,
} from "lucide-react";
import { places } from "./data/places";
import TravelMap from "./components/TravelMap";

const statusStyles = {
  Visited: "bg-emerald-400/15 text-emerald-200 border-emerald-300/25",
  Wishlist: "bg-sky-400/15 text-sky-200 border-sky-300/25",
  Planned: "bg-amber-400/15 text-amber-200 border-amber-300/25",
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

function PhotoPanel({ place, allowFullscreen = false }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  useEffect(() => {
    setActiveIndex(0);
    setFullscreenImage(null);
  }, [place.id]);

  const images =
    place.photos && place.photos.length > 0
      ? place.photos
      : place.photo
        ? [place.photo]
        : [];

  const safeIndex =
    images.length > 0 ? Math.min(activeIndex, images.length - 1) : 0;

  if (images.length > 0) {
    return (
      <>
        <div className="relative h-full w-full">
          <button
            type="button"
            onClick={() => {
              if (allowFullscreen) {
                setFullscreenImage(images[safeIndex]);
              }
            }}
            className={`h-full w-full ${
              allowFullscreen ? "cursor-zoom-in" : "cursor-default"
            }`}
          >
            <img
              src={images[safeIndex]}
              alt={place.name}
              className="h-full w-full object-cover"
            />
          </button>

          {images.length > 1 && (
            <div className="absolute bottom-3 left-3 right-3 flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-14 w-20 flex-shrink-0 overflow-hidden rounded-xl border ${
                    safeIndex === index
                      ? "border-white"
                      : "border-white/30 opacity-70"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${place.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {fullscreenImage && (
          <div
            onClick={() => setFullscreenImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          >
            <button
              type="button"
              onClick={() => setFullscreenImage(null)}
              className="absolute right-5 top-5 rounded-full bg-white/10 px-4 py-2 text-2xl text-white transition hover:bg-white/20"
            >
              ×
            </button>

            <img
              src={fullscreenImage}
              alt={`${place.name} full view`}
              onClick={(event) => event.stopPropagation()}
              className="max-h-[90vh] max-w-[95vw] rounded-2xl object-contain"
            />
          </div>
        )}
      </>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.32),transparent_22%),linear-gradient(135deg,rgba(15,23,42,1),rgba(30,64,175,0.55),rgba(2,6,23,1))]">
      <Camera className="h-10 w-10 text-white/60" />
    </div>
  );
}

function PlaceDetail({ place, onBack }) {
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    place.lng - 0.08
  }%2C${place.lat - 0.05}%2C${place.lng + 0.08}%2C${
    place.lat + 0.05
  }&layer=mapnik&marker=${place.lat}%2C${place.lng}`;

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 md:px-8">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.1),transparent_25%)]" />

      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          ← Back to journal
        </button>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] shadow-2xl backdrop-blur">
          <div className="h-[520px]">
            <PhotoPanel place={place} allowFullscreen />
          </div>

          <div className="grid gap-8 p-6 md:grid-cols-[1fr_0.9fr] md:p-8">
            <div>
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-3 text-sm uppercase tracking-[0.35em] text-sky-200/70">
                    Travel Memory
                  </p>

                  <h1 className="text-5xl font-semibold tracking-tight">
                    {place.name}
                  </h1>

                  <p className="mt-2 text-xl text-slate-400">{place.zh}</p>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs ${
                    statusStyles[place.status]
                  }`}
                >
                  {place.status}
                </span>
              </div>

              <div className="mt-6 grid gap-3 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  {place.country} · {place.type}
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-slate-500" />
                  {place.date}
                </div>
              </div>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                {place.note}
              </p>

              {place.noteZh && (
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
                  {place.noteZh}
                </p>
              )}
            </div>

            <div>
              <h2 className="mb-3 text-xl font-semibold">Location</h2>

              <iframe
                title={`${place.name} map`}
                src={mapUrl}
                className="h-80 w-full rounded-3xl border border-white/10"
              />

              <p className="mt-3 text-sm text-slate-500">
                Latitude: {place.lat} · Longitude: {place.lng}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedId, setSelectedId] = useState(1);
  const [status, setStatus] = useState("All");
  const [query, setQuery] = useState("");
  const [detailPlaceId, setDetailPlaceId] = useState(null);

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const matchesStatus = status === "All" || place.status === status;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        [place.name, place.zh, place.country, place.type]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q);

      return matchesStatus && matchesQuery;
    });
  }, [status, query]);

  const selected = places.find((place) => place.id === selectedId) || places[0];
  const detailPlace = places.find((place) => place.id === detailPlaceId);
  const visitedCount = places.filter((place) => place.status === "Visited").length;
  const wishlistCount = places.filter(
    (place) => place.status === "Wishlist"
  ).length;
  const countryCount = new Set(places.map((place) => place.country)).size;

  if (detailPlace) {
    return (
      <PlaceDetail
        place={detailPlace}
        onBack={() => setDetailPlaceId(null)}
      />
    );
  }

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
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                World Travel Journal
              </p>
            </div>
          </div>

          <Button className="bg-white text-slate-950 hover:bg-slate-200">
            <Plane className="mr-2 h-4 w-4" /> Add Place
          </Button>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-sky-200/70">
              A map of where I have been and where the next frame begins
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
              Places I have carried home.
              <span className="block text-slate-400">
                Places still calling.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              A cinematic travel journal for visited cities, future routes, and
              small memories pinned across the world.
            </p>
          </motion.div>

          <div className="grid grid-cols-3 gap-3">
            <Card className="rounded-3xl border-white/10 bg-white/5 text-white backdrop-blur">
              <div className="p-5">
                <p className="text-3xl font-semibold">{visitedCount}</p>
                <p className="mt-1 text-sm text-slate-400">Visited</p>
              </div>
            </Card>
            <Card className="rounded-3xl border-white/10 bg-white/5 text-white backdrop-blur">
              <div className="p-5">
                <p className="text-3xl font-semibold">{wishlistCount}</p>
                <p className="mt-1 text-sm text-slate-400">Wishlist</p>
              </div>
            </Card>
            <Card className="rounded-3xl border-white/10 bg-white/5 text-white backdrop-blur">
              <div className="p-5">
                <p className="text-3xl font-semibold">{countryCount}</p>
                <p className="mt-1 text-sm text-slate-400">Countries</p>
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

          <TravelMap
            selectedId={selectedId}
            onSelectPlace={setSelectedId}
            placesToShow={filteredPlaces}
          />
        </section>

        <aside className="space-y-6">
          <Card className="overflow-hidden rounded-[2rem] border-white/10 bg-white/[0.06] text-white backdrop-blur">
            <div className="h-56">
              <PhotoPanel place={selected} />
            </div>
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <button
                    type="button"
                    onClick={() => setDetailPlaceId(selected.id)}
                    className="text-left text-3xl font-semibold transition hover:text-sky-200"
                  >
                    {selected.name}
                  </button>
                  <p className="text-slate-400">{selected.zh}</p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs ${
                    statusStyles[selected.status]
                  }`}
                >
                  {selected.status}
                </span>
              </div>
              <div className="mb-5 grid gap-3 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500" />{" "}
                  {selected.country} · {selected.type}
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-slate-500" />{" "}
                  {selected.date}
                </div>
              </div>
              <p className="leading-7 text-slate-300">{selected.note}</p>
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
                    type="button"
                    onClick={() => setSelectedId(place.id)}
                    className={`w-full rounded-2xl border p-3 text-left transition ${
                      selectedId === place.id
                        ? "border-white/30 bg-white/15"
                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.08]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {place.name}{" "}
                          <span className="text-slate-500">{place.zh}</span>
                        </p>
                        <p className="text-xs text-slate-500">
                          {place.country} · {place.type}
                        </p>
                      </div>
                      <span
                        className={`rounded-full border px-2 py-1 text-[10px] ${
                          statusStyles[place.status]
                        }`}
                      >
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

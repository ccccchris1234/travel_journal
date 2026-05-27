import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Camera,
  CalendarDays,
  Plane,
  Search,
  Globe2,
  X,
} from "lucide-react";
import { places } from "./data/places";
import TravelMap from "./components/TravelMap";

const ADDED_PLACES_KEY = "travel-journal-added-places";

const statusStyles = {
  Visited: "bg-emerald-400/15 text-emerald-200 border-emerald-300/25",
  Wishlist: "bg-sky-400/15 text-sky-200 border-sky-300/25",
  Planned: "bg-amber-400/15 text-amber-200 border-amber-300/25",
};

const emptyPlaceForm = {
  name: "",
  zh: "",
  country: "",
  type: "",
  status: "Visited",
  date: "Past trip",
  lat: "",
  lng: "",
  photosText: "",
  note: "",
  noteZh: "",
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

function FormField({ label, children }) {
  return (
    <label className="grid gap-2 text-sm text-slate-300">
      <span>{label}</span>
      {children}
    </label>
  );
}

function AddPlaceModal({ open, onClose, onSave }) {
  const [form, setForm] = useState(emptyPlaceForm);

  useEffect(() => {
    if (open) {
      setForm(emptyPlaceForm);
    }
  }, [open]);

  if (!open) return null;

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const lat = Number(form.lat);
    const lng = Number(form.lng);

    if (!form.name.trim()) {
      alert("Please enter a place name.");
      return;
    }

    if (!form.country.trim()) {
      alert("Please enter a country.");
      return;
    }

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      alert("Please enter valid latitude and longitude.");
      return;
    }

    const photos = form.photosText
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean);

    onSave({
      name: form.name.trim(),
      zh: form.zh.trim(),
      country: form.country.trim(),
      type: form.type.trim() || "City",
      status: form.status,
      date: form.date.trim() || "Past trip",
      lat,
      lng,
      photos,
      note: form.note.trim() || "A new place added to the journal.",
      noteZh: form.noteZh.trim(),
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-[2rem] border border-white/10 bg-slate-950 p-6 text-slate-100 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-200/70">
              New Travel Memory
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Add Place</h2>
            <p className="mt-2 text-sm text-slate-400">
              This saves to your current browser first. It will not edit GitHub automatically.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Place name">
              <input
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder="Tokyo"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-sky-300/50"
              />
            </FormField>

            <FormField label="Chinese name">
              <input
                value={form.zh}
                onChange={(event) => update("zh", event.target.value)}
                placeholder="东京"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-sky-300/50"
              />
            </FormField>

            <FormField label="Country">
              <input
                value={form.country}
                onChange={(event) => update("country", event.target.value)}
                placeholder="Japan"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-sky-300/50"
              />
            </FormField>

            <FormField label="Type">
              <input
                value={form.type}
                onChange={(event) => update("type", event.target.value)}
                placeholder="City / Nature / Landmark"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-sky-300/50"
              />
            </FormField>

            <FormField label="Status">
              <select
                value={form.status}
                onChange={(event) => update("status", event.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-sky-300/50"
              >
                <option value="Visited">Visited</option>
                <option value="Wishlist">Wishlist</option>
                <option value="Planned">Planned</option>
              </select>
            </FormField>

            <FormField label="Date">
              <input
                value={form.date}
                onChange={(event) => update("date", event.target.value)}
                placeholder="Past trip / 2026 / Future trip"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-sky-300/50"
              />
            </FormField>

            <FormField label="Latitude">
              <input
                value={form.lat}
                onChange={(event) => update("lat", event.target.value)}
                placeholder="35.6762"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-sky-300/50"
              />
            </FormField>

            <FormField label="Longitude">
              <input
                value={form.lng}
                onChange={(event) => update("lng", event.target.value)}
                placeholder="139.6503"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-sky-300/50"
              />
            </FormField>
          </div>

          <FormField label="Photo paths">
            <textarea
              value={form.photosText}
              onChange={(event) => update("photosText", event.target.value)}
              placeholder={"/photos/tokyo-1.jpg\n/photos/tokyo-2.jpg"}
              rows={3}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-sky-300/50"
            />
          </FormField>

          <FormField label="English note">
            <textarea
              value={form.note}
              onChange={(event) => update("note", event.target.value)}
              placeholder="Neon streets, quiet shrines, and late-night ramen."
              rows={3}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-sky-300/50"
            />
          </FormField>

          <FormField label="Chinese note">
            <textarea
              value={form.noteZh}
              onChange={(event) => update("noteZh", event.target.value)}
              placeholder="霓虹街道、安静神社和深夜拉面。"
              rows={3}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-sky-300/50"
            />
          </FormField>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              onClick={onClose}
              className="border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-white text-slate-950 hover:bg-slate-200"
            >
              Save Place
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
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
  const [isAddPlaceOpen, setIsAddPlaceOpen] = useState(false);

  const [addedPlaces, setAddedPlaces] = useState(() => {
    if (typeof window === "undefined") return [];

    try {
      const saved = window.localStorage.getItem(ADDED_PLACES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(ADDED_PLACES_KEY, JSON.stringify(addedPlaces));
  }, [addedPlaces]);

  const allPlaces = useMemo(() => {
    return [...places, ...addedPlaces];
  }, [addedPlaces]);

  const filteredPlaces = useMemo(() => {
    return allPlaces.filter((place) => {
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
  }, [allPlaces, status, query]);

  const selected =
    allPlaces.find((place) => place.id === selectedId) || allPlaces[0];

  const detailPlace = allPlaces.find((place) => place.id === detailPlaceId);

  const visitedCount = allPlaces.filter(
    (place) => place.status === "Visited"
  ).length;

  const wishlistCount = allPlaces.filter(
    (place) => place.status === "Wishlist"
  ).length;

  const countryCount = new Set(allPlaces.map((place) => place.country)).size;

  const selectedIsAdded = addedPlaces.some(
    (place) => place.id === selected?.id
  );

  function handleAddPlace(newPlaceData) {
    const nextId =
      Math.max(0, ...allPlaces.map((place) => Number(place.id) || 0)) + 1;

    const newPlace = {
      id: nextId,
      ...newPlaceData,
    };

    setAddedPlaces((current) => [...current, newPlace]);
    setSelectedId(newPlace.id);
    setStatus("All");
    setQuery("");
  }

  function handleDeletePlace(placeId) {
    const isOriginalPlace = places.some((place) => place.id === placeId);

    if (isOriginalPlace) {
      alert(
        "This place is from src/data/places.js. Delete it by editing places.js directly."
      );
      return;
    }

    const placeToDelete = addedPlaces.find((place) => place.id === placeId);

    if (!placeToDelete) {
      return;
    }

    const confirmed = window.confirm(`Delete ${placeToDelete.name}?`);

    if (!confirmed) {
      return;
    }

    const remainingPlaces = allPlaces.filter((place) => place.id !== placeId);

    setAddedPlaces((current) =>
      current.filter((place) => place.id !== placeId)
    );

    if (selectedId === placeId) {
      setSelectedId(remainingPlaces[0]?.id || places[0]?.id || 1);
    }

    if (detailPlaceId === placeId) {
      setDetailPlaceId(null);
    }
  }

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

          <Button
            type="button"
            onClick={() => setIsAddPlaceOpen(true)}
            className="bg-white text-slate-950 hover:bg-slate-200"
          >
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
                  type="button"
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
            allPlaces={allPlaces}
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

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs ${
                      statusStyles[selected.status]
                    }`}
                  >
                    {selected.status}
                  </span>

                  {selectedIsAdded && (
                    <button
                      type="button"
                      onClick={() => handleDeletePlace(selected.id)}
                      className="rounded-full border border-red-300/20 bg-red-400/10 px-3 py-1 text-xs text-red-200 transition hover:bg-red-400/20"
                    >
                      Delete
                    </button>
                  )}
                </div>
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

      <AddPlaceModal
        open={isAddPlaceOpen}
        onClose={() => setIsAddPlaceOpen(false)}
        onSave={handleAddPlace}
      />
    </div>
  );
}

import { useMemo } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { places } from "../data/places";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const countryIdMap = {
  Canada: "124",
  China: "156",
  "United Kingdom": "826",
  "United States": "840",
  "United States of America": "840",
  USA: "840",
  Japan: "392",
  Singapore: "702",
  Australia: "036",
  France: "250",
  Italy: "380",
  Germany: "276",
  Spain: "724",
  Switzerland: "756",
  Netherlands: "528",
  Thailand: "764",
  Malaysia: "458",
  "South Korea": "410",
};

function normalizeCountryName(country = "") {
  const clean = country.trim();

  if (clean.includes("United Kingdom")) return "United Kingdom";
  if (clean === "UK") return "United Kingdom";
  if (clean === "Britain") return "United Kingdom";
  if (clean.includes("England")) return "United Kingdom";
  if (clean.includes("Scotland")) return "United Kingdom";

  if (clean.includes("United States")) return "United States";
  if (clean === "USA") return "United States";

  if (clean.includes("China")) return "China";
  if (clean.includes("Canada")) return "Canada";
  if (clean.includes("Japan")) return "Japan";
  if (clean.includes("Singapore")) return "Singapore";
  if (clean.includes("Australia")) return "Australia";
  if (clean.includes("France")) return "France";
  if (clean.includes("Italy")) return "Italy";
  if (clean.includes("Germany")) return "Germany";
  if (clean.includes("Spain")) return "Spain";
  if (clean.includes("Switzerland")) return "Switzerland";
  if (clean.includes("Netherlands")) return "Netherlands";
  if (clean.includes("Thailand")) return "Thailand";
  if (clean.includes("Malaysia")) return "Malaysia";
  if (clean.includes("South Korea")) return "South Korea";

  return clean;
}

function getCountryId(country) {
  const normalized = normalizeCountryName(country);
  return countryIdMap[normalized] || null;
}

function getMarkerColors(status, isSelected) {
  if (isSelected) {
    return {
      core: "#fff7ed",
      ring: "#ffffff",
      glow: "#f59e0b",
      label: "#f8fafc",
    };
  }

  if (status === "Wishlist") {
    return {
      core: "#38bdf8",
      ring: "#bae6fd",
      glow: "#38bdf8",
      label: "#e0f2fe",
    };
  }

  if (status === "Planned") {
    return {
      core: "#fbbf24",
      ring: "#fde68a",
      glow: "#f59e0b",
      label: "#fef3c7",
    };
  }

  return {
    core: "#f59e0b",
    ring: "#fde68a",
    glow: "#f59e0b",
    label: "#fef3c7",
  };
}

export default function TravelMap({
  selectedId,
  onSelectPlace,
  placesToShow = places,
  allPlaces = places,
}) {
  const visitedCountryIds = useMemo(() => {
    return new Set(
      allPlaces
        .filter((place) => place.status === "Visited")
        .map((place) => getCountryId(place.country))
        .filter(Boolean)
    );
  }, [allPlaces]);

  return (
    <div className="relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-slate-950 shadow-inner">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(245,158,11,0.10),transparent_28%),radial-gradient(circle_at_50%_40%,rgba(56,189,248,0.12),transparent_48%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{
          scale: 168,
          center: [8, 8],
        }}
        width={1000}
        height={500}
        className="relative z-10 h-[420px] w-full"
        style={{ width: "100%", height: "420px" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryId = String(geo.id).padStart(3, "0");
              const isVisited = visitedCountryIds.has(countryId);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: isVisited ? "#c9871f" : "#1e2b4a",
                      stroke: isVisited ? "#f8c35a" : "#334155",
                      strokeWidth: isVisited ? 0.75 : 0.45,
                      outline: "none",
                    },
                    hover: {
                      fill: isVisited ? "#e0a83a" : "#293b63",
                      stroke: isVisited ? "#ffe8a3" : "#475569",
                      strokeWidth: 0.8,
                      outline: "none",
                    },
                    pressed: {
                      fill: isVisited ? "#e0a83a" : "#293b63",
                      stroke: isVisited ? "#ffe8a3" : "#475569",
                      strokeWidth: 0.8,
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>

        {placesToShow.map((place) => {
          const isSelected = selectedId === place.id;
          const colors = getMarkerColors(place.status, isSelected);

          return (
            <Marker key={place.id} coordinates={[place.lng, place.lat]}>
              <g
                onClick={() => onSelectPlace(place.id)}
                style={{ cursor: "pointer" }}
              >
                {isSelected && (
                  <circle r={11} fill={colors.glow} opacity="0.18" />
                )}

                <circle
                  r={isSelected ? 5 : 3.2}
                  fill={colors.core}
                  stroke={colors.ring}
                  strokeWidth={1.2}
                />

                {isSelected && (
                  <text
                    x={9}
                    y={4}
                    fontSize={12}
                    fill={colors.label}
                    fontWeight={700}
                    style={{ pointerEvents: "none" }}
                  >
                    {place.name}
                  </text>
                )}
              </g>
            </Marker>
          );
        })}
      </ComposableMap>

      <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-5 rounded-full border border-white/10 bg-slate-950/75 px-4 py-2 text-xs text-slate-300 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500 ring-1 ring-amber-200" />
          Places visited
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-amber-600/80 ring-1 ring-amber-300/60" />
          Countries visited
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-slate-700" />
          Not visited yet
        </div>
      </div>
    </div>
  );
}

import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { places } from "../data/places";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

function normalizeCountryName(country = "") {
  if (country.includes("United Kingdom")) return "United Kingdom";
  if (country === "UK") return "United Kingdom";
  if (country === "Britain") return "United Kingdom";
  if (country.includes("China")) return "China";
  if (country.includes("Canada")) return "Canada";
  if (country.includes("United States")) return "United States";
  if (country === "USA") return "United States of America";
  if (country.includes("Japan")) return "Japan";
  if (country.includes("Singapore")) return "Singapore";

  return country;
}

export default function TravelMap({ selectedId, onSelectPlace }) {
  const visitedCountries = [
    ...new Set(
      places
        .filter((place) => place.status === "Visited")
        .map((place) => normalizeCountryName(place.country))
    )
  ];

  return (
    <div className="relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-slate-950 shadow-inner">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(245,158,11,0.12),transparent_25%),radial-gradient(circle_at_50%_40%,rgba(56,189,248,0.12),transparent_45%)]" />

      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{
          scale: 170,
          center: [10, 8]
        }}
        width={1000}
        height={500}
        className="relative z-10 h-[420px] w-full"
        style={{ width: "100%", height: "420px" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryName = geo.properties.name;
              const isVisited = visitedCountries.includes(countryName);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: isVisited ? "#d99a22" : "#1e2b4a",
                      stroke: isVisited ? "#f8c35a" : "#334155",
                      strokeWidth: isVisited ? 0.8 : 0.45,
                      outline: "none"
                    },
                    hover: {
                      fill: isVisited ? "#eab648" : "#26385f",
                      stroke: isVisited ? "#ffe8a3" : "#475569",
                      strokeWidth: 0.8,
                      outline: "none"
                    },
                    pressed: {
                      fill: isVisited ? "#eab648" : "#26385f",
                      stroke: isVisited ? "#ffe8a3" : "#475569",
                      strokeWidth: 0.8,
                      outline: "none"
                    }
                  }}
                />
              );
            })
          }
        </Geographies>

        {places.map((place) => {
          const isSelected = selectedId === place.id;

          return (
            <Marker
              key={place.id}
              coordinates={[place.lng, place.lat]}
            >
              <g
                onClick={() => onSelectPlace(place.id)}
                style={{ cursor: "pointer" }}
              >
                {isSelected && (
                  <circle
                    r={11}
                    fill="#f59e0b"
                    opacity="0.18"
                  />
                )}

                <circle
                  r={isSelected ? 5 : 3.2}
                  fill={isSelected ? "#fff7ed" : "#f59e0b"}
                  stroke={isSelected ? "#ffffff" : "#fde68a"}
                  strokeWidth={1.2}
                />

                {isSelected && (
                  <text
                    x={9}
                    y={4}
                    fontSize={12}
                    fill="#e5e7eb"
                    fontWeight={600}
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

      <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-5 rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs text-slate-300 backdrop-blur">
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

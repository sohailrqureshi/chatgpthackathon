"use client";
import { MapContainer, TileLayer, GeoJSON, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import type { Feature, Polygon } from "geojson";
import { sites } from "@/lib/sites";
import "leaflet/dist/leaflet.css";
function Focus({ selected }: { selected: string | null }) {
  const map = useMap();
  useEffect(() => {
    const site = sites.find((s) => s.id === selected);
    if (site) map.flyTo(site.center, 16, { duration: 1.2 });
    else map.flyTo([1.3521, 103.8198], 12);
  }, [selected, map]);
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  return null;
}
function SelectSiteButton({
  id,
  onSelect,
}: {
  id: string;
  onSelect: (id: string) => void;
}) {
  const map = useMap();
  return (
    <button
      className="button primary"
      onClick={() => {
        onSelect(id);
        map.closePopup();
      }}
    >
      Select Site →
    </button>
  );
}

export default function SiteMap({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <MapContainer center={[1.3521, 103.8198]} zoom={12} className="leaflet-map">
      <TileLayer
        attribution="&copy; OpenStreetMap contributors &copy; CARTO"
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <Focus selected={selected} />
      {sites.map((site) => (
        <GeoJSON
          key={site.id}
          data={
            {
              type: "Feature",
              properties: { id: site.id },
              geometry: {
                type: "Polygon",
                coordinates: [
                  [...site.points, site.points[0]].map(([lat, lng]) => [
                    lng,
                    lat,
                  ]),
                ],
              },
            } as Feature<Polygon>
          }
          style={{
            color: "#6ee7b7",
            weight: selected === site.id ? 4 : 2,
            fillColor: "#34d399",
            fillOpacity: 0.3,
          }}
        >
          <Popup>
            <div className="site-popup">
              <small>{site.id} · MOCK PARCEL</small>
              <h3>{site.name}</h3>
              <p>
                {site.area} m² · {site.zoning}
              </p>
              <p>
                <b>Auntie Footfall Index</b>
                <br />
                {site.footfall}
              </p>
              <p>
                <b>Otter Intrusion Risk</b>
                <br />
                {site.otters}
              </p>
              <SelectSiteButton id={site.id} onSelect={onSelect} />
            </div>
          </Popup>
        </GeoJSON>
      ))}
    </MapContainer>
  );
}

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { motion } from "framer-motion";

const MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const SERVICE_TYPES = [
  {
    id: "hospital",
    label: "Hospitals",
    emoji: "🏥",
    primaryType: "hospital",
    color: "#00c2ff",
  },
  {
    id: "police",
    label: "Police",
    emoji: "👮",
    primaryType: "police",
    color: "#5b8cff",
  },
  {
    id: "fire_station",
    label: "Fire",
    emoji: "🚒",
    primaryType: "fire_station",
    color: "#ff5a5a",
  },
  {
    id: "pharmacy",
    label: "Pharmacy",
    emoji: "💊",
    primaryType: "pharmacy",
    color: "#00ff88",
  },
];

export default function NearbyServices() {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);

  const [location, setLocation] = useState(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  const [activeType, setActiveType] = useState("hospital");
  const [places, setPlaces] = useState([]);

  /* ---------------- Load Google Maps ---------------- */
  useEffect(() => {
    if (!MAPS_API_KEY) {
      setError("Missing Google Maps API Key");
      setLoading(false);
      return;
    }

    const loader = new Loader({
      apiKey: MAPS_API_KEY,
      version: "weekly",
      libraries: ["places"],
    });

    loader
      .load()
      .then(() => setMapsLoaded(true))
      .catch(() => {
        setError("Failed to load Google Maps");
        setLoading(false);
      });
  }, []);

  /* ---------------- Get User Location ---------------- */
  useEffect(() => {
    if (!mapsLoaded) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLoading(false);
      },
      () => {
        setLocation({
          lat: 13.0827,
          lng: 80.2707,
        });
        setLoading(false);
      }
    );
  }, [mapsLoaded]);

  /* ---------------- Initialize Map ---------------- */
  useEffect(() => {
    if (!location || !mapsLoaded || googleMapRef.current) return;

    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      center: location,
      zoom: 14,
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        {
          elementType: "geometry",
          stylers: [{ color: "#0b0f19" }],
        },
      ],
    });

    new window.google.maps.Marker({
      position: location,
      map: googleMapRef.current,
      title: "You are here",
    });
  }, [location, mapsLoaded]);

  /* ---------------- Search Nearby ---------------- */
  const searchNearby = useCallback(
    async (type) => {
      if (!googleMapRef.current || !location) return;

      setSearching(true);
      setPlaces([]);

      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      try {
        const config = SERVICE_TYPES.find((x) => x.id === type);

        const { Place, SearchNearbyRankPreference } =
          await window.google.maps.importLibrary("places");

        const request = {
          fields: [
            "displayName",
            "location",
            "formattedAddress",
            "rating",
          ],
          locationRestriction: {
            center: new window.google.maps.LatLng(
              location.lat,
              location.lng
            ),
            radius: 5000,
          },
          includedPrimaryTypes: [config.primaryType],
          maxResultCount: 8,
          rankPreference:
            SearchNearbyRankPreference.DISTANCE,
        };

        const { places: results = [] } =
          await Place.searchNearby(request);

        const normalized = results.map((p) => ({
          name: p.displayName,
          address: p.formattedAddress,
          rating: p.rating || 0,
          lat: p.location.lat(),
          lng: p.location.lng(),
        }));

        setPlaces(normalized);

        normalized.forEach((place) => {
          const marker = new window.google.maps.Marker({
            position: {
              lat: place.lat,
              lng: place.lng,
            },
            map: googleMapRef.current,
          });

          markersRef.current.push(marker);
        });
      } catch (err) {
        setError("Nearby search failed");
      }

      setSearching(false);
    },
    [location]
  );

  /* ---------------- Auto Load Default ---------------- */
  useEffect(() => {
    if (location) {
      searchNearby(activeType);
    }
  }, [location]);

  /* ---------------- Button Click ---------------- */
  const handleTabClick = (type) => {
    setActiveType(type);
    searchNearby(type);
  };

  /* ---------------- Navigation ---------------- */
  const openNavigation = (place) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`,
      "_blank"
    );
  };

  /* ---------------- UI States ---------------- */
  if (loading) {
    return (
      <div style={styles.center}>
        Loading Nearby Services...
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.center}>
        {error}
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Nearby Services</h1>
        <p style={styles.subtitle}>
          Emergency help near your live location
        </p>

        {/* Tabs */}
        <div style={styles.tabs}>
          {SERVICE_TYPES.map((item) => (
            <button
              key={item.id}
              onClick={() =>
                handleTabClick(item.id)
              }
              style={{
                ...styles.tab,
                ...(activeType === item.id
                  ? styles.activeTab
                  : {}),
              }}
            >
              <div style={{ fontSize: 28 }}>
                {item.emoji}
              </div>
              <div>{item.label}</div>
            </button>
          ))}
        </div>

        {/* Map */}
        <div
          ref={mapRef}
          style={styles.map}
        />

        {/* Loading */}
        {searching && (
          <div style={styles.loading}>
            Searching nearby...
          </div>
        )}

        {/* List */}
        <div style={styles.list}>
          {places.map((place, index) => (
            <motion.div
              key={index}
              style={styles.card}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
              }}
            >
              <div>
                <div style={styles.placeName}>
                  {place.name}
                </div>

                <div style={styles.address}>
                  {place.address}
                </div>

                <div style={styles.rating}>
                  ⭐ {place.rating}
                </div>
              </div>

              <button
                style={styles.goBtn}
                onClick={() =>
                  openNavigation(place)
                }
              >
                GO →
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Styles ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#05070d,#101827)",
    padding: 20,
    color: "white",
    fontFamily: "Inter,sans-serif",
  },

  container: {
    maxWidth: 1300,
    margin: "0 auto",
  },

  title: {
    fontSize: 42,
    fontWeight: 800,
    marginBottom: 5,
  },

  subtitle: {
    color: "#8b9cc9",
    marginBottom: 20,
  },

  tabs: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(140px,1fr))",
    gap: 15,
    marginBottom: 20,
  },

  tab: {
    background: "#0d1322",
    border: "1px solid #1b2740",
    color: "#9aa9cf",
    padding: 18,
    borderRadius: 18,
    cursor: "pointer",
    transition: "0.3s",
  },

  activeTab: {
    border: "1px solid #00c2ff",
    color: "#00c2ff",
    boxShadow:
      "0 0 20px rgba(0,194,255,0.25)",
  },

  map: {
    width: "100%",
    height: "380px",
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 20,
  },

  loading: {
    marginBottom: 15,
    color: "#00c2ff",
  },

  list: {
    display: "grid",
    gap: 14,
  },

  card: {
    background: "#0d1322",
    border: "1px solid #1b2740",
    padding: 18,
    borderRadius: 18,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 15,
    flexWrap: "wrap",
  },

  placeName: {
    fontSize: 22,
    fontWeight: 700,
  },

  address: {
    color: "#9aa9cf",
    fontSize: 14,
    marginTop: 6,
  },

  rating: {
    marginTop: 8,
    color: "#ffd66b",
  },

  goBtn: {
    background: "#081e30",
    border: "1px solid #00c2ff",
    color: "#00c2ff",
    padding: "12px 20px",
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 700,
  },

  center: {
    minHeight: "100vh",
    background: "#05070d",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    fontSize: 22,
  },
};
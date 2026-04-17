<<<<<<< HEAD
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { motion } from "framer-motion";
=======
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
>>>>>>> a076e50 (initial commit)

const MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const SERVICE_TYPES = [
<<<<<<< HEAD
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
=======
  { id: 'hospital',     label: 'HOSPITAL',  emoji: '🏥', primaryType: 'hospital',     color: '#00d4ff' },
  { id: 'police',       label: 'POLICE',    emoji: '👮', primaryType: 'police',       color: '#5b8cff' },
  { id: 'fire_station', label: 'FIRE',      emoji: '🚒', primaryType: 'fire_station', color: '#ff5a5a' },
  { id: 'pharmacy',     label: 'PHARMACY',  emoji: '💊', primaryType: 'pharmacy',     color: '#00ff9d' },
];

// Dark map style
const DARK_MAP_STYLE = [
  { elementType: 'geometry',           stylers: [{ color: '#060b12' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#060b12' }] },
  { elementType: 'labels.text.fill',   stylers: [{ color: '#7a9ab8' }] },
  { featureType: 'road',               elementType: 'geometry',      stylers: [{ color: '#0a1220' }] },
  { featureType: 'road',               elementType: 'geometry.stroke', stylers: [{ color: '#101c30' }] },
  { featureType: 'road.highway',       elementType: 'geometry',      stylers: [{ color: '#162440' }] },
  { featureType: 'road.highway',       elementType: 'geometry.stroke', stylers: [{ color: '#0a1220' }] },
  { featureType: 'water',              elementType: 'geometry',      stylers: [{ color: '#020408' }] },
  { featureType: 'poi',                elementType: 'geometry',      stylers: [{ color: '#0a1220' }] },
  { featureType: 'poi.park',           elementType: 'geometry',      stylers: [{ color: '#060f18' }] },
  { featureType: 'transit',            elementType: 'geometry',      stylers: [{ color: '#0a1220' }] },
  { featureType: 'administrative',     elementType: 'geometry.stroke', stylers: [{ color: '#162440' }] },
];

export default function NearbyServices() {
  const mapRef      = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef  = useRef([]);

  const [location, setLocation]     = useState(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [loading, setLoading]       = useState(true);
  const [searching, setSearching]   = useState(false);
  const [error, setError]           = useState('');
  const [activeType, setActiveType] = useState('hospital');
  const [places, setPlaces]         = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  /* Load Google Maps */
  useEffect(() => {
    if (!MAPS_API_KEY) { setError('Missing Google Maps API Key'); setLoading(false); return; }
    const loader = new Loader({ apiKey: MAPS_API_KEY, version: 'weekly', libraries: ['places'] });
    loader.load()
      .then(() => setMapsLoaded(true))
      .catch(() => { setError('Failed to load Google Maps'); setLoading(false); });
  }, []);

  /* Get location */
  useEffect(() => {
    if (!mapsLoaded) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLoading(false); },
      ()    => { setLocation({ lat: 13.0827, lng: 80.2707 }); setLoading(false); }
    );
  }, [mapsLoaded]);

  /* Init map */
>>>>>>> a076e50 (initial commit)
  useEffect(() => {
    if (!location || !mapsLoaded || googleMapRef.current) return;

    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      center: location,
      zoom: 14,
      disableDefaultUI: true,
      zoomControl: true,
<<<<<<< HEAD
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
=======
      styles: DARK_MAP_STYLE,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_BOTTOM,
      },
    });

    // User location marker (custom)
    new window.google.maps.Marker({
      position: location,
      map: googleMapRef.current,
      title: 'You are here',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#00d4ff',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2,
      },
    });
  }, [location, mapsLoaded]);

  /* Search */
  const searchNearby = useCallback(async (type) => {
    if (!googleMapRef.current || !location) return;
    setSearching(true);
    setPlaces([]);
    setSelectedPlace(null);
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    try {
      const config = SERVICE_TYPES.find(x => x.id === type);
      const { Place, SearchNearbyRankPreference } = await window.google.maps.importLibrary('places');
      const { places: results = [] } = await Place.searchNearby({
        fields: ['displayName', 'location', 'formattedAddress', 'rating'],
        locationRestriction: {
          center: new window.google.maps.LatLng(location.lat, location.lng),
          radius: 5000,
        },
        includedPrimaryTypes: [config.primaryType],
        maxResultCount: 8,
        rankPreference: SearchNearbyRankPreference.DISTANCE,
      });

      const normalized = results.map(p => ({
        name: p.displayName,
        address: p.formattedAddress,
        rating: p.rating || 0,
        lat: p.location.lat(),
        lng: p.location.lng(),
      }));
      setPlaces(normalized);

      normalized.forEach((place, idx) => {
        const marker = new window.google.maps.Marker({
          position: { lat: place.lat, lng: place.lng },
          map: googleMapRef.current,
          title: place.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: config.color,
            fillOpacity: 0.9,
            strokeColor: '#fff',
            strokeWeight: 1.5,
          },
        });
        marker.addListener('click', () => setSelectedPlace(place));
        markersRef.current.push(marker);
      });

    } catch (err) {
      setError('Nearby search failed');
    }
    setSearching(false);
  }, [location]);

  useEffect(() => { if (location) searchNearby(activeType); }, [location]);

  const handleTabClick = (type) => { setActiveType(type); searchNearby(type); };
  const openNavigation = (place) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`, '_blank');
  };

  const activeConfig = SERVICE_TYPES.find(x => x.id === activeType);

  if (loading) return <CenterState text="ACQUIRING LOCATION..." />;
  if (error)   return <CenterState text={error} isError />;

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      animation: 'fade-in 0.4s ease',
    }}>
      {/* Header */}
      <div style={{ padding: '32px 28px 20px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '6px' }}>
          CRYSALIS / PROXIMITY SCAN
        </div>
        <h1 style={{
          fontSize: 'clamp(20px, 4vw, 30px)',
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.08em',
          background: 'linear-gradient(135deg, #e8f4ff, #b060ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '4px',
        }}>
          NEARBY SERVICES
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontFamily: 'var(--font-body)' }}>
          Emergency resources within 5km radius
        </p>

        {/* Service type tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '20px' }}>
          {SERVICE_TYPES.map(item => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              style={{
                background: activeType === item.id
                  ? `linear-gradient(135deg, ${item.color}25, ${item.color}10)`
                  : 'rgba(10,18,32,0.7)',
                border: `1px solid ${activeType === item.id ? item.color + '50' : 'rgba(0,212,255,0.1)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '14px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: activeType === item.id ? `0 0 20px ${item.color}20` : 'none',
              }}
            >
              <span style={{
                fontSize: '22px',
                filter: activeType === item.id ? `drop-shadow(0 0 8px ${item.color})` : 'none',
              }}>
                {item.emoji}
              </span>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '9px',
                letterSpacing: '0.08em',
                color: activeType === item.id ? item.color : 'var(--text-secondary)',
                fontWeight: 600,
              }}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* MAP */}
      <div style={{
        position: 'relative',
        margin: '0 28px',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: `1px solid ${activeConfig?.color}30 `,
        boxShadow: `0 0 40px ${activeConfig?.color}15, 0 8px 40px rgba(0,0,0,0.6)`,
        height: '340px',
        flexShrink: 0,
      }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

        {/* Scanning overlay when searching */}
        {searching && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(6,11,18,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(2px)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '48px', height: '48px',
                border: `2px solid ${activeConfig?.color}30`,
                borderTop: `2px solid ${activeConfig?.color}`,
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 12px',
              }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: activeConfig?.color, letterSpacing: '0.15em' }}>
                SCANNING...
              </div>
            </div>
          </div>
        )}

        {/* Corner decorations */}
        {['top-left','top-right','bottom-left','bottom-right'].map(corner => (
          <div key={corner} style={{
            position: 'absolute',
            [corner.includes('top') ? 'top' : 'bottom']: '10px',
            [corner.includes('left') ? 'left' : 'right']: '10px',
            width: '20px', height: '20px',
            borderTop: corner.includes('top') ? `2px solid ${activeConfig?.color}80` : 'none',
            borderBottom: corner.includes('bottom') ? `2px solid ${activeConfig?.color}80` : 'none',
            borderLeft: corner.includes('left') ? `2px solid ${activeConfig?.color}80` : 'none',
            borderRight: corner.includes('right') ? `2px solid ${activeConfig?.color}80` : 'none',
            pointerEvents: 'none',
          }} />
        ))}
      </div>

      {/* Selected place info panel */}
      {selectedPlace && (
        <div style={{
          margin: '12px 28px 0',
          padding: '14px 18px',
          background: `linear-gradient(135deg, ${activeConfig?.color}12, rgba(6,11,18,0.9))`,
          border: `1px solid ${activeConfig?.color}40`,
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          animation: 'slide-up 0.3s ease',
          boxShadow: `0 0 20px ${activeConfig?.color}15`,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: activeConfig?.color, marginBottom: '2px', fontWeight: 600, letterSpacing: '0.06em' }}>
              {selectedPlace.name}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {selectedPlace.address}
            </div>
          </div>
          <button
            onClick={() => openNavigation(selectedPlace)}
            style={{
              background: activeConfig?.color,
              border: 'none',
              color: '#000',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-display)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              flexShrink: 0,
              boxShadow: `0 0 16px ${activeConfig?.color}60`,
            }}
          >
            NAVIGATE
          </button>
        </div>
      )}

      {/* Results count */}
      {!searching && places.length > 0 && (
        <div style={{
          padding: '16px 28px 8px',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--text-muted)',
          letterSpacing: '0.15em',
        }}>
          FOUND {places.length} {SERVICE_TYPES.find(x => x.id === activeType)?.label} WITHIN 5KM
        </div>
      )}

      {/* Places list */}
      <div style={{ padding: '0 28px 40px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {places.map((place, index) => (
          <div
            key={index}
            onClick={() => setSelectedPlace(place)}
            style={{
              background: selectedPlace === place
                ? `linear-gradient(135deg, ${activeConfig?.color}15, rgba(10,18,32,0.9))`
                : 'rgba(10,18,32,0.7)',
              border: `1px solid ${selectedPlace === place ? activeConfig?.color + '50' : 'rgba(0,212,255,0.1)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '16px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              animation: `slide-up 0.3s ease ${index * 0.06}s both`,
              boxShadow: selectedPlace === place ? `0 0 20px ${activeConfig?.color}15` : 'none',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                <span style={{
                  display: 'inline-block',
                  width: '20px', height: '20px',
                  lineHeight: '20px',
                  textAlign: 'center',
                  background: `${activeConfig?.color}20`,
                  borderRadius: '4px',
                  fontSize: '12px',
                  marginRight: '8px',
                  fontFamily: 'var(--font-mono)',
                  color: activeConfig?.color,
                }}>
                  {index + 1}
                </span>
                {place.name}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {place.address}
              </div>
              {place.rating > 0 && (
                <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i} style={{ fontSize: '12px', color: i < Math.round(place.rating) ? '#ffd60a' : 'rgba(255,255,255,0.15)' }}>★</span>
                  ))}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginLeft: '4px' }}>{place.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); openNavigation(place); }}
              style={{
                background: 'rgba(10,18,32,0.8)',
                border: `1px solid ${activeConfig?.color}40`,
                color: activeConfig?.color,
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-display)',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${activeConfig?.color}15`; e.currentTarget.style.boxShadow = `0 0 12px ${activeConfig?.color}30`; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(10,18,32,0.8)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              GO →
            </button>
          </div>
        ))}
>>>>>>> a076e50 (initial commit)
      </div>
    </div>
  );
}

<<<<<<< HEAD
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
=======
function CenterState({ text, isError }) {
  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--bg-void)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '16px',
    }}>
      {!isError && (
        <div style={{
          width: '40px', height: '40px',
          border: '2px solid rgba(0,212,255,0.2)',
          borderTop: '2px solid var(--neon-blue)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      )}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '13px',
        color: isError ? 'var(--neon-red)' : 'var(--text-secondary)',
        letterSpacing: '0.15em',
      }}>
        {text}
      </p>
    </div>
  );
}
>>>>>>> a076e50 (initial commit)

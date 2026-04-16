// existing-src/screens/NearbyServices.jsx 
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const SERVICE_TYPES = [
  { id: 'hospital',     label: 'Hospitals',     emoji: '🏥', primaryType: 'hospital',      color: '#00c2ff' },
  { id: 'police',       label: 'Police',        emoji: '👮', primaryType: 'police',         color: '#ff4500' },
  { id: 'fire_station', label: 'Fire Stations', emoji: '🚒', primaryType: 'fire_station',   color: '#ffc300' },
  { id: 'pharmacy',     label: 'Pharmacies',    emoji: '💊', primaryType: 'pharmacy',       color: '#00ff88' },
];

export default function NearbyServices({ showToast }) {
  const mapRef        = useRef(null);
  const googleMapRef  = useRef(null);
  const markersRef    = useRef([]);
  const highlightCircleRef = useRef(null);

  const [location,    setLocation]    = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [locError,    setLocError]    = useState(null);
  const [activeType,  setActiveType]  = useState('hospital');
  const [places,      setPlaces]      = useState([]);
  const [searching,   setSearching]   = useState(false);
  const [mapsLoaded,  setMapsLoaded]  = useState(false);

  // ── Load Google Maps ───────────────────────
  useEffect(() => {
    if (!MAPS_API_KEY || MAPS_API_KEY === 'your_google_maps_key') {
      setLoading(false);
      setLocError('Google Maps API key not configured.');
      return;
    }

    const loader = new Loader({
      apiKey: MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'marker'],
    });

    loader.load()
      .then(() => setMapsLoaded(true))
      .catch(() => {
        setLocError('Failed to load Google Maps.');
        setLoading(false);
      });
  }, []);

  // ── Get user location ──────────────────────
  useEffect(() => {
    if (!mapsLoaded) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      () => {
        setLocation({ lat: 13.0827, lng: 80.2707 }); // fallback
        setLoading(false);
        showToast('Using default location', 'warning');
      }
    );
  }, [mapsLoaded]);

  // ── Init map ───────────────────────────────
  useEffect(() => {
    if (!location || !mapsLoaded || !mapRef.current || googleMapRef.current) return;

    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      center: location,
      zoom: 14,
      styles: DARK_MAP_STYLES,
      disableDefaultUI: true,
      zoomControl: true,
    });

    new window.google.maps.Marker({
      position: location,
      map: googleMapRef.current,
      title: 'Your Location',
    });
  }, [location, mapsLoaded]);

  // ── Search nearby ──────────────────────────
  const searchNearby = useCallback(async (type) => {
    if (!googleMapRef.current || !location) return;

    const typeConfig = SERVICE_TYPES.find((t) => t.id === type);
    if (!typeConfig) return;

    setSearching(true);
    setPlaces([]);

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    try {
      const { Place, SearchNearbyRankPreference } = await window.google.maps.importLibrary('places');

      const request = {
        fields: ['displayName', 'location', 'formattedAddress', 'rating'],
        locationRestriction: {
          center: new window.google.maps.LatLng(location.lat, location.lng),
          radius: 5000,
        },
        includedPrimaryTypes: [typeConfig.primaryType],
        maxResultCount: 8,
        rankPreference: SearchNearbyRankPreference.DISTANCE,
      };

      const { places: results } = await Place.searchNearby(request);
      setSearching(false);

      if (!results) return;

      const normalized = results.map((p) => ({
        place_id: p.id,
        name: p.displayName,
        vicinity: p.formattedAddress,
        rating: p.rating,
        latLng: p.location,
      }));

      setPlaces(normalized);

      normalized.forEach((place) => {
        const marker = new window.google.maps.Marker({
          position: place.latLng,
          map: googleMapRef.current,
        });
        markersRef.current.push(marker);
      });

    } catch (err) {
      setSearching(false);
      showToast('Places search failed', 'error');
    }
  }, [location, showToast]);

  // ── Highlight SOS ──────────────────────────
  const highlightEmergency = useCallback((type) => {
    if (!googleMapRef.current || !location) return;

    const typeConfig = SERVICE_TYPES.find((t) => t.id === type);
    if (!typeConfig) return;

    googleMapRef.current.setCenter(location);
    googleMapRef.current.setZoom(15);

    if (highlightCircleRef.current) {
      highlightCircleRef.current.setMap(null);
    }

    highlightCircleRef.current = new window.google.maps.Circle({
      map: googleMapRef.current,
      center: location,
      radius: 800,
      fillColor: typeConfig.color,
      fillOpacity: 0.2,
      strokeColor: typeConfig.color,
      strokeWeight: 2,
    });

    searchNearby(type);
  }, [location, searchNearby]);

  // ── Listen for SOS event ───────────────────
  useEffect(() => {
    const handler = (e) => {
      const typeMap = {
        fire: 'fire_station',
        medical: 'hospital',
        security: 'police',
      };

      const target = typeMap[e.detail?.type];
      if (target) {
        highlightEmergency(target);
      }
    };

    window.addEventListener('sos:triggered', handler);
    return () => window.removeEventListener('sos:triggered', handler);
  }, [highlightEmergency]);

  useEffect(() => {
    if (location && mapsLoaded) {
      searchNearby(activeType);
    }
  }, [location, mapsLoaded]);

  return (
    <div style={{ height: '100vh' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

// ── Dark theme ───────────────────────────────
const DARK_MAP_STYLES = [
  { elementType:'geometry', stylers:[{ color:'#0a0a0f' }] }
];
// ─────────────────────────────────────────────
// LoRa Simulation Gateway (Render-ready)
// ─────────────────────────────────────────────

const express = require('express');
const cors = require('cors');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// ── Middleware ─────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

// ── Firebase Admin Init (FIXED) ────────────────
let db;

try {
  let serviceAccount = null;

  // ✅ Parse JSON from Render ENV (SECURE)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }

  if (!serviceAccount) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT environment variable");
  }

  initializeApp({
    credential: cert(serviceAccount),
  });

  db = getFirestore();
  console.log('[LoRa] Firebase connected');

} catch (err) {
  console.error('[LoRa] Firebase init failed:', err.message);
  console.warn('[LoRa] Running in SIMULATION mode');
}

// ── Simulation fallback ────────────────────────
const simulatedIncidents = [];

// ── Validation ─────────────────────────────────
function validateIncident(body) {
  const { type, location } = body;
  const validTypes = ['fire', 'medical', 'security'];

  if (!validTypes.includes(type)) {
    return 'Invalid type (fire | medical | security)';
  }

  if (!location || !location.trim()) {
    return 'Location is required';
  }

  return null;
}

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────

/**
 * POST /incident
 * Receives LoRa SOS and forwards to Firestore
 */
app.post('/incident', async (req, res) => {
  const { type, location } = req.body;

  console.log(`[LoRa] Received: ${type} @ ${location}`);

  // Validate
  const error = validateIncident(req.body);
  if (error) {
    return res.status(400).json({ success: false, error });
  }

  const incident = {
    type,
    location,
    status: 'active',
    assignedTo: null,
    timestamp: Date.now(),
    mode: 'lora',
  };

  // ── Firestore write ─────────────────────────
  if (db) {
    try {
      const docRef = await db.collection('incidents').add(incident);

      console.log(`[LoRa] Stored: ${docRef.id}`);

      return res.status(201).json({
        success: true,
        incidentId: docRef.id,
        mode: 'lora',
      });

    } catch (err) {
      console.error('[LoRa] Firestore error:', err);
      return res.status(500).json({
        success: false,
        error: 'Firestore write failed',
      });
    }
  }

  // ── Simulation fallback ─────────────────────
  const simId = `sim_${Date.now()}`;
  simulatedIncidents.push({ id: simId, ...incident });

  return res.status(201).json({
    success: true,
    incidentId: simId,
    mode: 'simulation',
  });
});

/**
 * GET /status
 * Health check
 */
app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    firestore: db ? 'connected' : 'simulation',
    timestamp: Date.now(),
  });
});

/**
 * GET /incidents
 * Only for simulation mode
 */
app.get('/incidents', (req, res) => {
  if (db) {
    return res.json({ message: 'Check Firestore console' });
  }
  res.json({ incidents: simulatedIncidents });
});

// ── Start server ───────────────────────────────
app.listen(PORT, () => {
  console.log(`🚨 LoRa Server running on http://localhost:${PORT}`);
});
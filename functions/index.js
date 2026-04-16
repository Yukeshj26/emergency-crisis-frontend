const functions = require("firebase-functions");
const { admin, db } = require("./firebaseAdmin");

/**
 * Assign nearest available staff
 */
async function assignStaff(incident) {
  const snapshot = await db
    .collection("staff")
    .where("available", "==", true)
    .get();

  if (snapshot.empty) return null;

  let selectedStaff = null;

  const incidentFloor = incident.location.match(/\d+/)?.[0]?.[0];

  // Same floor priority
  snapshot.forEach((doc) => {
    const staff = doc.data();
    if (!selectedStaff && String(staff.floor) === incidentFloor) {
      selectedStaff = { id: doc.id, ...staff };
    }
  });

  // Fallback
  if (!selectedStaff) {
    const first = snapshot.docs[0];
    selectedStaff = { id: first.id, ...first.data() };
  }

  return selectedStaff;
}

/**
 * 🔥 On incident create → assign staff
 */
exports.onIncidentCreate = functions.firestore
  .document("incidents/{incidentId}")
  .onCreate(async (snap) => {
    const incident = snap.data();
    const ref = snap.ref;

    if (incident.assignedTo) return null;

    const staff = await assignStaff(incident);
    if (!staff) return null;

    await ref.update({
      assignedTo: staff.id,
      status: "assigned"
    });

    await db.collection("staff").doc(staff.id).update({
      available: false
    });

    return null;
  });

/**
 * 🔓 Free staff on resolve
 */
exports.onIncidentUpdate = functions.firestore
  .document("incidents/{incidentId}")
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after  = change.after.data();

    if (before.status !== "resolved" && after.status === "resolved") {
      if (!after.assignedTo) return null;

      await db.collection("staff")
        .doc(after.assignedTo)
        .update({ available: true });
    }

    return null;
  });

/**
 * 🔔 SEND FCM ON ASSIGNMENT
 */
exports.notifyOnAssignment = functions.firestore
  .document("incidents/{incidentId}")
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after  = change.after.data();

    if (before.assignedTo === after.assignedTo || !after.assignedTo) {
      return null;
    }

    try {
      const staffDoc = await db
        .collection("staff")
        .doc(after.assignedTo)
        .get();

      const staff = staffDoc.data();

      if (!staff?.fcmToken) {
        console.warn("No FCM token");
        return null;
      }

      const message = {
        token: staff.fcmToken,
        notification: {
          title: "🚨 New Incident Assigned",
          body: `${after.type.toUpperCase()} at ${after.location}`
        }
      };

      await admin.messaging().send(message);

      console.log("✅ Notification sent");

    } catch (err) {
      console.error("❌ FCM Error:", err);
    }

    return null;
  });
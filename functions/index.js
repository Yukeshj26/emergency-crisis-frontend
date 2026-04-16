const functions = require("firebase-functions");
const { db } = require("./firebaseAdmin");

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

  const incidentFloor = incident.location.replace("Room ", "");

  // Priority: same floor
  snapshot.forEach((doc) => {
    const staff = doc.data();
    if (!selectedStaff && staff.floor === incidentFloor) {
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
 * On incident create → assign staff
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
 * On incident update → free staff when resolved
 */
exports.onIncidentUpdate = functions.firestore
  .document("incidents/{incidentId}")
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status !== "resolved" && after.status === "resolved") {
      if (!after.assignedTo) return null;

      await db.collection("staff")
        .doc(after.assignedTo)
        .update({ available: true });
    }

    return null;
  });
console.log("INDEX.JS IS LOADED");

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, collection, getDocs, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// 1. YOUR FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyDmVaFLFCeHn6gPGiGuEQ6jlW4KyYS_lkw",
    authDomain: "literacy-knowledge.firebaseapp.com",
    projectId: "literacy-knowledge",
    storageBucket: "literacy-knowledge.firebasestorage.app",
    messagingSenderId: "1038879632155",
    appId: "1:1038879632155:web:6961b7ccc7b70f39d981be"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. SEEDING FUNCTION (Run this once, then comment out)   Uncomment if reseeding
// async function seedDatabase() {
    console.log("Starting seed...");
    for (const s of sessionsData) {
        await setDoc(doc(db, "literacy_sessions", s.id), s);
        await setDoc(doc(db, "user_progress", s.id), {
            code_status: "grey",
            meaning_status: "grey",
            code_notes: "",
            meaning_notes: ""
        });
    }
    alert("Database Seeded!");
}

// UNCOMMENT THE LINE BELOW TO SEED, THEN RE-COMMENT IT AFTER  only if needing to reseed the database
// seedDatabase();

function setupRealtimeSync(sessionId) {
    onSnapshot(doc(db, "user_progress", sessionId), (docSnap) => {
        const data = docSnap.data();
        if (!data) return;
        ['code', 'meaning'].forEach(type => {
            const dot = document.getElementById(`dot-${type}-${sessionId}`);
            const note = document.getElementById(`notes-${type}-${sessionId}`);
            if (dot) dot.className = `status-dot ${data[`${type}_status`]}`;
            if (note && document.activeElement !== note) note.value = data[`${type}_notes`];
        });
    });
}

// 4. DASHBOARD LOGIC
async function initDashboard() {
    const querySnapshot = await getDocs(collection(db, "literacy_sessions"));
    const sessions = querySnapshot.docs.map(doc => doc.data()).sort((a,b) => a.session_num - b.session_num);

    const codeContainer = document.getElementById('code-container');
    const meaningContainer = document.getElementById('meaning-container');

    sessions.forEach(session => {
        codeContainer.appendChild(renderTile(session, 'code'));
        meaningContainer.appendChild(renderTile(session, 'meaning'));
        setupRealtimeSync(session.id);
    });
}

function renderTile(data, type) {
    const card = document.createElement('div');
    card.className = 'session-card';
    card.innerHTML = `
        <div class="card-top" onclick="toggleDrawer('${type}-${data.id}')">
            <div class="status-dot" id="dot-${type}-${data.id}" onclick="cycleStatus(event, '${data.id}', '${type}')"></div>
            <span class="session-label">S${data.session_num}: ${type === 'code' ? data.code_craft.focus : data.meaning_engine.word}</span>
        </div>
        <div class="drawer" id="drawer-${type}-${data.id}" style="display:none;">
            <div class="drawer-content">
                ${type === 'code' ? renderCodeContent(data.code_craft) : renderMeaningContent(data.meaning_engine)}
                <textarea class="notes-field" id="notes-${type}-${data.id}" 
                    placeholder="Add lesson notes..." 
                    onchange="updateNote('${data.id}', '${type}', this.value)"></textarea>
            </div>
        </div>
    `;
    return card;
}

function renderCodeContent(c) {
    return `<p><strong>Handwriting:</strong> ${c.handwriting}</p><p><strong>Targets:</strong> ${c.targets.join(', ')}</p><p><strong>Retrieval:</strong> ${c.retrieval.join(', ')}</p><p class="dictation">"${c.dictation}"</p>`;
}

function renderMeaningContent(m) {
    return `
        <div class="meaning-display">
            <p class="family-tag">${m.family}</p>
            <p><strong>Definition:</strong> ${m.definition || 'To look closely.'}</p>
            <div class="boundary-box">
                <p>✅ <strong>THIS:</strong> ${m.boundary_eg || m.boundary}</p>
                <p>❌ <strong>NOT THAT:</strong> ${m.boundary_non || 'N/A'}</p>
            </div>
            <div class="stems">
                <strong>Expansion Stems:</strong>
                <ul>
                    <li>... because</li>
                    <li>... but</li>
                    <li>... so</li>
                </ul>
            </div>
        </div>
    `;
}

// 5. EVENT HANDLERS & SYNC
window.cycleStatus = async (event, sessionId, type) => {
    event.stopPropagation(); // Prevents the drawer from opening/closing when you click the dot
    
    const docRef = doc(db, "user_progress", sessionId);
    const dot = document.getElementById(`dot-${type}-${sessionId}`);
    
    // Logic: Grey -> Green -> Yellow -> (back to Grey)
    let nextStatus = 'grey';
    if (dot.classList.contains('grey')) nextStatus = 'green';
    else if (dot.classList.contains('green')) nextStatus = 'yellow';
    else if (dot.classList.contains('yellow')) nextStatus = 'grey';

    // Update Firebase immediately
    await updateDoc(docRef, { [`${type}_status`]: nextStatus });
    
    // The setupRealtimeSync function will handle updating the UI color automatically!
};

window.updateNote = async (id, type, val) => {
    await updateDoc(doc(db, "user_progress", id), { [`${type}_notes`]: val });
};

window.toggleDrawer = (id) => {
    const el = document.getElementById(`drawer-${id}`);
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
};


initDashboard();

console.log("Attempting to run seed...");
seedDatabase().then(() => console.log("Seed function finished!"));

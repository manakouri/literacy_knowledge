import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore, doc, collection, getDocs, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDmVaFLFCeHn6gPGiGuEQ6jlW4KyYS_lkw",
    authDomain: "literacy-knowledge.firebaseapp.com",
    projectId: "literacy-knowledge",
    storageBucket: "literacy-knowledge.firebasestorage.app",
    messagingSenderId: "1038879632155",
    appId: "1:1038879632155:web:6961b7ccc7b70f39d981be"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 1. DASHBOARD INITIALIZATION
async function initDashboard() {
    const querySnapshot = await getDocs(collection(db, "literacy_sessions"));
    const sessions = querySnapshot.docs.map(doc => doc.data()).sort((a,b) => a.session_num - b.session_num);

    const codeContainer = document.getElementById('code-container');
    const meaningContainer = document.getElementById('meaning-container');

    // Clear containers in case of a re-run
    codeContainer.innerHTML = '';
    meaningContainer.innerHTML = '';

    sessions.forEach(session => {
        codeContainer.appendChild(renderTile(session, 'code'));
        meaningContainer.appendChild(renderTile(session, 'meaning'));
        setupRealtimeSync(session.id);
    });
}

// 2. TILE RENDERING
function renderTile(data, type) {
    const isBenchmark = data.session_num % 5 === 0;
    const card = document.createElement('div');
    card.className = `session-card ${isBenchmark ? 'benchmark-highlight' : ''}`;
    
    card.innerHTML = `
        <div class="card-top" onclick="toggleDrawer('${type}-${data.id}')">
            <div class="status-dot ${data[`${type}_status`] || 'grey'}" 
                 id="dot-${type}-${data.id}" 
                 onclick="cycleStatus(event, '${data.id}', '${type}')"></div>
            <span class="session-label">S${data.session_num}: ${type === 'code' ? data.code_craft.focus : data.meaning_engine.word}</span>
        </div>
        <div class="drawer" id="drawer-${type}-${data.id}" style="display:none;">
            <div class="drawer-content">
                <div class="script-section">
                    ${type === 'code' ? renderCodeContent(data.code_craft) : renderMeaningContent(data.meaning_engine)}
                </div>
                
                <div class="notes-wrapper">
                    <label class="notes-label">Session Observations</label>
                    <textarea class="notes-field" id="notes-${type}-${data.id}" 
                        placeholder="Type teacher notes here..." 
                        onchange="updateNote('${data.id}', '${type}', this.value)"></textarea>
                </div>
            </div>
        </div>
    `;
    return card;
}

function renderCodeContent(c) {
    return `
        <p><strong>Handwriting:</strong> ${c.handwriting}</p>
        <p><strong>Targets:</strong> ${c.targets.join(', ')}</p>
        <p><strong>Retrieval:</strong> ${c.retrieval.join(', ')}</p>
        <p class="dictation">"${c.dictation}"</p>
    `;
}

function renderMeaningContent(m) {
    // If 'boundary' exists and contains 'vs', we split it for the UI
    let thisPart = m.boundary || m.boundary_eg || "No example provided.";
    let notThatPart = m.boundary_non || "N/A";

    if (m.boundary && m.boundary.includes("vs")) {
        const parts = m.boundary.split("vs");
        thisPart = parts[0].trim().replace("(This)", "");
        notThatPart = parts[1].trim().replace("(Not That)", "");
    }

    return `
        <div class="meaning-display">
            <p class="family-tag"><strong>Family:</strong> ${m.family}</p>
            <div class="boundary-box">
                <div class="boundary-item this">
                    <span class="icon">✅</span>
                    <div><strong>THIS:</strong> ${thisPart}</div>
                </div>
                <div class="boundary-item not-that">
                    <span class="icon">❌</span>
                    <div><strong>NOT THAT:</strong> ${notThatPart}</div>
                </div>
            </div>
            <div class="stems-box">
                <strong>Oral Language Drills:</strong>
                <p class="stem-item">... because</p>
                <p class="stem-item">... but</p>
                <p class="stem-item">... so</p>
            </div>
        </div>
    `;
}

// 3. UTILITIES & REALTIME SYNC
window.toggleDrawer = (id) => {
    const el = document.getElementById(`drawer-${id}`);
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
};

window.cycleStatus = async (event, sessionId, type) => {
    event.stopPropagation();
    const docRef = doc(db, "user_progress", sessionId);
    const dot = document.getElementById(`dot-${type}-${sessionId}`);
    
    let nextStatus = 'grey';
    if (dot.classList.contains('grey')) nextStatus = 'green';
    else if (dot.classList.contains('green')) nextStatus = 'yellow';
    else if (dot.classList.contains('yellow')) nextStatus = 'grey';

    await updateDoc(docRef, { [`${type}_status`]: nextStatus });
};

window.updateNote = async (id, type, val) => {
    await updateDoc(doc(db, "user_progress", id), { [`${type}_notes`]: val });
};

function setupRealtimeSync(sessionId) {
    onSnapshot(doc(db, "user_progress", sessionId), (docSnap) => {
        const data = docSnap.data();
        if (!data) return;
        ['code', 'meaning'].forEach(type => {
            const dot = document.getElementById(`dot-${type}-${sessionId}`);
            const note = document.getElementById(`notes-${type}-${sessionId}`);
            if (dot) {
                dot.classList.remove('grey', 'green', 'yellow');
                dot.classList.add(data[`${type}_status`] || 'grey');
            }
            if (note && document.activeElement !== note) {
                note.value = data[`${type}_notes`] || '';
            }
        });
    });
}

// Start the app
initDashboard();

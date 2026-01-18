import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

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
            <div class="status-dot ${type}-dot" id="dot-${type}-${data.id}" onclick="cycleStatus(event, '${data.id}', '${type}')"></div>
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

// Logic for Content Rendering
function renderCodeContent(c) {
    return `
        <p><strong>Handwriting:</strong> ${c.handwriting}</p>
        <p><strong>Targets:</strong> ${c.targets.join(', ')}</p>
        <p><strong>Retrieval:</strong> ${c.retrieval.join(', ')}</p>
        <p class="dictation">"${c.dictation}"</p>
    `;
}

function renderMeaningContent(m) {
    return `
        <p><strong>Family:</strong> ${m.family}</p>
        <p><strong>Example:</strong> ${m.boundary_eg}</p>
        <p><strong>Non-Example:</strong> ${m.boundary_non}</p>
        <div class="stems"><em>Expansion: ${m.stems.join(' / ')}</em></div>
    `;
}

// Firebase Syncing
window.updateNote = async (id, type, val) => {
    const ref = doc(db, "user_progress", id);
    await updateDoc(ref, { [`${type}_notes`]: val });
};

window.toggleDrawer = (id) => {
    const el = document.getElementById(`drawer-${id}`);
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
};

window.cycleStatus = async (event, sessionId, type) => {
    event.stopPropagation(); // Prevents the drawer from opening
    const dot = document.getElementById(`dot-${type}-${sessionId}`);
    const currentStatus = dot.classList.contains('green') ? 'green' : 
                         dot.classList.contains('yellow') ? 'yellow' : 'grey';
    
    let nextStatus = 'grey';
    if (currentStatus === 'grey') nextStatus = 'green';
    else if (currentStatus === 'green') nextStatus = 'yellow';
    else if (currentStatus === 'yellow') nextStatus = 'grey';

    // Update UI
    dot.classList.remove('grey', 'green', 'yellow');
    dot.classList.add(nextStatus);

    // Update Firestore
    const ref = doc(db, "user_progress", sessionId);
    await updateDoc(ref, { [`${type}_status`]: nextStatus });
};

initDashboard();

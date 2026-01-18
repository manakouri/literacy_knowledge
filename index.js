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

// 2. THE MASTER DATA VARIABLE     Uncomment if reseeding
// const sessionsData = [
  /* WEEK 1-2: THE OBSERVERS (Foundations) */
  { "id": "s1", "session_num": 1, "code_craft": { "focus": "Short /a/ & Clockface", "handwriting": "Model 'a', 'c', 'o' (2 o'clock start).", "targets": ["cat", "zap", "napkin"], "retrieval": ["map", "fan"], "dictation": "The cat had a napkin." }, "meaning_engine": { "word": "Notice", "family": "Observers", "boundary": "Seeing a tiny crack (This) vs staring at a wall (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s2", "session_num": 2, "code_craft": { "focus": "Short /i/ & Tall Letters", "handwriting": "Model 'l', 't', 'k' (Top-down).", "targets": ["pin", "sit", "mitten"], "retrieval": ["cat", "nap"], "dictation": "A rabbit had a pin." }, "meaning_engine": { "word": "Observe", "family": "Observers", "boundary": "Watching a snail move (This) vs glancing at a clock (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s3", "session_num": 3, "code_craft": { "focus": "Short /o/ & Clockface", "handwriting": "Model 'd', 'g', 'q' (2 o'clock start).", "targets": ["log", "dot", "bobcat"], "retrieval": ["pin", "sit", "cat"], "dictation": "The bobcat is hot." }, "meaning_engine": { "word": "Identify", "family": "Observers", "boundary": "Knowing it is a Tui (This) vs saying 'a bird' (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s4", "session_num": 4, "code_craft": { "focus": "Short /u/ & Tunnelers", "handwriting": "Model 'n', 'm', 'r' (Bounce up).", "targets": ["cup", "mud", "sunset"], "retrieval": ["log", "pin", "zap"], "dictation": "The cup is in the mud." }, "meaning_engine": { "word": "Feature", "family": "Observers", "boundary": "An elephant's trunk (This) vs a speck of dust (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s5", "session_num": 5, "code_craft": { "focus": "Vowel Review & Benchmark 1", "handwriting": "Mixed Review", "targets": ["Review List"], "retrieval": ["cat", "pin", "log", "cup"], "dictation": "Assessment: Vowel Mastery" }, "meaning_engine": { "word": "Detect", "family": "Observers", "boundary": "A dog sniffing a treat (This) vs seeing an elephant (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s6", "session_num": 6, "code_craft": { "focus": "Short /e/ & The Loop", "handwriting": "Model 'e' (Hit the ball).", "targets": ["hen", "net", "helmet"], "retrieval": ["mud", "log", "pin"], "dictation": "The red hen has a helmet." }, "meaning_engine": { "word": "Construct", "family": "Creators", "boundary": "Building a birdhouse (This) vs crushing paper (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s7", "session_num": 7, "code_craft": { "focus": "/k/ Protector (-ck)", "handwriting": "Model 'c' to 'k' connection.", "targets": ["back", "rock", "pocket"], "retrieval": ["hen", "mud", "cat"], "dictation": "Put the ticket in your pocket." }, "meaning_engine": { "word": "Create", "family": "Creators", "boundary": "Painting a new picture (This) vs photocopying (Not That).", "stems": ["because", "but", "so"] } },

  /* WEEK 3-4: THE CREATORS (Digraphs & Trigraphs) */
  { "id": "s8", "session_num": 8, "code_craft": { "focus": "Digraph 'sh'", "handwriting": "Model 's' to 'h' flow.", "targets": ["ship", "fish", "fishnet"], "retrieval": ["back", "hen", "log"], "dictation": "The ship had a fishnet." }, "meaning_engine": { "word": "Design", "family": "Creators", "boundary": "Drawing a map first (This) vs building randomly (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s9", "session_num": 9, "code_craft": { "focus": "Digraph 'ch'", "handwriting": "Model 'c' to 'h' flow.", "targets": ["chip", "rich", "bench"], "retrieval": ["ship", "back", "mud"], "dictation": "A rich man sat on the bench." }, "meaning_engine": { "word": "Produce", "family": "Creators", "boundary": "A garden growing food (This) vs finding a rock (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s10", "session_num": 10, "code_craft": { "focus": "Digraph Review & Benchmark 2", "handwriting": "Mixed Review", "targets": ["Review List"], "retrieval": ["chip", "ship", "back"], "dictation": "Assessment: Digraph Mastery" }, "meaning_engine": { "word": "Improve", "family": "Creators", "boundary": "Editing a story (This) vs leaving a mistake (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s11", "session_num": 11, "code_craft": { "focus": "Trigraph -tch (Protector)", "handwriting": "Model 't-c-h' heights.", "targets": ["match", "pitch", "kitchen"], "retrieval": ["bench", "ship", "back"], "dictation": "We had a match in the kitchen." }, "meaning_engine": { "word": "Wonder", "family": "Thinkers", "boundary": "Asking how stars work (This) vs knowing exactly (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s12", "session_num": 12, "code_craft": { "focus": "Digraph 'th'", "handwriting": "Model 't' to 'h' (Tall letters).", "targets": ["thin", "bath", "thunder"], "retrieval": ["match", "chip", "hen"], "dictation": "The thin man had a bath." }, "meaning_engine": { "word": "Predict", "family": "Thinkers", "boundary": "Guessing rain from clouds (This) vs random guessing (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s13", "session_num": 13, "code_craft": { "focus": "Trigraph -dge (Protector)", "handwriting": "Model 'g' descender loop.", "targets": ["bridge", "edge", "badger"], "retrieval": ["thin", "match", "ship"], "dictation": "The badger is at the bridge." }, "meaning_engine": { "word": "Imagine", "family": "Thinkers", "boundary": "Living on Mars (This) vs looking at a photo (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s14", "session_num": 14, "code_craft": { "focus": "wh, ph, qu", "handwriting": "Model 'q' to 'u' (Clockface to Tunneler).", "targets": ["whale", "phone", "quick"], "retrieval": ["bridge", "thin", "back"], "dictation": "The quick whale is on the phone." }, "meaning_engine": { "word": "Assume", "family": "Thinkers", "boundary": "Lights are on, so it's open (This) vs checking a sign (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s15", "session_num": 15, "code_craft": { "focus": "Mid-Term Mastery", "handwriting": "LPM Sprint", "targets": ["Mixed targets"], "retrieval": ["whale", "bridge", "match", "cat"], "dictation": "Mid-Term Assessment" }, "meaning_engine": { "word": "Conclude", "family": "Thinkers", "boundary": "Deciding after thinking (This) vs guessing at the start (Not That).", "stems": ["because", "but", "so"] } },

  /* WEEK 5-6: THE SHIFTERS (Consonant -le Part 1) */
  { "id": "s16", "session_num": 16, "code_craft": { "focus": "-ble Syllable", "handwriting": "Model 'b' to 'l' connection.", "targets": ["bubble", "noble", "nibble"], "retrieval": ["quick", "whale", "bridge"], "dictation": "The bubble will nibble the cake." }, "meaning_engine": { "word": "Transform", "family": "Shifters", "boundary": "Ice to water (This) vs painting a wall (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s17", "session_num": 17, "code_craft": { "focus": "-dle Syllable", "handwriting": "Model 'd' to 'l' connection.", "targets": ["candle", "middle", "puddle"], "retrieval": ["bubble", "quick", "thin"], "dictation": "Put the candle in the middle." }, "meaning_engine": { "word": "Alter", "family": "Shifters", "boundary": "Tailoring a suit (This) vs buying a new one (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s18", "session_num": 18, "code_craft": { "focus": "-gle Syllable", "handwriting": "Model 'g' descender to 'l'.", "targets": ["giggle", "jungle", "single"], "retrieval": ["puddle", "bubble", "whale"], "dictation": "We giggle in the jungle." }, "meaning_engine": { "word": "Transition", "family": "Shifters", "boundary": "Moving to a new class (This) vs sitting in a chair (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s19", "session_num": 19, "code_craft": { "focus": "-ple Syllable", "handwriting": "Model 'p' descender to 'l'.", "targets": ["apple", "purple", "simple"], "retrieval": ["jungle", "candle", "quick"], "dictation": "A simple purple apple." }, "meaning_engine": { "word": "Replace", "family": "Shifters", "boundary": "New bulb in a lamp (This) vs turning it off (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s20", "session_num": 20, "code_craft": { "focus": "-le Review Day", "handwriting": "Mixed stable syllables.", "targets": ["Review List"], "retrieval": ["apple", "puddle", "bubble"], "dictation": "Assessment: -le Mastery 1" }, "meaning_engine": { "word": "Evolve", "family": "Shifters", "boundary": "Skills growing over time (This) vs waking up early (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s21", "session_num": 21, "code_craft": { "focus": "-tle Syllable", "handwriting": "Model 't' into 'l'.", "targets": ["little", "kettle", "bottle"], "retrieval": ["apple", "jungle", "bridge"], "dictation": "The little kettle is hot." }, "meaning_engine": { "word": "Combine", "family": "Connectors", "boundary": "Mixing colors (This) vs keeping them separate (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s22", "session_num": 22, "code_craft": { "focus": "-kle Syllable", "handwriting": "Model 'k' into 'l'.", "targets": ["pickle", "ankle", "tackle"], "retrieval": ["bottle", "purple", "candle"], "dictation": "I have a red ankle." }, "meaning_engine": { "word": "Attach", "family": "Connectors", "boundary": "Gluing a handle (This) vs holding it (Not That).", "stems": ["because", "but", "so"] } },

  /* WEEK 7-8: THE CONNECTORS (Consonant -le Part 2 & Doublets) */
  { "id": "s23", "session_num": 23, "code_craft": { "focus": "-fle Syllable", "handwriting": "Model 'f' (Tall/Descender) to 'l'.", "targets": ["waffle", "raffle", "rifle"], "retrieval": ["pickle", "little", "bubble"], "dictation": "I won a waffle in the raffle." }, "meaning_engine": { "word": "Relate", "family": "Connectors", "boundary": "Comparing two stories (This) vs reading one (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s24", "session_num": 24, "code_craft": { "focus": "-zle Syllable", "handwriting": "Model 'z' into 'l'.", "targets": ["puzzle", "dazzle", "muzzle"], "retrieval": ["waffle", "ankle", "jungle"], "dictation": "The puzzle will dazzle you." }, "meaning_engine": { "word": "Link", "family": "Connectors", "boundary": "Two chain pieces (This) vs two separate rocks (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s25", "session_num": 25, "code_craft": { "focus": "-sle Syllable", "handwriting": "Model 's' into 'l'.", "targets": ["castle", "hassle", "rustle"], "retrieval": ["puzzle", "pickle", "apple"], "dictation": "The castle is a hassle." }, "meaning_engine": { "word": "Assemble", "family": "Connectors", "boundary": "Building a kit (This) vs throwing parts in a box (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s26", "session_num": 26, "code_craft": { "focus": "Final -le Review", "handwriting": "Mixed endings.", "targets": ["Review List"], "retrieval": ["castle", "waffle", "little"], "dictation": "Assessment: -le Final Mastery" }, "meaning_engine": { "word": "Comfort", "family": "Empaths", "boundary": "Hugging a sad friend (This) vs laughing at them (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s27", "session_num": 27, "code_craft": { "focus": "Double 'ff' (Floss)", "handwriting": "Model 'f' to 'f' height consistency.", "targets": ["off", "cliff", "muffin"], "retrieval": ["castle", "puzzle", "thin"], "dictation": "Get off the big cliff." }, "meaning_engine": { "word": "Encourage", "family": "Empaths", "boundary": "Cheering at a race (This) vs telling them to quit (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s28", "session_num": 28, "code_craft": { "focus": "Double 'll' (Floss)", "handwriting": "Model parallel 'l' lines.", "targets": ["bell", "hill", "bellow"], "retrieval": ["cliff", "little", "match"], "dictation": "The bell is on the hill." }, "meaning_engine": { "word": "Assist", "family": "Empaths", "boundary": "Helping carry bags (This) vs watching them struggle (Not That).", "stems": ["because", "but", "so"] } },

  /* WEEK 9: THE SCHOLARS (Synthesis) */
  { "id": "s29", "session_num": 29, "code_craft": { "focus": "Double 'ss' (Floss)", "handwriting": "Model 's' curves.", "targets": ["miss", "less", "lesson"], "retrieval": ["bell", "cliff", "castle"], "dictation": "Do not miss the lesson." }, "meaning_engine": { "word": "Protect", "family": "Empaths", "boundary": "Keeping a pet safe (This) vs leaving the gate open (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s30", "session_num": 30, "code_craft": { "focus": "Double 'zz' (Floss)", "handwriting": "Model 'z' zig-zags.", "targets": ["buzz", "jazz", "dizzy"], "retrieval": ["miss", "bell", "puzzle"], "dictation": "The jazz music makes me dizzy." }, "meaning_engine": { "word": "Support", "family": "Empaths", "boundary": "Holding someone's arm (This) vs pushing them (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s31", "session_num": 31, "code_craft": { "focus": "Protector Review", "handwriting": "tch vs dge vs ck", "targets": ["clock", "kitchen", "bridge"], "retrieval": ["buzz", "miss", "back"], "dictation": "The clock is in the kitchen." }, "meaning_engine": { "word": "Inquire", "family": "Scholars", "boundary": "Asking a smart question (This) vs shouting 'Hello' (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s32", "session_num": 32, "code_craft": { "focus": "Syllable Review", "handwriting": "Mixed multi-syllables.", "targets": ["napkin", "helmet", "bubble"], "retrieval": ["bridge", "dizzy", "apple"], "dictation": "A little bubble in the middle." }, "meaning_engine": { "word": "Research", "family": "Scholars", "boundary": "Looking in a book for facts (This) vs making up a story (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s33", "session_num": 33, "code_craft": { "focus": "Synthesis 1", "handwriting": "LPM Sprint", "targets": ["nibbled", "badger", "apple"], "retrieval": ["bubble", "kitchen", "cat"], "dictation": "The badger nibbled the apple." }, "meaning_engine": { "word": "Explain", "family": "Scholars", "boundary": "Teaching how to play (This) vs playing by yourself (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s34", "session_num": 34, "code_craft": { "focus": "Synthesis 2", "handwriting": "LPM Sprint", "targets": ["dolphin", "jungle", "whale"], "retrieval": ["nibbled", "bubble", "bridge"], "dictation": "A dolphin is in the jungle." }, "meaning_engine": { "word": "Summarize", "family": "Scholars", "boundary": "The 'short version' of a story (This) vs retelling every word (Not That).", "stems": ["because", "but", "so"] } },
  { "id": "s35", "session_num": 35, "code_craft": { "focus": "Term 1 Mastery", "handwriting": "Final LPM Check", "targets": ["Final List"], "retrieval": ["All Term 1"], "dictation": "Final Term 1 Mastery Assessment" }, "meaning_engine": { "word": "Present", "family": "Scholars", "boundary": "Showing work to the class (This) vs hiding it in a desk (Not That).", "stems": ["because", "but", "so"] } }
];

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
    return `<p><strong>Family:</strong> ${m.family}</p><p><strong>Boundary:</strong> ${m.boundary}</p><div class="stems"><em>Stems: ${m.stems.join(' / ')}</em></div>`;
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

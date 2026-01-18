import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const db = getFirestore();

const sessions = [
  {
    "id": "s1",
    "session_num": 1,
    "code_craft": {
      "focus": "Short /a/ & Clockface",
      "handwriting": "Model 'a', 'c', 'o' starting at 2 o'clock.",
      "targets": ["cat", "zap", "napkin", "catnip"],
      "retrieval": ["map", "fan", "tap"],
      "dictation": "The cat had a napkin."
    },
    "meaning_engine": {
      "word": "Notice",
      "family": "Observers",
      "boundary_eg": "Seeing a tiny crack in a window.",
      "boundary_non": "Staring at a wall without seeing anything specific.",
      "stems": ["because", "but", "so"]
    }
  },
  {
    "id": "s7",
    "session_num": 7,
    "code_craft": {
      "focus": "The /k/ Protector (-ck)",
      "handwriting": "Model the 'c' into 'k' connection.",
      "targets": ["back", "rock", "ticket", "pocket"],
      "retrieval": ["hen (n-1)", "cup (n-3)", "cat (n-7)"],
      "dictation": "Put the ticket in your pocket."
    },
    "meaning_engine": {
      "word": "Detect",
      "family": "Observers",
      "boundary_eg": "A dog using its nose to find a hidden treat.",
      "boundary_non": "Walking into a room and seeing a giant elephant.",
      "stems": ["because", "but", "so"]
    }
  },
  {
    "id": "s11",
    "session_num": 11,
    "code_craft": {
      "focus": "The /ch/ Protector (-tch)",
      "handwriting": "Model 't' height vs 'c' and 'h'.",
      "targets": ["match", "pitch", "kitchen", "hopscotch"],
      "retrieval": ["chip (n-1)", "hen (n-3)", "back (n-7)"],
      "dictation": "We had a match in the kitchen."
    },
    "meaning_engine": {
      "word": "Construct",
      "family": "Creators",
      "boundary_eg": "Building a birdhouse from wood and nails.",
      "boundary_non": "Crushing a piece of paper into a ball.",
      "stems": ["because", "but", "so"]
    }
  },
  {
    "id": "s13",
    "session_num": 13,
    "code_craft": {
      "focus": "The /j/ Protector (-dge)",
      "handwriting": "Model the 'g' descender loop.",
      "targets": ["bridge", "edge", "badger", "cartridge"],
      "retrieval": ["thin (n-1)", "match (n-3)", "chip (n-7)"],
      "dictation": "The badger is at the bridge."
    },
    "meaning_engine": {
      "word": "Design",
      "family": "Creators",
      "boundary_eg": "Drawing a map of a playground before building it.",
      "boundary_non": "Building something randomly without a plan.",
      "stems": ["because", "but", "so"]
    }
  },
  {
    "id": "s21",
    "session_num": 21,
    "code_craft": {
      "focus": "-tle Final Stable Syllable",
      "handwriting": "Model 't' into 'l' tall connection.",
      "targets": ["little", "kettle", "battle", "bottle"],
      "retrieval": ["apple (n-1)", "candle (n-3)", "match (n-7)"],
      "dictation": "The little kettle is hot."
    },
    "meaning_engine": {
      "word": "Predict",
      "family": "Thinkers",
      "boundary_eg": "Guessing rain because the clouds are black.",
      "boundary_non": "Guessing a random number with your eyes closed.",
      "stems": ["because", "but", "so"]
    }
  },
  {
    "id": "s30",
    "session_num": 30,
    "code_craft": {
      "focus": "Double zz (Floss Rule)",
      "handwriting": "Model the zig-zag 'z' shape.",
      "targets": ["buzz", "jazz", "dizzy", "frizz"],
      "retrieval": ["miss (n-1)", "cliff (n-3)", "bridge (n-13)"],
      "dictation": "The jazz music makes me dizzy."
    },
    "meaning_engine": {
      "word": "Conclude",
      "family": "Thinkers",
      "boundary_eg": "Deciding a book was a mystery after reading the end.",
      "boundary_non": "Reading the first word of a book and stopping.",
      "stems": ["because", "but", "so"]
    }
  }
];

export async function seedDatabase() {
  for (const s of sessions) {
    await setDoc(doc(db, "literacy_sessions", s.id), s);
    // Initialize default user progress
    await setDoc(doc(db, "user_progress", s.id), {
      code_status: "grey",
      meaning_status: "grey",
      code_notes: "",
      meaning_notes: ""
    });
  }
}

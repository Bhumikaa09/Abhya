// ayurveda_symptom_checker.js
// ---------------------------
// Pure JavaScript — creates UI, accepts symptoms, returns suggested Ayurvedic treatments.

// ------ Data: symptom -> treatment ------
const TREATMENT_DB = [
  {
    symptoms: ["cold", "running nose", "blocked nose", "nasal congestion"],
    name: "Shunthi (Dry ginger) & Honey decoction",
    details:
      "Mix dry ginger powder with honey in warm water. Do steam inhalation with tulsi/ginger.",
    precautions: "Avoid cold drinks. Consult doctor if breathing difficulty."
  },
  {
    symptoms: ["fever", "high temperature"],
    name: "Tulsi + Giloy decoction",
    details:
      "Boil tulsi leaves and giloy; sip warm. Stay hydrated.",
    precautions: "If fever is > 2 days, see doctor."
  },
  {
    symptoms: ["headache", "migraine"],
    name: "Brahmi/Tulsi tea & Oil massage",
    details:
      "Apply warm sesame oil on forehead and rest. Brahmi tea helps.",
    precautions: "Sudden severe headache — seek medical care."
  },
  {
    symptoms: ["stomach pain", "indigestion", "gas"],
    name: "Ajwain + Hing + Warm water",
    details:
      "Take ajwain in warm water or hing with warm ghee.",
    precautions: "Severe pain with vomiting — visit doctor."
  },
  {
    symptoms: ["cough", "dry cough"],
    name: "Tulsi-ginger-honey decoction",
    details:
      "Boil tulsi + ginger; add honey. Steam inhalation recommended.",
    precautions: "If long-term cough, consult doctor."
  },
  {
    symptoms: ["ear pain", "blocked ear"],
    name: "Warm oil drops (sesame oil)",
    details:
      "Use slightly warm til oil drops. Do NOT use if ear discharge.",
    precautions: "If severe or with discharge — ENT check."
  }
];

// ------ Utility ------
function normalize(s) {
  return (s || "").toLowerCase().trim();
}

// Match input symptoms with DB
function matchTreatments(inputSymptoms) {
  const results = [];
  for (const entry of TREATMENT_DB) {
    const keyWords = entry.symptoms.map(normalize);
    let score = 0;
    for (const us of inputSymptoms) {
      for (const kw of keyWords) {
        if (us.includes(kw) || kw.includes(us)) score++;
      }
    }
    if (score > 0) results.push({ entry, score });
  }
  results.sort((a, b) => b.score - a.score);
  return results.map(r => r.entry);
}

// ------ UI Creator ------
function createUI() {
  const container = document.createElement("div");
  container.style.maxWidth = "700px";
  container.style.margin = "20px auto";
  container.style.padding = "15px";
  container.style.border = "1px solid #ddd";
  container.style.borderRadius = "10px";
  container.style.fontFamily = "Arial";

  const h = document.createElement("h2");
  h.innerText = "Ayurvedic Symptom → Treatment Checker";
  container.appendChild(h);

  const p = document.createElement("p");
  p.innerText = "Enter symptoms (comma or new line). Example: cold, cough";
  container.appendChild(p);

  const ta = document.createElement("textarea");
  ta.rows = 4;
  ta.style.width = "100%";
  ta.placeholder = "Example: cold, headache";
  container.appendChild(ta);

  const btn = document.createElement("button");
  btn.innerText = "Get Treatment";
  btn.style.marginTop = "10px";
  btn.onclick = () => {
    const raw = ta.value.trim();
    if (!raw) {
      show("Please enter symptoms.", true);
      return;
    }
    const parts = raw.split(/[\n,]+/).map(normalize).filter(Boolean);
    const matches = matchTreatments(parts);
    if (matches.length === 0) {
      show("No treatment found. Try different words.", true);
      return;
    }
    let html = "";
    matches.forEach((m, i) => {
      html += `
      <div style="border:1px dashed #aaa;padding:10px;margin:8px;border-radius:6px">
        <strong>${i + 1}. ${m.name}</strong>
        <p>${m.details}</p>
        <small style="color:#555"><b>Precautions:</b> ${m.precautions}</small>
      </div>`;
    });
    show(html, false);
  };
  container.appendChild(btn);

  const res = document.createElement("div");
  res.id = "result";
  res.style.marginTop = "12px";
  container.appendChild(res);

  function show(html, warn) {
    res.innerHTML = "";
    const box = document.createElement("div");
    box.style.padding = "10px";
    box.style.borderRadius = "6px";
    box.style.background = warn ? "#ffdddd" : "#e7f3ff";
    box.innerHTML = html;
    res.appendChild(box);
  }

  document.body.appendChild(container);
}

// Load UI
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createUI);
} else {
  createUI();
}
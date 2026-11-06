const GameState = {
    score: 1000,
    evidenceCollected: [],
    totalEvidence: 8,
    solvedCipher: false
};

const EvidenceDatabase = {
    phone: { title: "Broken Smartphone", desc: "Found on Kang Min-jun's mahogany desk. Screen shattered from blunt force. Decrypted memory cache reveals final text: 'TERMINATE NEXUS PROJECT NOW!'." },
    coffee: { title: "Ceramic Coffee Cup", desc: "Forensic residue analysis reveals two unique fingerprint signatures: one belonging to the victim, and another unidentified partial print from an unknown visitor." },
    laptop: { title: "Executive Work Laptop", desc: "Active ledger window left unminimized: Shows unauthorized corporate wire transfers totaling $5,000,000 sent to an unlisted Cayman offshore vault." },
    clock: { title: "Smashed Wall Clock", desc: "Stopped precisely at 23:47 KST. Heavy impact cracks on the glass casing suggest a struggle or deliberate staging." },
    camera: { title: "Security Camera Terminal", desc: "Main hallway surveillance feed reveals a deliberate 12-minute blackout loop between 23:30 and 23:42 KST. Only security root credentials could execute this." },
    window: { title: "Sealed Executive Window", desc: "Locked securely from the interior. However, forensic technicians discovered synthetic carbon-fiber micro-threads along the latch frame." },
    note: { title: "Handwritten Threat Note", desc: "Scrawled in haste on corporate letterhead: 'Incheon Port Container Storage #4. Come alone or the board learns everything.'" },
    safe: { title: "Concealed Wall Safe", desc: "Biometric security lock bypassed using a portable power injection relay. Inside compartment is completely emptied of physical bearer bonds." }
};

const SuspectsData = [
    { id: "kim", name: "Kim Seo-yeon", role: "Personal Assistant", age: 29, suspicion: "HIGH", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80", bio: "The last known person to interact with the victim. Claims departure at 10:30 PM, but hall sensors register badge activity at 11:15 PM." },
    { id: "park", name: "Park Ji-hoon", role: "Business Partner", age: 34, suspicion: "MODERATE", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80", bio: "Engaged in severe corporate disputes regarding company equity. Stands to inherit complete voting control if Kang Min-jun vanishes permanently." },
    { id: "lee", name: "Lee Hye-jin", role: "Investigative Journalist", age: 27, suspicion: "LOW", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80", bio: "Actively investigating corporate embezzlement at Nexus Tech. Claims she received an anonymous whistleblower tip on the night of the incident." },
    { id: "choi", name: "Choi Dae-hyun", role: "Head of Security", age: 41, suspicion: "CRITICAL", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80", bio: "Exercises master administrative override over building surveillance and access logs. Dismisses the 12-minute camera blackout as routine maintenance." }
];

const WitnessesData = [
    { id: "receptionist", name: "Building Receptionist (Han Min-woo)", statement: "I was at the front desk all evening. Nobody exited through the main lobby after 11:00 PM, but the service elevator in the east wing was active at 11:35 PM." },
    { id: "guard", name: "Night Security Guard (Kang Dae-sung)", statement: "Chief Choi ordered me to conduct perimeter checks in the basement parking garage right around 11:30 PM. When I returned, the surveillance monitor feed was flickering." },
    { id: "convenience", name: "Convenience Store Clerk", statement: "A man in a heavy black jacket matching the security chief's height bought two energy drinks and paid with cash around midnight." },
    { id: "taxi", name: "Taxi Driver (Song Jin-woo)", statement: "I picked up a distressed man carrying a heavy duffel bag near the rear service exit of the Gangnam tower around 11:55 PM, heading towards Incheon Port." }
];

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    renderSuspects();
    renderWitnesses();
    initCrimeSceneHotspots();
    initPuzzles();
    initAccusationForm();
    initRulesModal();
});

function initNavigation() {
    const btnStart = document.getElementById("btn-start");
    const mainMenu = document.getElementById("main-menu");
    const dashboard = document.getElementById("dashboard");

    btnStart.addEventListener("click", () => {
        mainMenu.classList.remove("active");
        dashboard.classList.add("active");
    });

    const navLinks = document.querySelectorAll(".nav-link");
    const tabPanes = document.querySelectorAll(".tab-pane");

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            const tabId = link.getAttribute("data-tab");
            
            navLinks.forEach(l => l.classList.remove("active"));
            tabPanes.forEach(p => p.classList.remove("active"));

            link.classList.add("active");
            document.getElementById(`tab-${tabId}`).classList.add("active");
        });
    });
}

function initRulesModal() {
    const btnRules = document.getElementById("btn-rules");
    const modal = document.getElementById("rules-modal");
    const closeRules = document.querySelector(".close-rules");

    btnRules.addEventListener("click", () => { modal.style.display = "flex"; });
    closeRules.addEventListener("click", () => { modal.style.display = "none"; });
}

function initCrimeSceneHotspots() {
    const hotspots = document.querySelectorAll(".forensic-hotspot");
    const modal = document.getElementById("evidence-modal");
    const modalTitle = document.getElementById("modal-item-title");
    const modalBody = document.getElementById("modal-item-body");
    const closeModal = document.querySelector(".close-evidence-modal");

    hotspots.forEach(spot => {
        spot.addEventListener("click", () => {
            const key = spot.getAttribute("data-evidence");
            const item = EvidenceDatabase[key];

            if (item) {
                modalTitle.innerText = item.title;
                modalBody.innerHTML = `
                    <p style="font-size:1.1rem; line-height:1.6; margin-bottom:20px;">${item.desc}</p>
                    <button id="btn-collect-evidence" class="cyber-btn primary" style="width:100%;">SECURE ARTIFACT INTO REGISTRY</button>
                `;
                modal.style.display = "flex";

                document.getElementById("btn-collect-evidence").onclick = () => {
                    collectEvidenceItem(key, item);
                    modal.style.display = "none";
                };
            }
        });
    });

    closeModal.addEventListener("click", () => { modal.style.display = "none"; });
}

function collectEvidenceItem(key, item) {
    if (!GameState.evidenceCollected.includes(key)) {
        GameState.evidenceCollected.push(key);
        document.getElementById("evidence-count").innerText = `${GameState.evidenceCollected.length}/${GameState.totalEvidence}`;
        
        const grid = document.getElementById("evidence-registry-grid");
        if (GameState.evidenceCollected.length === 1) {
            grid.innerHTML = ""; // Clear placeholder
        }

        const card = document.createElement("div");
        card.className = "evidence-item-card";
        card.innerHTML = `<h4>📌 ${item.title}</h4><p style="font-size:0.9rem; color:var(--text-muted); margin-top:8px;">${item.desc}</p>`;
        grid.appendChild(card);

        alert(`SUCCESS: Artifact '${item.title}' secured into database.`);
    } else {
        alert("Notice: Artifact is already secured in registry.");
    }
}

function renderSuspects() {
    const container = document.getElementById("suspects-grid-container");
    container.innerHTML = "";

    SuspectsData.forEach(s => {
        const card = document.createElement("div");
        card.className = "suspect-card";
        card.innerHTML = `
            <img src="${s.img}" alt="${s.name}">
            <h3>${s.name}</h3>
            <p style="color:var(--accent-cyan); font-size:0.9rem;">${s.role} (Age: ${s.age})</p>
            <p style="margin: 8px 0;">Threat Rating: <strong style="color:var(--accent-red)">${s.suspicion}</strong></p>
            <p style="font-size:0.85rem; color:var(--text-muted);">${s.bio}</p>
        `;
        container.appendChild(card);
    });
}

function renderWitnesses() {
    const listContainer = document.getElementById("witness-list");
    const consoleContainer = document.getElementById("interrogation-console");
    listContainer.innerHTML = "";

    WitnessesData.forEach(w => {
        const btn = document.createElement("button");
        btn.className = "witness-btn";
        btn.innerText = w.name;
        btn.onclick = () => {
            document.querySelectorAll(".witness-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            consoleContainer.innerHTML = `
                <div>
                    <h4 style="color:var(--accent-cyan); margin-bottom:10px;">TRANSCRIPT // ${w.name.toUpperCase()}</h4>
                    <p style="font-size:1.1rem; line-height:1.6; color:#fff;">"${w.statement}"</p>
                </div>
                <div style="margin-top:20px; font-size:0.85rem; color:var(--text-muted);">[ RECORDED TO INVESTIGATION LOG ]</div>
            `;
        };
        listContainer.appendChild(btn);
    });
}

function initPuzzles() {
    const btn = document.getElementById("btn-verify-cipher");
    const input = document.getElementById("cipher-input-box");
    const feedback = document.getElementById("cipher-status-feedback");

    btn.addEventListener("click", () => {
        const val = input.value.trim().toUpperCase();
        if (val === "PROJECT-NEXUS-DRAIN" || val === "NEXUS") {
            feedback.innerHTML = `<span style="color:#00ffcc">✅ DECRYPTION SUCCESSFUL: Offshore account drain confirmed.</span>`;
            GameState.solvedCipher = true;
        } else {
            feedback.innerHTML = `<span style="color:var(--accent-red)">❌ DECRYPTION FAILED: Invalid cryptographic key.</span>`;
        }
    });
}

function initAccusationForm() {
    const form = document.getElementById("final-accusation-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const suspect = document.getElementById("accuse-suspect").value;
        const motive = document.getElementById("accuse-motive").value;
        const location = document.getElementById("accuse-location").value;

        // Correct Solution: Choi Dae-hyun + Embezzlement + Incheon Port
        if (suspect === "choi" && motive === "money" && location === "basement") {
            alert("⚖️ JUDICIAL VERDICT: PERFECT DEDUCTION!\n\nYou successfully identified Choi Dae-hyun as the mastermind who leveraged security administrative overrides to conceal the kidnapping and fund transfer at Incheon Port. Case Closed!");
        } else {
            alert("❌ VERDICT REJECTED BY TRIBUNAL:\n\nYour submitted deductions do not align with the forensic evidence or alibi analysis. Continue investigating.");
        }
    });
}

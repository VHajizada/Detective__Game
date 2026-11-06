// OYUNUN VƏZİYYƏTİ VƏ DATA STRUKTURU
const GameState = {
    score: 1000,
    evidenceCollected: [],
    totalEvidence: 8,
    solvedCipher: false
};

const EvidenceData = {
    phone: { title: "Sındırılmış Smartfon", desc: "Kang Min-jun-un masasında tapılıb. Şifrəli son mesaj: 'PROYEKTI DAYANDIR!'." },
    coffee: { title: "Qəhvə Fincanı", desc: "Üzərində iki fərqli barmaq izi tapıldı. Biri qurbana, digəri Naməlum X-ə aiddir." },
    laptop: { title: "Açıq Noutbuk", desc: "Maliyyə köçürmələri jurnalı açıq qalıb: Offshore hesaba 5,000,000$ ödəniş edilib." },
    clock: { title: "Qırılmış Divar Saatı", desc: "Saat dəqiq 23:47-də dayanıb. Şiddətli zərbə izi var." },
    camera: { title: "Təhlükəsizlik Kamerası", desc: "23:30 - 23:42 aralığında 12 dəqiqəlik kəsinti aşkar edilib." },
    window: { title: "Kilitli Pəncərə", desc: "Pəncərə daxildən kilitlidir, lakin şüşədə mikroskopik liflər tapıldı." },
    note: { title: "Əl Yazısı Qeyd", desc: "Qeyddə yazılıb: 'Liman - Anbar #4. Tək gəl.'" }
};

const SuspectsData = [
    { id: "kim", name: "Kim Seo-yeon", role: "Şəxsi Köməkçi", age: 29, suspicion: "YÜKSƏK", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80", bio: "Qurbanı son görən şəxs. Saat 22:30-da çıxdığını desə də, kamera kəsintisindən öncə dəhlizdə görünüb." },
    { id: "park", name: "Park Ji-hoon", role: "Biznes Şəriki", age: 34, suspicion: "ORTA", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80", bio: "Maliyyə münaqişəsi yaşayırdı. Qurbanın yoxa çıxması sayəsində bütün səhmlərə yiyələnir." },
    { id: "lee", name: "Lee Hye-jin", role: "Jurnalist", age: 27, suspicion: "AŞAĞI", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80", bio: "Company-nin korrupsiya faktlarını araşdırırdı. Hadisə gecəsi anomim zəng aldığını bildirir." },
    { id: "choi", name: "Choi Dae-hyun", role: "Təhlükəsizlik Rəisi", age: 41, suspicion: "YÜKSƏK", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80", bio: "Kamera sisteminə birbaşa çıxışı var idi. 12 dəqiqəlik kəsintini 'sistem xətası' adlandırır." }
];

// OYUNUN BAŞLADILMASI
document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    renderSuspects();
    initCrimeScene();
    initPuzzles();
    initAccusationForm();
});

// EKRANLAR ARASI KEÇİD MƏNTİQİ
function initNavigation() {
    const btnStart = document.getElementById("btn-start");
    const mainMenu = document.getElementById("main-menu");
    const dashboard = document.getElementById("dashboard");

    btnStart.addEventListener("click", () => {
        mainMenu.classList.remove("active");
        dashboard.classList.add("active");
    });

    const navBtns = document.querySelectorAll(".nav-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    navBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");
            
            navBtns.forEach(b => b.classList.remove("active"));
            tabContents.forEach(c => c.classList.remove("active"));

            btn.classList.add("active");
            document.getElementById(`tab-${targetTab}`).classList.add("active");
        });
    });
}

// HADİSƏ YERİ VƏ SÜBUTLARIN TOPLANMASI
function initCrimeScene() {
    const hotspots = document.querySelectorAll(".hotspot");
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const closeModal = document.querySelector(".close-modal");

    hotspots.forEach(spot => {
        spot.addEventListener("click", () => {
            const itemKey = spot.getAttribute("data-item");
            const item = EvidenceData[itemKey];

            if (item) {
                modalTitle.innerText = item.title;
                modalBody.innerHTML = `
                    <p>${item.desc}</p>
                    <br>
                    <button id="btn-collect" class="btn btn-primary">SÜBUTU İSTİNTAQ LÖVHƏSİNƏ ƏLAVƏ ET</button>
                `;
                modal.style.display = "flex";

                document.getElementById("btn-collect").onclick = () => {
                    collectEvidence(itemKey, item);
                    modal.style.display = "none";
                };
            }
        });
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });
}

function collectEvidence(key, item) {
    if (!GameState.evidenceCollected.includes(key)) {
        GameState.evidenceCollected.push(key);
        document.getElementById("evidence-count").innerText = `${GameState.evidenceCollected.length}/${GameState.totalEvidence}`;
        
        // Lövhəyə əlavə et
        const container = document.getElementById("evidence-container");
        const card = document.createElement("div");
        card.className = "card card-red";
        card.innerHTML = `<h4>📌 ${item.title}</h4><p>${item.desc}</p>`;
        container.appendChild(card);

        alert(`Sübut toplandı: ${item.title}`);
    } else {
        alert("Bu sübut artıq toplanıb.");
    }
}

// ŞÜBHƏLİLƏRİN YÜKLƏNMƏSİ
function renderSuspects() {
    const container = document.getElementById("suspects-container");
    container.innerHTML = "";

    SuspectsData.forEach(s => {
        const el = document.createElement("div");
        el.className = "suspect-card";
        el.innerHTML = `
            <img src="${s.img}" alt="${s.name}">
            <h3>${s.name}</h3>
            <p><strong>Vəzifə:</strong> ${s.role}</p>
            <p><strong>Şübhə Dərəcəsi:</strong> <span style="color:var(--accent-red)">${s.suspicion}</span></p>
            <br>
            <p style="font-size:0.9rem; color:var(--text-dim);">${s.bio}</p>
        `;
        container.appendChild(el);
    });
}

// PAZZL (DECODING)
function initPuzzles() {
    const btnCheck = document.getElementById("btn-check-cipher");
    const input = document.getElementById("cipher-input");
    const feedback = document.getElementById("cipher-feedback");

    btnCheck.addEventListener("click", () => {
        const val = input.value.trim().toUpperCase();
        if (val === "PROJECT-NEXUS-DRAIN" || val === "NEXUS") {
            feedback.innerHTML = `<span style="color:#00ff66">✅ ŞİFRƏ UĞURLA AÇILDI! Məfkurə: Şirkət vəəsaitləri köçürülüb.</span>`;
            GameState.solvedCipher = true;
        } else {
            feedback.innerHTML = `<span style="color:var(--accent-red)">❌ YANLIŞ KOD! Yenidən cəhd edin.</span>`;
        }
    });
}

// YEKUN İTTİHAM VƏ SONLUQLAR
function initAccusationForm() {
    const form = document.getElementById("accusation-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const suspect = document.getElementById("accuse-suspect").value;
        const motive = document.getElementById("accuse-motive").value;
        const location = document.getElementById("accuse-location").value;

        // DÜZGÜN HƏLL: Təhlükəsizlik Rəisi Choi + Maliyyə mənimsəməsi + Incheon Limanı Anbarı
        if (suspect === "choi" && motive === "money" && location === "basement") {
            alert("🎯 MƏKƏMƏ HƏKMİ: MÜKƏMMƏL DEDOKSİYA!\n\nSiz cinayəti tam şəffaflığı ilə həll etdiniz! Choi Dae-hyun kamera kəsintisindən istifadə edərək Kang Min-jun-u qaçırmışdı.");
        } else {
            alert("❌ İTTİHAM RƏDD EDİLDİ!\n\nTəqdim olunan sübutlar və ya şübhəli faktları üst-üstə düşmür. İstintaqı davam etdirin!");
        }
    });
}

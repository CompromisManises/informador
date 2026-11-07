/* =========================================================
   Informador de Manises — front-end del xat
   Endpoint del Worker de Cloudflare (configura-ho quan el desplegues):
   ========================================================= */
const ENDPOINT = "https://compromis-manises.francesc-j-hernandez.workers.dev";

/* ---------- Idiomes (valencià, castellà, anglès, francès, alemany, xinès, àrab) ---------- */
const IDIOMES = {
  ca: { nom: "Valencià",    lema: "Pregunta'ns el que vulguis sobre Manises",
        placeholder: "Escriu la teua pregunta…", escrivint: "L'Informador està escrivint…",
        escoltant: "T'escolte… parla ara", microNo: "El micròfon no és compatible amb aquest navegador",
        errorXarxa: "No s'ha pogut contactar amb l'agent. Torna-ho a intentar.",
        errorEndpoint: "L'endpoint encara no està configurat (app.js, constant ENDPOINT).",
        instalText: "Instal·lar app", veuOn: "Veu activada", veuOff: "Veu desactivada",
        avisPre: "Vols fer-nos arribar una pregunta o suggeriment?", avisEnllac: "Escriu-nos" },
  es: { nom: "Español",     lema: "Pregúntanos lo que quieras sobre Manises",
        placeholder: "Escribe tu pregunta…", escrivint: "El Informador está escribiendo…",
        escoltant: "Te escucho… habla ahora", microNo: "El micrófono no es compatible con este navegador",
        errorXarxa: "No se pudo contactar con el agente. Inténtalo de nuevo.",
        errorEndpoint: "El endpoint aún no está configurado (app.js, constante ENDPOINT).",
        instalText: "Instalar app", veuOn: "Voz activada", veuOff: "Voz desactivada",
        avisPre: "¿Quieres hacernos llegar una pregunta o sugerencia?", avisEnllac: "Escríbenos" },
  en: { nom: "English",     lema: "Ask us anything about Manises",
        placeholder: "Type your question…", escrivint: "The Informador is typing…",
        escoltant: "Listening… speak now", microNo: "The microphone is not supported by this browser",
        errorXarxa: "Could not reach the agent. Please try again.",
        errorEndpoint: "The endpoint is not configured yet (app.js, ENDPOINT constant).",
        instalText: "Install app", veuOn: "Voice on", veuOff: "Voice off",
        avisPre: "Want to send us a question or suggestion?", avisEnllac: "Write to us" },
  fr: { nom: "Français",    lema: "Posez-nous vos questions sur Manises",
        placeholder: "Écrivez votre question…", escrivint: "L'Informador écrit…",
        escoltant: "Je vous écoute… parlez", microNo: "Le microphone n'est pas pris en charge par ce navigateur",
        errorXarxa: "Impossible de joindre l'agent. Réessayez.",
        errorEndpoint: "L'endpoint n'est pas encore configuré (app.js, constante ENDPOINT).",
        instalText: "Installer l'app", veuOn: "Voix activée", veuOff: "Voix désactivée",
        avisPre: "Vous voulez nous envoyer une question ou une suggestion ?", avisEnllac: "Écrivez-nous" },
  de: { nom: "Deutsch",     lema: "Frag uns alles über Manises",
        placeholder: "Frage eingeben…", escrivint: "Der Informador schreibt…",
        escoltant: "Ich höre zu… sprechen Sie", microNo: "Das Mikrofon wird von diesem Browser nicht unterstützt",
        errorXarxa: "Agent nicht erreichbar. Bitte erneut versuchen.",
        errorEndpoint: "Der Endpoint ist noch nicht konfiguriert (app.js, ENDPOINT-Konstante).",
        instalText: "App installieren", veuOn: "Stimme an", veuOff: "Stimme aus",
        avisPre: "Möchten Sie uns eine Frage oder Anregung senden?", avisEnllac: "Schreiben Sie uns" },
  zh: { nom: "中文",        lema: "向我们询问关于 Manises 的一切",
        placeholder: "输入您的问题…", escrivint: "Informador 正在输入…",
        escoltant: "正在聆听…请讲", microNo: "此浏览器不支持麦克风",
        errorXarxa: "无法连接到智能助手，请重试。",
        errorEndpoint: "端点尚未配置（app.js 中的 ENDPOINT 常量）。",
        instalText: "安装应用", veuOn: "语音已开启", veuOff: "语音已关闭",
        avisPre: "想向我们提问或提出建议吗？", avisEnllac: "写信给我们" },
  ar: { nom: "العربية",     lema: "اسألنا أي شيء عن مانيسس",
        placeholder: "اكتب سؤالك…", escrivint: "المعلم يكتب الآن…",
        escoltant: "أستمع إليك… تكلم الآن", microNo: "الميكروفون غير مدعوم في هذا المتصفح",
        errorXarxa: "تعذر الاتصال بالمساعد. حاول مرة أخرى.",
        errorEndpoint: "لم يتم تهيئة نقطة النهاية بعد (app.js، ثابت ENDPOINT).",
        instalText: "تثبيت التطبيق", veuOn: "الصوت مفعّل", veuOff: "الصوت متوقف",
        avisPre: "هل تريد إرسال سؤال أو اقتراح إلينا؟", avisEnllac: "راسلنا" },
};

const CODES = Object.keys(IDIOMES);
let idioma = localStorage.getItem("idioma") || "ca";
if (!CODES.includes(idioma)) idioma = "ca";
const t = () => IDIOMES[idioma];

/* ---------- Referències DOM ---------- */
const $ = (id) => document.getElementById(id);
const xat = $("xat"), entrada = $("entrada"), estat = $("estat"),
      formulari = $("formulari"), micro = $("micro"), botoVeu = $("veu"),
      seleccio = $("idioma"), lema = $("lema"),
      instalar = $("instalar"), instalarText = $("instalar-text");

/* ---------- Mida de lletra ---------- */
const MIDA_PAS = 12.5;              // percentatge per pas
const MIDA_MIN = 75, MIDA_MAX = 175;
let mida = parseFloat(localStorage.getItem("midaLletra")) || 100;

function aplicaMida() {
  document.documentElement.style.setProperty("--mida-base", mida + "%");
  localStorage.setItem("midaLletra", mida);
}
$("lletra-menys").addEventListener("click", () => { mida = Math.max(MIDA_MIN, mida - MIDA_PAS); aplicaMida(); });
$("lletra-mes").addEventListener("click", () => { mida = Math.min(MIDA_MAX, mida + MIDA_PAS); aplicaMida(); });
$("lletra-reset").addEventListener("click", () => { mida = 100; aplicaMida(); });
aplicaMida();

/* ---------- Selector d'idioma ---------- */
CODES.forEach((c) => {
  const op = document.createElement("option");
  op.value = c; op.textContent = IDIOMES[c].nom;
  seleccio.appendChild(op);
});
seleccio.value = idioma;

function aplicaIdioma() {
  const d = t();
  document.documentElement.lang = idioma;
  document.documentElement.dir = (idioma === "ar") ? "rtl" : "ltr";
  document.title = "Informador de Manises · APM-Compromís";
  lema.textContent = d.lema;
  entrada.placeholder = d.placeholder;
  entrada.setAttribute("aria-label", d.placeholder);
  instalarText.textContent = d.instalText;
  $("avis-pre").textContent = d.avisPre;
  $("avis-enllac").textContent = d.avisEnllac;
  localStorage.setItem("idioma", idioma);
}
seleccio.addEventListener("change", () => { idioma = seleccio.value; aplicaIdioma(); });
aplicaIdioma();

/* ---------- Sessió (identificador d'aquest navegador) ---------- */
let sessio = localStorage.getItem("sessio");
if (!sessio) {
  sessio = (crypto.randomUUID) ? crypto.randomUUID()
          : "s-" + Date.now() + "-" + Math.random().toString(36).slice(2);
  localStorage.setItem("sessio", sessio);
}

/* ---------- Bafarades ---------- */
function afegeixMissatge(text, qui, pensant = false) {
  const div = document.createElement("div");
  div.className = "missatge " + qui + (pensant ? " pensant" : "");
  div.textContent = text;
  xat.appendChild(div);
  xat.scrollTop = xat.scrollHeight;
  return div;
}

/* ---------- Veu de sortida (lectura de respostes) ---------- */
let veuActivada = localStorage.getItem("veu") !== "off";

function actualitzaBotoVeu() {
  botoVeu.textContent = veuActivada ? "🔊" : "🔇";
  botoVeu.classList.toggle("actiu", veuActivada);
  botoVeu.title = veuActivada ? t().veuOn : t().veuOff;
}
botoVeu.addEventListener("click", () => {
  veuActivada = !veuActivada;
  localStorage.setItem("veu", veuActivada ? "on" : "off");
  if (!veuActivada) speechSynthesis.cancel();
  actualitzaBotoVeu();
});
actualitzaBotoVeu();

function parla(text) {
  if (!veuActivada || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = idioma;
  const veus = speechSynthesis.getVoices().filter(v => v.lang.startsWith(idioma));
  if (veus.length) u.voice = veus[0];
  speechSynthesis.speak(u);
}

/* ---------- Veu d'entrada (dictat) ---------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let reconeixement = null, escoltant = false;

if (SR) {
  reconeixement = new SR();
  reconeixement.interimResults = false;
  reconeixement.maxAlternatives = 1;
  reconeixement.addEventListener("result", (e) => {
    entrada.value = e.results[0][0].transcript;
  });
  reconeixement.addEventListener("end", () => {
    escoltant = false;
    micro.classList.remove("actiu");
    estat.textContent = "";
    formulari.requestSubmit();
  });
  reconeixement.addEventListener("error", () => {
    escoltant = false;
    micro.classList.remove("actiu");
    estat.textContent = "";
  });
} else {
  micro.disabled = true;
  micro.title = "";
}

micro.addEventListener("click", () => {
  if (!reconeixement) { estat.textContent = t().microNo; return; }
  if (escoltant) { reconeixement.stop(); return; }
  speechSynthesis.cancel();
  reconeixement.lang = idioma;
  try {
    reconeixement.start();
    escoltant = true;
    micro.classList.add("actiu");
    estat.textContent = t().escoltant;
  } catch { /* start() ja actiu */ }
});

/* ---------- Enviament de la pregunta ---------- */
formulari.addEventListener("submit", async (e) => {
  e.preventDefault();
  const pregunta = entrada.value.trim();
  if (!pregunta) return;
  entrada.value = "";
  entrada.focus();
  afegeixMissatge(pregunta, "usuari");
  const bafarada = afegeixMissatge("", "agent", true);
  estat.textContent = t().escrivint;

  if (!ENDPOINT || ENDPOINT.includes("TU-USUARI")) {
    bafarada.classList.remove("pensant");
    bafarada.textContent = t().errorEndpoint;
    estat.textContent = "";
    return;
  }

  try {
    const r = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessio, pregunta, idioma }),
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const data = await r.json();
    bafarada.classList.remove("pensant");
    bafarada.textContent = data.resposta ?? JSON.stringify(data);
    parla(bafarada.textContent);
  } catch {
    bafarada.classList.remove("pensant");
    bafarada.textContent = t().errorXarxa;
  }
  estat.textContent = "";
  xat.scrollTop = xat.scrollHeight;
});

/* ---------- Instal·lació de la PWA ---------- */
let promptInstalacio = null;
instalar.hidden = true;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  promptInstalacio = e;
  instalar.hidden = false;
});

instalar.addEventListener("click", async () => {
  if (!promptInstalacio) return;
  promptInstalacio.prompt();
  await promptInstalacio.userChoice;
  promptInstalacio = null;
  instalar.hidden = true;
});

window.addEventListener("appinstalled", () => { instalar.hidden = true; });

/* ---------- Service worker (necessari per a la instal·lació) ---------- */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

/* ---------- Carrega les veus disponibles (alguns navegadors les carreguen async) ---------- */
if ("speechSynthesis" in window) {
  speechSynthesis.getVoices();
  speechSynthesis.addEventListener("voiceschanged", () => speechSynthesis.getVoices());
}

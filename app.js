// IA de Bolso — o mínimo necessário para rodar um LLM no navegador.
// Sem framework e sem build: o navegador importa o WebLLM como ES module.
import {
  CreateMLCEngine,
  hasModelInCache,
  deleteModelAllInfoInCache,
} from "https://esm.run/@mlc-ai/web-llm@0.2.84";

// Mesmos parâmetros do projeto completo (IAí?), para que a comparação seja justa.
const MODEL_ID = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";
const SYSTEM_PROMPT =
  "Você é um assistente didático. Responda de forma clara, breve e honesta em português do Brasil.";
const TEMPERATURE = 0.7;
const MAX_TOKENS = 320;

const el = {
  dot: document.getElementById("dot"),
  status: document.getElementById("status"),
  progress: document.getElementById("progress"),
  progressBar: document.getElementById("progress-bar"),
  load: document.getElementById("load"),
  remove: document.getElementById("remove"),
  log: document.getElementById("log"),
  empty: document.getElementById("empty"),
  composer: document.getElementById("composer"),
  input: document.getElementById("input"),
  send: document.getElementById("send"),
};

let engine = null;
let generating = false;
// Histórico apenas em memória: recarregar a página zera a conversa.
const history = [];

function setState(state, message) {
  el.dot.dataset.state = state;
  el.status.textContent = message;

  const ready = state === "ready";
  const busy = state === "downloading";

  el.load.hidden = ready;
  el.load.disabled = busy || state === "unsupported" || state === "checking";
  el.load.textContent = busy ? "Carregando…" : "Carregar modelo";
  el.remove.hidden = !ready;
  el.input.disabled = !ready;
  el.send.disabled = !ready;
  el.input.placeholder = ready
    ? "Pergunte alguma coisa…"
    : "Carregue o modelo para conversar…";

  // O estado vazio precisa acompanhar o modelo: manter "carregue o modelo"
  // depois de ele estar pronto seria uma instrução contraditória.
  if (el.empty?.isConnected) {
    el.empty.textContent = ready
      ? "Modelo pronto e rodando na sua GPU. Faça a primeira pergunta."
      : "Carregue o modelo para começar. O download acontece uma única vez e fica no cache deste navegador.";
  }
}

function setProgress(fraction) {
  const percent = Math.round(fraction * 100);
  el.progress.hidden = false;
  el.progressBar.style.width = `${percent}%`;
}

// O modelo responde usando **negrito** de markdown. Em vez de um parser (ou de
// innerHTML, que abriria espaço para injeção), alterna nós de texto e <strong>.
function renderText(node, text) {
  node.textContent = "";
  text.split("**").forEach((part, index) => {
    if (!part) return;
    if (index % 2 === 1) {
      const strong = document.createElement("strong");
      strong.textContent = part;
      node.append(strong);
    } else {
      node.append(document.createTextNode(part));
    }
  });
}

function addBubble(role, text = "") {
  el.empty?.remove();
  const bubble = document.createElement("article");
  bubble.className = `bubble ${role}`;
  renderText(bubble, text);
  el.log.append(bubble);
  el.log.scrollTop = el.log.scrollHeight;
  return bubble;
}

// 1. O navegador suporta WebGPU? Sem isso, nada acontece.
async function check() {
  if (!("gpu" in navigator)) {
    setState(
      "unsupported",
      "Este navegador não expõe WebGPU. Use Chrome ou Edge recentes em desktop.",
    );
    return;
  }

  try {
    const cached = await hasModelInCache(MODEL_ID);
    setState(
      "idle",
      cached
        ? "Modelo já está no cache deste navegador. Carregar é rápido."
        : "Primeiro uso baixa alguns megabytes de pesos. Depois fica no cache.",
    );
  } catch {
    setState("idle", "Não foi possível checar o cache. Você ainda pode tentar.");
  }
}

// 2. Baixar os pesos e montar o modelo na GPU.
async function load() {
  setState("downloading", "Preparando…");
  try {
    engine = await CreateMLCEngine(MODEL_ID, {
      initProgressCallback: ({ progress, text }) => {
        setProgress(progress);
        el.status.textContent = text || "Preparando o modelo…";
      },
    });
    setProgress(1);
    setState("ready", "Pronto. O modelo está na sua GPU.");
    el.input.focus();
  } catch (error) {
    el.progress.hidden = true;
    setState(
      "error",
      error instanceof Error ? error.message : "Falha ao carregar o modelo.",
    );
  }
}

// 3. Devolver o espaço em disco quando o usuário quiser.
async function remove() {
  if (!window.confirm("Remover o modelo deste navegador?")) return;
  await engine?.unload();
  engine = null;
  await deleteModelAllInfoInCache(MODEL_ID);
  el.progress.hidden = true;
  el.progressBar.style.width = "0%";
  setState("idle", "Modelo removido. Baixe novamente quando quiser.");
}

// 4. Conversar, com a resposta aparecendo token a token.
async function send(event) {
  event.preventDefault();
  const content = el.input.value.trim();
  if (!content || generating || !engine) return;

  generating = true;
  el.send.disabled = true;
  el.input.value = "";
  addBubble("user", content);
  history.push({ role: "user", content });

  const bubble = addBubble("assistant");
  bubble.dataset.pending = "true";

  try {
    const stream = await engine.chat.completions.create({
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
      stream: true,
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
    });

    let answer = "";
    for await (const chunk of stream) {
      answer += chunk.choices[0]?.delta?.content ?? "";
      renderText(bubble, answer);
      el.log.scrollTop = el.log.scrollHeight;
    }

    history.push({ role: "assistant", content: answer });
  } catch (error) {
    bubble.classList.add("failed");
    bubble.textContent =
      error instanceof Error
        ? `Falhou: ${error.message}`
        : "Falhou ao gerar a resposta.";
  } finally {
    delete bubble.dataset.pending;
    generating = false;
    el.send.disabled = !engine;
    el.input.focus();
  }
}

el.load.addEventListener("click", load);
el.remove.addEventListener("click", remove);
el.composer.addEventListener("submit", send);
el.input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    el.composer.requestSubmit();
  }
});

check();

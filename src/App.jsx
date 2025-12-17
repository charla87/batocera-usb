import { useEffect, useMemo, useState } from "react";
import "./styles.css";

/**
 * Batocera USB Guide — React single file
 * - Tono gamberro pero claro
 * - UX tipo “landing pro” + tabs
 * - Incluye copy-to-clipboard, checklist, y troubleshooting
 */

function useKonamiPartyMode() {
  useEffect(() => {
    const seq = [
      "ArrowUp", "ArrowUp",
      "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight",
      "ArrowLeft", "ArrowRight",
      "b", "a",
    ];
    let i = 0;

    const onKeyDown = (e) => {
      const key = e.key?.toLowerCase?.() ?? "";
      const target = seq[i].toLowerCase();
      if (key === target) {
        i += 1;
        if (i === seq.length) {
          i = 0;
          document.documentElement.classList.toggle("party");
        }
      } else {
        i = 0;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}

function FXCanvas() {
  // Partículas + glow suave. No pesado.
  useEffect(() => {
    const c = document.getElementById("fx");
    if (!c) return;
    const ctx = c.getContext("2d");

    let w = 0, h = 0, raf = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = Math.floor(w * DPR);
      c.height = Math.floor(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const dots = Array.from({ length: 110 }, () => ({
      x: Math.random() * 1000,
      y: Math.random() * 1000,
      r: 0.9 + Math.random() * 2.2,
      v: 0.12 + Math.random() * 0.55,
      a: 0.12 + Math.random() * 0.65,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // “nebula glow”
      const g = ctx.createRadialGradient(w * 0.58, h * 0.28, 40, w * 0.58, h * 0.28, Math.max(w, h));
      g.addColorStop(0, "rgba(0,255,179,0.10)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (const d of dots) {
        d.y += d.v;
        if (d.y > 1000) d.y = -10;

        const x = (d.x / 1000) * w;
        const y = (d.y / 1000) * h;

        ctx.beginPath();
        ctx.fillStyle = `rgba(148,255,215,${d.a})`;
        ctx.arc(x, y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      id="fx"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.85,
      }}
    />
  );
}

function CopyBlock({ title, value }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 900);
    } catch {
      // Si no hay permisos, no pasa nada: el usuario puede copiar manual.
      setCopied(false);
    }
  };

  return (
    <div className="codeCard">
      <div className="codeHead">
        <div className="codeTitle">{title}</div>
        <button className="btn ghost" onClick={copy}>
          {copied ? "Copiado ✅" : "Copiar"}
        </button>
      </div>
      <pre><code>{value}</code></pre>
    </div>
  );
}

function Step({ n, title, children }) {
  return (
    <div className="step">
      <div className="badge">{n}</div>
      <div className="stepBody">
        <div className="stepTitle">{title}</div>
        <div className="stepText">{children}</div>
      </div>
    </div>
  );
}

function PillRow({ items }) {
  return (
    <div className="chips">
      {items.map((t) => (
        <span className="chip" key={t}>{t}</span>
      ))}
    </div>
  );
}

function MiniCard({ title, children }) {
  return (
    <div className="sideCard">
      <div className="sideTitle">{title}</div>
      {children}
    </div>
  );
}

function KeyRow() {
  return (
    <div className="keys" aria-label="Teclas de arranque">
      <span className="key">F12</span>
      <span className="key">F10</span>
      <span className="key">ESC</span>
      <span className="key">DEL</span>
    </div>
  );
}

function Checklist({ items }) {
  return (
    <ul className="list" style={{ marginTop: 8 }}>
      {items.map((it) => (
        <li key={it}><span className="muted">{it}</span></li>
      ))}
    </ul>
  );
}

export default function App() {
  useKonamiPartyMode();

  const tabs = useMemo(() => ([
    { id: "start", label: "🚀 Arranque", sub: "del 0 al WOW" },
    { id: "games", label: "🧩 Juegos", sub: "sin líos" },
    { id: "controllers", label: "🎮 Mandos", sub: "domar la bestia" },
    { id: "rescue", label: "🆘 Rescate", sub: "si el PC se pone digno" },
  ]), []);

  const [tab, setTab] = useState("start");

  return (
    <div className="crt">
      <FXCanvas />
      <div className="scanlines" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      {/* HERO */}
      <header className="hero">
        <div className="heroTop">
          <div className="logo">
            <span className="logoMark">B</span>
            <div>
              <div className="logoName">BATOCERA USB</div>
              <div className="logoTag">consola retro portátil (modo gamberro)</div>
            </div>
          </div>

          <PillRow
            items={[
              "No instala nada",
              "No borra nada",
              "Si quitas el USB, el PC queda igual",
              "Nivel: fácil (de verdad)",
            ]}
          />
        </div>

        <h1 className="title">
          Bienvenido al <span className="glitch" data-text="caos retro">caos retro</span> 😈
        </h1>

        <p className="subtitle">
          Este USB convierte un ordenador en una consola retro en cuestión de segundos.
          Tu objetivo hoy: <b>arrancar desde USB</b>. El ordenador no sufre.
          Tú… como mucho sudas un poco mientras pulsas F12 como si estuvieras en una final.
        </p>

        <div className="nav" role="tablist" aria-label="Secciones">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`btn ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
              role="tab"
              aria-selected={tab === t.id}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* CONTENT */}
      <main className="grid">
        {/* LEFT */}
        {tab === "start" && (
          <section className="card" role="tabpanel">
            <div className="cardTitle">🚀 Arranque: el ritual (corto y sin magia negra)</div>

            <Step n="1" title="Conecta el USB (sin miedo)">
              <ul className="list">
                <li>Apaga el ordenador.</li>
                <li>Conecta este USB.</li>
                <li>Enciende.</li>
              </ul>
              <div className="callout">
                <div className="calloutTitle">Traducción humana</div>
                <p className="muted">
                  No estás “instalando” nada. Solo estás diciendo: “oye PC, hoy arrancas desde el USB”.
                </p>
              </div>
            </Step>

            <Step n="2" title="Saca el menú de arranque (modo gamer)">
              <p className="muted">
                Nada más encender, pulsa varias veces una de estas teclas:
              </p>
              <KeyRow />
              <p className="muted">
                Aparecerá un menú. Elige algo que ponga <b>USB</b> o <b>UEFI USB</b>.
                Si no sale, apaga y prueba otra tecla. (Sí: funciona así de cutre y así de real.)
              </p>
            </Step>

            <Step n="3" title="Entra Batocera (y la nostalgia te abraza)">
              <p className="muted">
                Si lo has hecho bien verás el menú de sistemas/consolas.
                Respira: ya está. Lo difícil era el minuto 1.
              </p>
              <div className="callout">
                <div className="calloutTitle">Atajo mental (guárdalo)</div>
                <p className="muted"><b>Encender → F12 (o F10/ESC/DEL) → USB → a jugar</b></p>
              </div>
            </Step>

            <div className="callout">
              <div className="calloutTitle">🛑 Para salir sin liarla</div>
              <p className="muted">
                Menú → <b>Quit</b> → Apagar. Quitas el USB. El PC vuelve a su vida normal.
              </p>
            </div>
          </section>
        )}

        {tab === "games" && (
          <section className="card" role="tabpanel">
            <div className="cardTitle">🧩 Juegos: el “pero” legal (y cómo solucionarlo fácil)</div>

            <p className="muted">
              Este USB <b>no incluye juegos</b>. No es por rácanos: es por legalidad.
              La buena noticia: <b>meter juegos es sencillo</b>.
            </p>

            <div className="callout">
              <div className="calloutTitle">✅ Opción recomendada</div>
              <p className="muted">
                Copiar juegos por red local desde otro PC. Es lo más cómodo, y no requiere apps raras.
              </p>
            </div>

            <Step n="1" title="Conecta Batocera a internet">
              <ul className="list">
                <li>Arranca Batocera desde el USB.</li>
                <li>Conéctalo por cable o Wi-Fi.</li>
              </ul>
              <p className="muted">
                En cuanto tenga red, Batocera expone una carpeta compartida para copiar tus ROMs.
              </p>
            </Step>

            <Step n="2" title="Desde Windows: abre la carpeta BATOCERA">
              <p className="muted">
                En un PC de Windows, abre el Explorador y pega esto:
              </p>
              <CopyBlock title="Ruta de red (Windows)" value={`\\\\BATOCERA`} />
              <p className="muted">
                Dentro verás una carpeta llamada <b>roms</b>. Ahí va la fiesta.
              </p>
            </Step>

            <Step n="3" title="Copia cada juego en su sistema">
              <p className="muted">
                Ejemplos rápidos:
              </p>
              <ul className="list">
                <li><code>.nes</code> → carpeta <b>nes</b></li>
                <li><code>.sfc</code>/<code>.smc</code> → carpeta <b>snes</b></li>
                <li><code>.gba</code> → carpeta <b>gba</b></li>
                <li><code>.iso</code>/<code>.bin</code> → carpeta <b>psx</b></li>
              </ul>

              <div className="callout">
                <div className="calloutTitle">🧠 Truco que evita dudas</div>
                <p className="muted">
                  Si no sabes dónde va algo, mira el nombre de la carpeta: suele ser el sistema tal cual.
                  Copias, vuelves al menú, y aparece.
                </p>
              </div>
            </Step>

            <div className="callout">
              <div className="calloutTitle">⚠️ Nota legal (en modo humano)</div>
              <p className="muted">
                Usa copias legales: homebrew, tus dumps, juegos libres, etc.
                El USB es la consola; los juegos los pones tú.
              </p>
            </div>
          </section>
        )}

        {tab === "controllers" && (
          <section className="card" role="tabpanel">
            <div className="cardTitle">🎮 Mandos: cuando el mando decide tener personalidad</div>

            <p className="muted">
              Puedes usar <b>mando USB</b> o <b>teclado</b>. La primera vez, Batocera suele pedir mapear botones.
              No es una prueba de inteligencia: es un trámite.
            </p>

            <Step n="1" title="Configurar mando (rápido y sin llorar)">
              <ul className="list">
                <li>Mantén pulsado un botón para empezar.</li>
                <li>Asigna direcciones y botones cuando te lo pida.</li>
                <li>Si te equivocas, se repite. Nadie muere.</li>
              </ul>
            </Step>

            <Step n="2" title="Si el mando hace cosas raras… el ritual USB">
              <ul className="list">
                <li>Desconecta el mando.</li>
                <li>Vuelve a conectarlo (preferible en otro puerto).</li>
                <li>Reinicia Batocera si hace falta.</li>
              </ul>
              <div className="callout">
                <div className="calloutTitle">💡 Consejo con experiencia</div>
                <p className="muted">
                  Evita hubs raros. Puerto USB directo al PC = menos drama.
                </p>
              </div>
            </Step>

            <Step n="3" title="Teclado: atajo de supervivencia">
              <p className="muted">
                Si te falta mando, con teclado puedes navegar y salir. No es tan bonito, pero funciona.
              </p>
            </Step>
          </section>
        )}

        {tab === "rescue" && (
          <section className="card" role="tabpanel">
            <div className="cardTitle">🆘 Rescate: si el PC se pone digno</div>

            <div className="callout">
              <div className="calloutTitle">Caso A: no sale el menú de arranque</div>
              <p className="muted">Prueba otra tecla. Sí, es absurdo, pero es así.</p>
              <KeyRow />
            </div>

            <div className="callout">
              <div className="calloutTitle">Caso B: el USB no aparece en el menú</div>
              <Checklist
                items={[
                  "Cambia de puerto USB (mejor uno trasero / directo al PC).",
                  "Apaga y enciende (reiniciar a veces no basta).",
                  "Prueba otro PC para descartar el puerto.",
                ]}
              />
            </div>

            <div className="callout">
              <div className="calloutTitle">Caso C: “Secure Boot” (el guardián del castillo)</div>
              <p className="muted">
                Algunos PCs modernos bloquean arranque externo. Solución típica: entrar en BIOS/UEFI y desactivar <b>Secure Boot</b>.
                Si esto te suena a conjuro: pide ayuda 2 minutos a alguien que sepa. Se hace una vez.
              </p>
            </div>

            <div className="callout">
              <div className="calloutTitle">Caso D: pantalla negra / tarda</div>
              <p className="muted">
                A veces tarda un poco. Si pasan 30–60s sin señales, reinicia y prueba otro puerto.
              </p>
            </div>

            <div className="callout">
              <div className="calloutTitle">Salir y volver a la vida real</div>
              <p className="muted">
                Menú → <b>Quit</b> → Apagar. Quita el USB. Respira. Todo normal.
              </p>
            </div>

            <div className="footerNote">
              <span className="muted">Easter egg:</span> Konami Code en el teclado para modo fiesta 😉
            </div>
          </section>
        )}

        {/* RIGHT */}
        <section className="side">
          <MiniCard title="🎁 Qué es esto (en una frase)">
            <p className="muted" style={{ margin: 0 }}>
              Un USB que convierte un PC en consola retro. Sin instalar, sin borrar, sin dramas.
            </p>
          </MiniCard>

          <MiniCard title="⚡ Atajo definitivo">
            <p className="muted" style={{ marginTop: 6 }}>
              <b>Encender → F12 → USB → jugar</b>
            </p>
            <p className="muted" style={{ marginTop: 6, opacity: 0.85 }}>
              (Si no es F12: F10 / ESC / DEL. Sí. Bienvenido al mundo PC.)
            </p>
          </MiniCard>

          <MiniCard title="🧠 Mini checklist (para no atascarse)">
            <Checklist
              items={[
                "Conecta USB con el PC apagado.",
                "Pulsa F12 en cuanto enciendas.",
                "Elige USB / UEFI USB.",
                "Para juegos: \\\\BATOCERA → roms.",
              ]}
            />
          </MiniCard>

          <MiniCard title="🧨 Modo gamberro">
            <p className="muted" style={{ margin: 0 }}>
              Si algo falla: apaga, respira, repite. Funciona en PCs y en la vida.
            </p>
          </MiniCard>
        </section>
      </main>
    </div>
  );
}

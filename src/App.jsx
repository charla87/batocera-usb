import { useEffect, useMemo, useState } from "react";
import "./styles.css";

function useKonamiEasterEgg() {
  useEffect(() => {
    const seq = [
      "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
      "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
      "b","a"
    ];
    let idx = 0;
    const onKey = (e) => {
      const k = e.key;
      if (k.toLowerCase() === seq[idx].toLowerCase()) idx++;
      else idx = 0;
      if (idx === seq.length) {
        idx = 0;
        document.documentElement.classList.toggle("party");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

function FX() {
  // Partículas en canvas (barato y resultón)
  useEffect(() => {
    const c = document.getElementById("fx");
    const ctx = c.getContext("2d");
    let w, h, raf;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = c.clientWidth; h = c.clientHeight;
      c.width = Math.floor(w * DPR);
      c.height = Math.floor(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const dots = Array.from({ length: 90 }, () => ({
      x: Math.random() * 1000,
      y: Math.random() * 1000,
      r: 1 + Math.random() * 2.3,
      v: 0.15 + Math.random() * 0.55,
      a: 0.2 + Math.random() * 0.65
    }));

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      // sutil “nebula” glow
      const g = ctx.createRadialGradient(w * 0.55, h * 0.35, 50, w * 0.55, h * 0.35, Math.max(w, h));
      g.addColorStop(0, "rgba(0,255,179,0.08)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0,0,w,h);

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
      raf = requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas id="fx" aria-hidden="true" />;
}

function CopyBlock({ title, children }) {
  const [copied, setCopied] = useState(false);
  const text = useMemo(() => (typeof children === "string" ? children : ""), [children]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 900);
    } catch { /* noop */ }
  };

  return (
    <div className="codeCard">
      <div className="codeHead">
        <div className="codeTitle">{title}</div>
        <button className="btn ghost" onClick={copy}>
          {copied ? "Copiado ✅" : "Copiar"}
        </button>
      </div>
      <pre><code>{children}</code></pre>
    </div>
  );
}

function Step({ n, title, kids }) {
  return (
    <div className="step">
      <div className="badge">{n}</div>
      <div className="stepBody">
        <div className="stepTitle">{title}</div>
        <div className="stepText">{kids}</div>
      </div>
    </div>
  );
}

export default function App() {
  useKonamiEasterEgg();

  const [tab, setTab] = useState("arrancar");

  return (
    <div className="crt">
      <FX />

      <div className="scanlines" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <header className="hero">
        <div className="heroTop">
          <div className="logo">
            <span className="logoMark">B</span>
            <div>
              <div className="logoName">BATOCERA USB</div>
              <div className="logoTag">modo consola retro portátil</div>
            </div>
          </div>
          <div className="chips">
            <span className="chip">No instala nada</span>
            <span className="chip">No borra nada</span>
            <span className="chip">Si quitas el USB, todo normal</span>
          </div>
        </div>

        <h1 className="title">
          Bienvenido al <span className="glitch" data-text="caos retro">caos retro</span> 😈
        </h1>
        <p className="subtitle">
          Este USB convierte un PC en una consola. Tu misión: arrancar desde el USB y disfrutar.
          Tu PC: <b>no sufre</b>. Tú: probablemente <b>sí</b> (pero solo 30 segundos).
        </p>

        <div className="nav">
          <button className={`btn ${tab==="arrancar"?"active":""}`} onClick={()=>setTab("arrancar")}>🚀 Arrancar</button>
          <button className={`btn ${tab==="mandos"?"active":""}`} onClick={()=>setTab("mandos")}>🎮 Mandos</button>
          <button className={`btn ${tab==="juegos"?"active":""}`} onClick={()=>setTab("juegos")}>🧩 Juegos</button>
          <button className={`btn ${tab==="rescate"?"active":""}`} onClick={()=>setTab("rescate")}>🆘 Rescate</button>
        </div>
      </header>

      <main className="grid">
        {tab === "arrancar" && (
          <section className="card">
            <div className="cardTitle">🚀 Cómo arrancar (sin invocar demonios)</div>
            <Step
              n="1"
              title="Conecta el USB"
              kids={<ul className="list">
                <li>Apaga el ordenador.</li>
                <li>Conecta este USB.</li>
                <li>Enciende.</li>
              </ul>}
            />
            <Step
              n="2"
              title="El truco: el menú de arranque"
              kids={<>
                <p>En cuanto enciendes, pulsa como si fueras gamer en la final:</p>
                <div className="keys">
                  <span className="key">F12</span>
                  <span className="key">F10</span>
                  <span className="key">ESC</span>
                  <span className="key">DEL</span>
                </div>
                <p className="muted">
                  Sale un menú. Elige algo que ponga <b>USB</b> o <b>UEFI USB</b>.
                  Si no sale, apaga y prueba otra tecla.
                </p>
              </>}
            />
            <Step
              n="3"
              title="Batocera arranca solo"
              kids={<>
                <p>Si has llegado aquí: victoria. Verás un menú con consolas y sistemas.</p>
                <p className="muted">Pro tip: si algo se queda negro 3 segundos… respira. Es parte del ritual.</p>
              </>}
            />
          </section>
        )}

        {tab === "mandos" && (
          <section className="card">
            <div className="cardTitle">🎮 Mandos: domar la bestia</div>
            <p>
              Puedes usar <b>mando USB</b> o <b>teclado</b>. Lo normal: Batocera te pedirá mapear botones la primera vez.
            </p>
            <Step
              n="1"
              title="Configurar mando (rápido)"
              kids={<ul className="list">
                <li>Mantén pulsado cualquier botón para empezar.</li>
                <li>Sigue el asistente: arriba/abajo/izquierda/derecha, A/B, Start…</li>
                <li>Si te equivocas: no pasa nada, se puede rehacer.</li>
              </ul>}
            />
            <div className="callout">
              <div className="calloutTitle">💡 Consejo que salva vidas</div>
              <p>Si el mando “hace cosas raras”, desconéctalo y conéctalo otra vez. Técnica ancestral.</p>
            </div>
          </section>
        )}

        {tab === "juegos" && (
          <section className="card">
            <div className="cardTitle">🧩 Juegos: aquí viene el “pero” (legal)</div>
            <p>
              Este USB <b>no incluye juegos</b>. No es por maldad: es por <b>legalidad</b>.
              La buena noticia: añadirlos es fácil.
            </p>

            <div className="cols">
              <div className="mini">
                <div className="miniTitle">✅ Método fácil (red local)</div>
                <ol className="list">
                  <li>Arranca Batocera.</li>
                  <li>Conéctalo a internet (Wi-Fi o cable).</li>
                  <li>Desde otro PC, abre la red y entra en:</li>
                </ol>
                <CopyBlock title="Ruta para Windows">
{`\\\\BATOCERA`}
                </CopyBlock>
                <p className="muted">Dentro: carpeta <b>roms</b> → copia cada juego en su sistema.</p>
              </div>

              <div className="mini">
                <div className="miniTitle">📁 Extensiones típicas</div>
                <ul className="list">
                  <li><code>.nes</code> → Nintendo</li>
                  <li><code>.sfc</code>/<code>.smc</code> → Super Nintendo</li>
                  <li><code>.gba</code> → Game Boy Advance</li>
                  <li><code>.iso</code>/<code>.bin</code> → PlayStation</li>
                </ul>
                <div className="callout small">
                  <div className="calloutTitle">🧠 Nota “sin drama”</div>
                  <p>Batocera los detecta solo. Copias, vuelves al menú, y aparecen.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {tab === "rescate" && (
          <section className="card">
            <div className="cardTitle">🆘 Rescate: cuando el PC se pone digno</div>

            <div className="callout">
              <div className="calloutTitle">Caso 1: no aparece el USB</div>
              <ul className="list">
                <li>Prueba otra tecla: <b>F12</b> / <b>F10</b> / <b>ESC</b> / <b>DEL</b>.</li>
                <li>Prueba otro puerto USB (mejor directo al PC, no en un hub).</li>
              </ul>
            </div>

            <div className="callout">
              <div className="calloutTitle">Caso 2: sale “Secure Boot” y se enfada</div>
              <p className="muted">
                Algunos PCs modernos bloquean el arranque externo. Solución típica: entrar en BIOS/UEFI y desactivar <b>Secure Boot</b>.
                (Si esto te suena a hechicería, pide ayuda 2 minutos: se hace una vez y ya.)
              </p>
            </div>

            <div className="callout">
              <div className="calloutTitle">Caso 3: quiero salir y volver a mi vida</div>
              <p>Menú → <b>Quit</b> → Apagar. Quitas el USB. Fin del episodio.</p>
            </div>

            <div className="footerNote">
              <span className="muted">Easter egg:</span> prueba el <b>Konami Code</b> en el teclado 😉
            </div>
          </section>
        )}

        <section className="side">
          <div className="sideCard">
            <div className="sideTitle">🎁 Lo importante</div>
            <ul className="list">
              <li>Esto corre desde el USB.</li>
              <li>No toca tu disco duro (a menos que tú quieras).</li>
              <li>Si quitas el USB, el PC vuelve normal.</li>
            </ul>
          </div>

          <div className="sideCard">
            <div className="sideTitle">📌 Atajo mental</div>
            <p className="muted">
              “Encender → machacar F12 → elegir USB → a jugar”
            </p>
          </div>

          <div className="sideCard">
            <div className="sideTitle">🧨 Modo gamberro</div>
            <p className="muted">
              Si algo falla, la solución oficial es: <b>apaga, respira, repite</b>.
              Funciona en PCs y en la vida.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

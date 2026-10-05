import { FormEvent, useEffect, useRef, useState } from "react";

type LinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

const Arrow = ({ className = "" }: { className?: string }) => (
  <img className={className} src="/assets/6bcaa.svg" alt="" aria-hidden="true" />
);

const Scribble = ({ className = "" }: { className?: string }) => (
  <img className={className} src="/assets/64439.svg" alt="" aria-hidden="true" />
);

const TextLink = ({ href, children, className = "" }: LinkProps) => (
  <a className={`text-link ${className}`} href={href}>
    <span>{children}</span>
    <Arrow />
  </a>
);

const Skyline = () => (
  <img className="skyline" src="/assets/90333.svg" alt="" aria-hidden="true" />
);


const Portrait = () => (
  <div className="portrait-wrap" aria-label="Retrato personal integrado en la ilustración">
    <div className="portrait-sun" />
    <div className="portrait-cutout">
      <img src={fotoRetrato} alt="Retrato de Ernesto Montes" />
      <span className="portrait-halftone" aria-hidden="true" />
      <span className="photo-label">CREANDO<br />EN PROCESO</span>
    </div>
    <img className="portrait-outline" src={ilustracionOutline} alt="" aria-hidden="true" />
  </div>
);

const Hero = () => (
  <section className="hero-scroll" id="top">
    <div className="hero-stage">
      <div className="hero-sky layer-sky">
        <span className="sun-disc" />
        <span className="cloud cloud-one" />
        <span className="cloud cloud-two" />
        <span className="cloud cloud-three" />
      </div>
      <div className="layer-city"><Skyline /></div>
      <div className="hero-cables layer-architecture">
        <span /><span /><span />
      </div>
      <div className="hero-sign sign-code layer-object">
        <small>COMPILANDO AHORA</small>
        <strong>IDEAS</strong>
        <code>01 101 001</code>
      </div>
      <div className="hero-sign sign-note layer-object">
        <small>NOTA DEV #042</small>
        <strong>HAZLO CON<br />CURIOSIDAD.</strong>
      </div>
      <div className="portrait-layer"><Portrait /></div>
      <div className="hero-copy layer-copy">
        <p className="eyebrow">ESTUDIANTE DE INGENIERÍA / DESARROLLADOR</p>
        <h1>CONVIRTIENDO<br /><em>IDEAS</em> EN<br /><span>SOFTWARE.</span></h1>
        <p className="hero-intro">Hola, soy <strong>Ernesto Montes</strong>. Estudiante de TI, construyo proyectos y documento lo que aprendo en el camino.</p>
        <div className="hero-actions">
          <TextLink href="#blog">Leer el blog</TextLink>
          <TextLink href="#projects" className="quiet-link">Ver proyectos</TextLink>
        </div>
      </div>
      <div className="foreground-code layer-foreground" aria-hidden="true">
        <span>{"{"}</span>
        <code>crear<br />&nbsp;&nbsp;aprender<br />&nbsp;&nbsp;repetir</code>
        <span>{"}"}</span>
      </div>
      <div className="foreground-leaf leaf-left layer-foreground" aria-hidden="true" />
      <div className="foreground-leaf leaf-right layer-foreground" aria-hidden="true" />
      <a href="#about" className="scroll-cue">
        <span>DESLIZA PARA EXPLORAR</span><i />
      </a>
    </div>
  </section>
);

const facts = [
  ["APRENDIENDO AHORA", "Desarrollo web"],
  ["ME INTERESA", "Arquitectura de software"],
  ["CONSTRUYENDO", "Proyectos personales"],
  ["EXPLORANDO", "IA + Datos"],
];

const About = () => (
  <section className="about scene-section" id="about">
    <div className="section-marker">02 / SOBRE EL CREADOR</div>
    <div className="about-title-wrap">
      <span className="vertical-note">UN RETRATO EN PROCESO</span>
      <h2>¿QUIÉN<br /><em>SOY?</em></h2>
      <Scribble />
    </div>
    <div className="about-world">
      <div className="about-copy">
        <p className="lead">Soy estudiante de ingeniería de software. Disfruto construir cosas, entender cómo funciona la tecnología y documentar el proceso.</p>
        <p>Este espacio es mi cuaderno abierto: parte laboratorio, parte archivo y siempre un proyecto en evolución.</p>
      </div>
      <div className="map-block">
        <span className="map-road road-one" />
        <span className="map-road road-two" />
        <span className="map-dot" />
        <p><small>VIVO EN</small>[TU CIUDAD, PAÍS]</p>
      </div>
      <div className="facts-board">
        {facts.map(([label, value], index) => (
          <div className={`fact fact-${index + 1}`} key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <img src={index === 0 ? "/assets/06530.svg" : "/assets/88e19.svg"} alt="" aria-hidden="true" />
          </div>
        ))}
      </div>
      <div className="about-building" aria-hidden="true">
        <span /><span /><span /><span />
        <b>ESTUDIO<br />404</b>
      </div>
    </div>
  </section>
);

const skills = [
  ["HTML", "Estructura con significado.", "orange"],
  ["CSS", "Composición, movimiento y detalle.", "teal"],
  ["JavaScript", "Experiencias web interactivas.", "yellow"],
  ["Python", "Automatización y experimentación.", "pink"],
  ["Java", "Backend y fundamentos de POO.", "cream"],
  ["Git", "Control de versiones consciente.", "green"],
  ["GitHub", "Construcción colaborativa.", "orange"],
  ["SQL", "Datos útiles y estructurados.", "teal"],
  ["React", "Interfaces basadas en componentes.", "pink"],
  ["Node.js", "JavaScript fuera del navegador.", "green"],
  ["Figma", "Ideas antes de implementar.", "yellow"],
  ["APIs", "Conectando sistemas útiles.", "cream"],
];

const Skills = () => (
  <section className="skills scene-section" id="lab">
    <div className="skills-heading">
      <p className="eyebrow">LA CAJA DE HERRAMIENTAS DIARIA</p>
      <h2>HERRAMIENTAS<br /><span>QUE USO</span></h2>
      <p>Explora el escritorio. Cada objeto tiene una historia.</p>
    </div>
    <div className="desk">
      <div className="desk-lamp" aria-hidden="true"><i /><span /></div>
      <div className="laptop" aria-hidden="true">
        <div><code>&lt;crear<br />&nbsp;&nbsp;algo<br />/&gt;</code></div>
        <span />
      </div>
      <div className="skill-grid">
        {skills.map(([name, description, color], index) => (
          <article className={`skill-object skill-${color} skill-object-${index + 1}`} key={name}>
            <span className="skill-index">{String(index + 1).padStart(2, "0")}</span>
            <h3>{name}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
      <span className="desk-edge">CÓDIGO / DISEÑO / SISTEMAS / CURIOSIDAD</span>
    </div>
  </section>
);

const projects = [
  {
    number: "01",
    title: "ANALIZADOR",
    description: "Una aplicación interactiva de análisis estadístico que convierte datos complejos en historias visuales fáciles de entender.",
    tech: "PYTHON / STREAMLIT / PANDAS / SCIPY",
    className: "project-orange",
  },
  {
    number: "02",
    title: "AGRODATA",
    description: "Proyecto dirigido a agrónomos para llevar registro de cultivos y clientes.",
    tech: "REACT / NODE.JS / REST API",
    className: "project-teal",
  },
  {
    number: "03",
    title: "NÓMINA AUTOMÁTICA",
    description: "Un experimento de productividad para planificar trabajo profundo sin perder de vista el panorama completo.",
    tech: "TYPESCRIPT / REACT / SQL",
    className: "project-yellow",
  },
];

const ProjectScene = ({ project }: { project: (typeof projects)[number] }) => (
  <article className={`project-scene ${project.className}`}>
    <div className="project-visual">
      <span className="project-number">{project.number}</span>
      <div className="project-window">
        <div className="window-bar"><i /><i /><i /></div>
        <div className="data-viz">
          <span /><span /><span /><span /><span />
        </div>
        <strong>[ IMAGEN DEL PROYECTO ]</strong>
      </div>
      <span className="project-orbit" />
      <span className="project-sticker">HECHO CON<br />CURIOSIDAD</span>
    </div>
    <div className="project-info">
      <p className="eyebrow">PROYECTO DESTACADO / {project.number}</p>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <span className="tech-line">{project.tech}</span>
      <div className="project-links">
        <TextLink href="#contact">Ver proyecto</TextLink>
        <TextLink href="#contact" className="quiet-link">GitHub</TextLink>
      </div>
    </div>
  </article>
);

const Projects = () => (
  <section className="projects scene-section" id="projects">
    <div className="projects-header">
      <div>
        <p className="eyebrow">TRABAJO SELECCIONADO / 2024—2026</p>
        <h2>COSAS QUE HE<br /><em>CREADO</em></h2>
      </div>
      <p>Experimentos hechos realidad con código, investigación y muchos commits de madrugada.</p>
    </div>
    <div className="project-list">
      {projects.map((project) => <ProjectScene project={project} key={project.number} />)}
    </div>
  </section>
);

const articles = [
  ["WEB", "Entender los contratos de una API", "Autenticación, cabeceras, cuerpos, JWT y las piezas que hacen funcionar las APIs modernas.", "12 MAR 2026", "8 MIN"],
  ["PYTHON", "Scripts pequeños, gran impacto", "Cómo pequeñas automatizaciones cambiaron mi forma de abordar el trabajo repetitivo.", "28 FEB 2026", "5 MIN"],
  ["INGENIERÍA DE SOFTWARE", "Diseñar antes de programar", "Una nota práctica sobre decisiones, compromisos y bocetos técnicos.", "09 FEB 2026", "7 MIN"],
  ["APRENDIZAJE", "La alegría de aún no saber", "Qué cambió cuando empecé a tratar la confusión como información útil.", "17 ENE 2026", "4 MIN"],
];

const Blog = () => (
  <section className="blog scene-section" id="blog">
    <div className="blog-masthead">
      <span>EDICIÓN N.º 01</span>
      <h2>DESDE LA <em>BITÁCORA DEV</em></h2>
      <p>Notas, experimentos y aprendizajes mientras construyo software.</p>
      <span>PRIMAVERA / 2026</span>
    </div>
    <div className="article-grid">
      {articles.map(([category, title, description, date, time], index) => (
        <article className={`article-card article-${index + 1}`} key={title}>
          <span className="article-no">0{index + 1}</span>
          <div className="article-art" aria-hidden="true">
            <i /><i /><i />
            <strong>{"{ }"}</strong>
          </div>
          <div className="article-meta"><span>{category}</span><span>{date} / {time}</span></div>
          <h3>{title}</h3>
          <p>{description}</p>
          <TextLink href="#featured">Leer nota</TextLink>
        </article>
      ))}
    </div>
    <article className="featured" id="featured">
      <div className="featured-art" aria-hidden="true">
        <span className="featured-sun" />
        <div className="featured-road" />
        <div className="featured-buildings"><i /><i /><i /><i /></div>
        <span className="featured-person" />
      </div>
      <div className="featured-copy">
        <p className="eyebrow">NOTA DE CAMPO DESTACADA</p>
        <h3>LO QUE ESTOY<br /><em>APRENDIENDO</em><br />AHORA</h3>
        <p>Una colección viva de preguntas, descubrimientos y errores útiles en el camino para convertirme en un mejor ingeniero.</p>
        <TextLink href="#contact" className="light-link">Leer artículo</TextLink>
      </div>
    </article>
  </section>
);

const Contact = () => {
  const [sent, setSent] = useState(false);
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <section className="contact scene-section" id="contact">
      <div className="contact-sky" aria-hidden="true">
        <span /><span /><span />
      </div>
      <div className="contact-copy">
        <p className="eyebrow">ABIERTO A IDEAS / PREGUNTAS / COLABORACIONES</p>
        <h2>CONSTRUYAMOS<br /><em>ALGO.</em></h2>
        <p>¿Tienes un proyecto, una idea o una pregunta?<br />Hablemos.</p>
        <div className="contact-links">
          <TextLink href="mailto:hello@example.com">Escríbeme</TextLink>
          <TextLink href="#contact">GitHub</TextLink>
        </div>
      </div>
      <form className="contact-form" onSubmit={onSubmit}>
        <p>{sent ? "MENSAJE LISTO — CONECTA ESTE FORMULARIO A TU SERVICIO DE CORREO." : "ENVÍA UNA NOTA"}</p>
        <label>
          <span>Nombre</span>
          <input name="name" placeholder="Tu nombre" required />
        </label>
        <label>
          <span>Correo</span>
          <input name="email" type="email" placeholder="you@example.com" required />
        </label>
        <label>
          <span>Mensaje</span>
          <textarea name="message" placeholder="Cuéntame qué tienes en mente..." rows={4} required />
        </label>
        <button type="submit"><span>Enviar mensaje</span><img src="/assets/e46c1.svg" alt="" aria-hidden="true" /></button>
      </form>
      <div className="contact-tower" aria-hidden="true">
        <span /><span /><span /><b>HOLA<br />MUNDO</b>
      </div>
    </section>
  );
};

const Navigation = ({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) => (
  <header className="nav-shell">
    <a className="monogram" href="#top" aria-label="Volver al inicio">UP<span>/</span></a>
    <nav className={open ? "is-open" : ""} aria-label="Navegación principal">
      <a href="#blog" onClick={() => setOpen(false)}>Blog</a>
      <a href="#projects" onClick={() => setOpen(false)}>Proyectos</a>
      <a href="#about" onClick={() => setOpen(false)}>Sobre mí</a>
      <a href="#lab" onClick={() => setOpen(false)}>Laboratorio</a>
    </nav>
    <a className="nav-contact" href="#contact">Contacto <img src="/assets/5f3ae.svg" alt="" aria-hidden="true" /></a>
    <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Abrir o cerrar navegación">
      <i /><i />
    </button>
  </header>
);

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const updateScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const hero = document.querySelector<HTMLElement>(".hero-scroll");
          if (hero) {
            const max = hero.offsetHeight - window.innerHeight;
            const progress = Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / max));
            document.documentElement.style.setProperty("--hero-progress", progress.toString());
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    const updateCursor = (event: PointerEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      }
    };
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", updateCursor, { passive: true });
    updateScroll();
    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", updateCursor);
    };
  }, []);

  return (
    <>
      <Navigation open={menuOpen} setOpen={setMenuOpen} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Blog />
        <Contact />
      </main>
      <footer>
        <div className="footer-name">ERNESTO<span>Estudiante de Ingeniería de Software / Desarrollador</span></div>
        <div className="footer-links"><a href="#blog">Blog</a><a href="#projects">Proyectos</a><a href="#about">Sobre mí</a><a href="#contact">Contacto</a></div>
        <div className="footer-links"><a href="#contact">GitHub</a><a href="#contact">LinkedIn</a><a href="mailto:hello@example.com">Correo</a></div>
        <div className="footer-note"><span>Nos vemos en el próximo recorrido.</span><small>© 2026 ERNESTO</small></div>
      </footer>
      <div className="custom-cursor" ref={cursorRef}><Arrow /></div>
    </>
  );
}

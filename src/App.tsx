import React, { useEffect, useRef, useState } from 'react'

/* ─── tipos ─── */
interface Project {
  id: string
  name: string
  tagline: string
  description: string
  highlight: string
  tech: string[]
  tags: string[]
  github: string
  live?: string
  color: string
  accentVar: string
  status: 'live' | 'wip' | 'mvp'
  hasCI: boolean
}

/* ─── dados ─── */
const PROJECTS: Project[] = [
  {
    id: 'stockwise',
    name: 'StockWise.NET',
    tagline: 'Sistema de controle de estoque com CI/CD',
    description:
      'Console app em .NET 10 com CRUD completo de produtos, gestão de pedidos (vendas e reposições), injeção de dependência, exceções customizadas e pipeline de CI automatizado via GitHub Actions.',
    highlight: 'GitHub Actions CI + PostgreSQL + Repository Pattern + DI nativo',
    tech: ['C#', '.NET 10', 'PostgreSQL', 'EF Core', 'GitHub Actions'],
    tags: ['Backend', 'CI/CD', '.NET'],
    github: 'https://github.com/JanGustavo/CRUD-Controle-de-estoque',
    color: '#4afa8a',
    accentVar: 'green',
    status: 'live',
    hasCI: true,
  },
  {
    id: 'adotapet',
    name: 'AdotaPet API',
    tagline: 'API RESTful de adoção — feed estilo Tinder',
    description:
      'Backend completo para plataforma de adoção de pets. Autenticação JWT com BCrypt, feed paginado com lógica de interações (like/dislike), arquitetura Minimal API em camadas e documentação via Swagger.',
    highlight: 'JWT + BCrypt + EF Core Migrations + Swagger + arquitetura em camadas',
    tech: ['C#', '.NET 8', 'Entity Framework', 'SQLite', 'JWT', 'Swagger'],
    tags: ['API REST', 'Backend', '.NET'],
    github: 'https://github.com/JanGustavo/AdotaPet-Api',
    color: '#4afa8a',
    accentVar: 'green',
    status: 'mvp',
    hasCI: false,
  },
  {
    id: 'moletom',
    name: 'MoleTom',
    tagline: 'E-commerce com IA generativa e PIX nativo',
    description:
      'Loja de moletom print-on-demand onde cada estampa é gerada por IA. O usuário descreve a arte, a IA cria, o Pillow compõe sobre a foto real do produto e o pagamento é feito via PIX — do QR code ao webhook de confirmação com confetti.',
    highlight: 'PIX real (BR Code/EMV + CRC-16) + Pollinations.ai + Pillow compositing',
    tech: ['Python', 'Flask', 'SQLAlchemy', 'Pillow', 'PIX/EMV', 'Pollinations.ai'],
    tags: ['E-commerce', 'IA Generativa', 'Pagamento'],
    github: 'https://github.com/JanGustavo/MoleTom-store',
    color: '#f5a623',
    accentVar: 'amber',
    status: 'mvp',
    hasCI: false,
  },

 {
    id: 'radar',
    name: 'PromoPulse TELEGRAM',
    tagline: 'Ecossistema de monitoramento em tempo real que filtra e centraliza ofertas de múltiplos canais do Telegram. Automatiza a curadoria de promoções através de regras inteligentes e blacklist dinâmica.',
    description:
      'Bot de Telegram que monitora preços de produtos em lojas online e envia alertas quando há mudanças significativas.',
    highlight: 'Telegram API + Web Scraping + python + fastApi',
    tech: ['Python', 'FastAPI', 'BeautifulSoup', 'Requests', 'telethon', 'Asyncio', 'Chrome Extension'],
    tags: ['Bot', 'Telegram', 'Web Scraping'],
    github: 'https://github.com/JanGustavo/telegram-PromoPulse-extension',
    color: '#f5a623',
    accentVar: 'amber',
    status: 'wip',
    hasCI: false,
  }
]

const SKILLS = {
  'Linguagens': ['C#', 'Python', 'TypeScript', 'JavaScript', 'Java', 'SQL'],
  'Frameworks': ['ASP.NET', 'Entity Framework', 'Flask', 'Angular', 'Bootstrap'],
  'Banco de dados': ['PostgreSQL', 'SQLite', 'SQL Server'],
  'Ferramentas': ['Git', 'GitHub Actions', 'Swagger', 'VS Code', 'Pillow'],
}

/* ─── hook: typewriter ─── */
function useTypewriter(lines: string[], speed = 45) {
  const [displayed, setDisplayed] = useState('')
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (done) return
    if (lineIdx >= lines.length) { setDone(true); return }

    const current = lines[lineIdx]
    if (charIdx < current.length) {
      const t = setTimeout(() => {
        setDisplayed(prev => prev + current[charIdx])
        setCharIdx(c => c + 1)
      }, speed)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setDisplayed(prev => prev + '\n')
        setLineIdx(l => l + 1)
        setCharIdx(0)
      }, 320)
      return () => clearTimeout(t)
    }
  }, [charIdx, lineIdx, done, lines, speed])

  return { displayed, done }
}

/* ─── hook: intersection observer ─── */
function useVisible(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

/* ─── componentes ─── */

function Cursor() {
  return (
    <span style={{
      display: 'inline-block',
      width: '10px',
      height: '1.1em',
      background: 'var(--green)',
      verticalAlign: 'text-bottom',
      animation: 'blink 1s step-end infinite',
      marginLeft: '2px',
    }} />
  )
}

function StatusBadge({ status }: { status: Project['status'] }) {
  const map = {
    live: { label: 'online', color: '#4afa8a' },
    mvp:  { label: 'MVP',    color: '#f5a623' },
    wip:  { label: 'WIP',    color: '#888' },
  }
  const s = map[status]
  return (
    <span style={{
      fontSize: '11px',
      color: s.color,
      border: `1px solid ${s.color}`,
      padding: '1px 7px',
      borderRadius: '2px',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    }}>
      {status === 'live' && (
        <span style={{
          display: 'inline-block',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: s.color,
          marginRight: '5px',
          animation: 'blink 1.5s ease-in-out infinite',
        }} />
      )}
      {s.label}
    </span>
  )
}

function CIBadge({ active }: { active?: boolean }) {
  if (!active) return null;
  return (
    <span style={{
      fontSize: '10px',
      color: '#4db8ff', // Um azul para diferenciar do verde/amber
      border: '1px solid #4db8ff',
      padding: '1px 6px',
      borderRadius: '2px',
      marginLeft: '8px',
      textTransform: 'uppercase',
    }}>
      ⚙️ CI/CD Active
    </span>
  );
}

function RenderButton() {
  return (
    <a
      href="https://moletom-store.onrender.com/"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontSize: '12px',
        color: 'purple',
        border: '1px solid purple',
        padding: '5px 16px',
        letterSpacing: '0.08em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'background 0.2s, color 0.2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = 'purple'
        ;(e.currentTarget as HTMLElement).style.color = '#0d0f0e'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = 'transparent'
        ;(e.currentTarget as HTMLElement).style.color = 'purple'
      }}
    >
      ↗ Render
    </a>
  );
}

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  const { ref, visible } = useVisible()
  const [hovered, setHovered] = useState(false)

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        border: `1px solid ${hovered ? project.color + '55' : 'var(--border)'}`,
        background: hovered ? 'var(--bg-hover)' : 'var(--bg-card)',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, border-color 0.3s, background 0.3s`,
      }}
    >
      {/* linha de cor lateral */}
      <div style={{
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: '3px',
        background: project.color,
        opacity: hovered ? 1 : 0.4,
        transition: 'opacity 0.3s',
      }} />

      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ color: 'var(--text-dim)', fontSize: '11px', marginBottom: '4px', letterSpacing: '0.1em' }}>
            $ project --name
          </div>
          <h3 style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
            color: project.color,
            fontWeight: 900,
            lineHeight: 1.1,
          }}>
            {project.name}
          </h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '12px', marginTop: '4px', fontStyle: 'italic' }}>
            {project.tagline}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <StatusBadge status={project.status} />
          <CIBadge active={project.hasCI} />
        </div>
      </div>

      {/* descrição */}
      <p style={{ color: 'var(--text)', lineHeight: 1.8, marginBottom: '1.2rem', fontSize: '13px' }}>
        {project.description}
      </p>

      {/* highlight técnico */}
      <div style={{
        background: project.color + '11',
        border: `1px solid ${project.color}33`,
        padding: '0.6rem 0.9rem',
        marginBottom: '1.2rem',
        fontSize: '12px',
        color: project.color,
      }}>
        <span style={{ color: 'var(--text-dim)' }}>// highlight: </span>
        {project.highlight}
      </div>

      {/* tech stack */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.5rem' }}>
        {project.tech.map(t => (
          <span key={t} style={{
            fontSize: '11px',
            padding: '2px 10px',
            border: '1px solid var(--border-lit)',
            color: 'var(--text-dim)',
            letterSpacing: '0.05em',
          }}>
            {t}
          </span>
        ))}
      </div>

      {/* links */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '12px',
            color: project.color,
            border: `1px solid ${project.color}`,
            padding: '5px 16px',
            letterSpacing: '0.08em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background 0.2s, color 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = project.color
            ;(e.currentTarget as HTMLElement).style.color = '#0d0f0e'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLElement).style.color = project.color
          }}
        >
          ↗ GitHub
        </a>
        {project.id === 'moletom' && <RenderButton />}
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '12px', color: 'var(--text-dim)' }}
          >
            ver ao vivo →
          </a>
        )}
      </div>

    </div>
  )
  

  



}

function SkillsSection() {
  const { ref, visible } = useVisible()
  return (
    <section ref={ref} style={{ padding: 'clamp(3rem, 8vw, 5rem) 0' }}>
      <div style={{ color: 'var(--text-dim)', fontSize: '12px', marginBottom: '0.4rem' }}>
        $ skills --list
      </div>
      <h2 style={{
        fontFamily: 'var(--serif)',
        fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
        color: 'var(--text-bright)',
        fontWeight: 700,
        marginBottom: '2.5rem',
      }}>
        Stack
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
      }}>
        {Object.entries(SKILLS).map(([category, items], ci) => (
          <div
            key={category}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.5s ease ${ci * 100}ms, transform 0.5s ease ${ci * 100}ms`,
            }}
          >
            <div style={{
              fontSize: '11px',
              color: 'var(--green)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '0.8rem',
              borderBottom: '1px solid var(--green-dim)',
              paddingBottom: '0.4rem',
            }}>
              {category}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {items.map(item => (
                <span key={item} style={{
                  fontSize: '13px',
                  color: 'var(--text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span style={{ color: 'var(--text-dim)' }}>▸</span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      background: scrolled ? 'rgba(13,15,14,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      transition: 'all 0.3s',
      padding: '0 clamp(1.5rem, 5vw, 4rem)',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '56px',
      }}>
        <span style={{
          fontFamily: 'var(--mono)',
          fontSize: '13px',
          color: 'var(--green)',
        }}>
          jangustavo.me<span style={{ animation: 'blink 1s step-end infinite' }}>_</span>
        </span>

        <div style={{ display: 'flex', gap: '2rem', fontSize: '12px', color: 'var(--text-dim)' }}>
          <a href="#projetos" style={{ color: 'var(--text-dim)' }}>projetos</a>
          <a href="#skills" style={{ color: 'var(--text-dim)' }}>stack</a>
          <a href="#contato" style={{ color: 'var(--text-dim)' }}>contato</a>
          <a
            href="https://github.com/JanGustavo"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--green)' }}
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </nav>
  )
}

/* ─── App ─── */
export default function App() {
  const BOOT_LINES = [
    '> iniciando sistema...',
    '> carregando módulos: [C#] [Python] [.NET] [Flask]',
    '> conectando ao banco: PostgreSQL ✓',
    '> build: OK — nenhum erro encontrado',
    '> olá, mundo.',
  ]

  const { displayed, done } = useTypewriter(BOOT_LINES, 38)

  return (
    <>
      <Navbar />

      {/* scanline overlay sutil */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
      }} />

      <main style={{ position: 'relative', zIndex: 1, padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* ── HERO ── */}
          <section style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingTop: '80px',
          }}>
            {/* terminal de boot */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              padding: '1.2rem 1.5rem',
              marginBottom: '3rem',
              maxWidth: '560px',
              animation: 'fadeUp 0.5s ease both',
            }}>
              <div style={{
                display: 'flex',
                gap: '6px',
                marginBottom: '0.8rem',
              }}>
                {['#ff5f57','#ffbd2e','#28ca42'].map(c => (
                  <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
                ))}
              </div>
              <pre style={{
                fontFamily: 'var(--mono)',
                fontSize: '12px',
                color: 'var(--green)',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.8,
                minHeight: '7.5em',
              }}>
                {displayed}{!done && <Cursor />}
              </pre>
            </div>

            {/* nome e bio */}
            <div style={{ animation: 'fadeUp 0.6s ease 0.3s both' }}>
              <div style={{ color: 'var(--text-dim)', fontSize: '12px', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>
                // desenvolvedor backend
              </div>
              <h1 style={{
                fontFamily: 'var(--serif)',
                fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
                fontWeight: 900,
                lineHeight: 1.0,
                color: 'var(--text-bright)',
                marginBottom: '1.5rem',
                letterSpacing: '-0.02em',
              }}>
                Jan<br />
                <span style={{ color: 'var(--green)' }}>Gustavo</span>
              </h1>
              <p style={{
                maxWidth: '500px',
                color: 'var(--text)',
                lineHeight: 1.8,
                fontSize: '14px',
                marginBottom: '2rem',
              }}>
                Desenvolvedor Backend Júnior focado em ecossistemas .NET e Python. 
        Especialista na construção de APIs robustas, sistemas de estoque com CI/CD 
        e integrações com IA generativa. Baseado em Bayeux, PB.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href="#projetos"
                  style={{
                    fontSize: '13px',
                    color: 'var(--bg)',
                    background: 'var(--green)',
                    padding: '8px 24px',
                    letterSpacing: '0.06em',
                    fontWeight: 500,
                  }}
                >
                  ver projetos ↓
                </a>
                <a
                  href="mailto:jeeh2200@gmail.com"
                  style={{
                    fontSize: '13px',
                    color: 'var(--green)',
                    border: '1px solid var(--green)',
                    padding: '8px 24px',
                    letterSpacing: '0.06em',
                  }}
                >
                  falar comigo
                </a>
              </div>
            </div>
          </section>

          {/* ── PROJETOS ── */}
          <section id="projetos" style={{ padding: 'clamp(3rem, 8vw, 5rem) 0' }}>
            <div style={{ color: 'var(--text-dim)', fontSize: '12px', marginBottom: '0.4rem' }}>
              $ git log --oneline --all
            </div>
            <h2 style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              color: 'var(--text-bright)',
              fontWeight: 700,
              marginBottom: '2.5rem',
            }}>
              Projetos
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {PROJECTS.map((project, i) => (
                <ProjectCard key={project.id} project={project} delay={i * 120} />
              ))}
            </div>
          </section>

          {/* ── SKILLS ── */}
          <section id="skills">
            <SkillsSection />
          </section>

          {/* ── FORMAÇÃO ── */}
          <section style={{ padding: 'clamp(2rem, 6vw, 4rem) 0', borderTop: '1px solid var(--border)' }}>
            <div style={{ color: 'var(--text-dim)', fontSize: '12px', marginBottom: '0.4rem' }}>
              $ cat formacao.txt
            </div>
            <h2 style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              color: 'var(--text-bright)',
              fontWeight: 700,
              marginBottom: '2rem',
            }}>
              Formação
            </h2>
            <div style={{
              border: '1px solid var(--border)',
              padding: '1.5rem 2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <div>
                <div style={{ color: 'var(--green)', fontSize: '13px', marginBottom: '4px' }}>
                  Tecnólogo em Análise e Desenvolvimento de Sistemas
                </div>
                <div style={{ color: 'var(--text)', fontSize: '14px', fontFamily: 'var(--serif)', fontWeight: 700 }}>
                  Uninassau — João Pessoa
                </div>
                <div style={{ color: 'var(--text-dim)', fontSize: '12px', marginTop: '6px' }}>
                  Lógica de programação · Estruturas de dados · POO · Banco de dados · Engenharia de software
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                Fev 2025 → Dez 2026
              </div>
            </div>
          </section>

          {/* ── CONTATO ── */}
          <section id="contato" style={{ padding: 'clamp(3rem, 8vw, 5rem) 0', borderTop: '1px solid var(--border)' }}>
            <div style={{ color: 'var(--text-dim)', fontSize: '12px', marginBottom: '0.4rem' }}>
              $ ping jangustavo
            </div>
            <h2 style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              color: 'var(--text-bright)',
              fontWeight: 700,
              marginBottom: '2rem',
            }}>
              Contato
            </h2>
            <p style={{ color: 'var(--text)', marginBottom: '2rem', maxWidth: '440px', lineHeight: 1.8 }}>
              Aberto a oportunidades de estágio e desenvolvimento júnior. Me manda um email ou conecta no GitHub.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {[
                { label: 'email', value: 'jeeh2200@gmail.com', href: 'mailto:jeeh2200@gmail.com' },
                { label: 'github', value: 'github.com/JanGustavo', href: 'https://github.com/JanGustavo' },
                { label: 'localização', value: 'Bayeux, Paraíba — Brasil', href: null },
              ].map(({ label, value, href }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-dim)', minWidth: '90px', fontSize: '11px', letterSpacing: '0.08em' }}>
                    {label}
                  </span>
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green)' }}>
                      {value}
                    </a>
                  ) : (
                    <span style={{ color: 'var(--text)' }}>{value}</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer style={{
            borderTop: '1px solid var(--border)',
            padding: '1.5rem 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
            fontSize: '11px',
            color: 'var(--text-dim)',
          }}>
            <span>© 2025 Janderson Gustavo · Bayeux, PB</span>
            <span style={{ color: 'var(--green-dim)' }}>
              feito com {'<'}código{'>'} e café
            </span>
          </footer>

        </div>
      </main>
    </>
  )
}

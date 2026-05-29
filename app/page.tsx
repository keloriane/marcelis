"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ─── Contenu modifiable ─────────────────────────────────────────────────── */

const SITE = {
  brand: "Expertises de maison",
  name: "Stéphanie Marcelis",
  title: "Expert Immobilier",
  ipi: "IPI 509.596",
  tva: "BE0783.153.056",
  tagline:
    "Une expertise immobilière indépendante, claire et humaine, au service de vos projets patrimoniaux.",
  description: [
    "Licenciée en traduction, j'ai rapidement réalisé après quelques années à travailler derrière un écran d'ordinateur que le contact humain était le véritable moteur de ma vie professionnelle. C'est donc tout naturellement que je me suis orientée vers l'immobilier.",
    "15 ans plus tard, forte de mon agrément IPI et d'autant d'années d'expérience sur le terrain, j'ai choisi d'approfondir mes compétences en me spécialisant durant deux ans dans l'expertise immobilière.",
    "Chaque projet de vie est unique. C'est pourquoi je mets l'ensemble de ce bagage technique et humain à votre service, pour vous guider avec enthousiasme, rigueur et bienveillance dans vos transactions classiques ou pour vous épauler lors de moments plus délicats (successions, séparations).",
  ],
  zones: ["Mons", "Soignies", "La Louvière", "Binche", "Charleroi"],
  email: "stephanie.marcelis@hotmail.com",
  phone: "0476 30 53 95",
  phoneHref: "tel:+32476305395",
  domain: "expertisesdemaison.be",
  logo: "/logo.jpg",
  profilePhoto: "/Photo N&B.jpg",
  linkedin: "",
  instagram: "",
} as const;

const NAV = [
  { href: "#a-propos", label: "À propos" },
  { href: "#services", label: "Services" },
  { href: "#zone", label: "Zone" },
  { href: "#temoignages", label: "Témoignages" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
] as const;

const SERVICES = [
  {
    title: "Expertise — vente",
    subtitle: "Valorisation vénale",
    description:
      "Estimation objective fondée sur l'analyse du marché local et les caractéristiques de votre bien.",
    icon: "home",
  },
  {
    title: "Séparation & divorce",
    subtitle: "Contexte délicat",
    description:
      "Valorisation neutre et documentée pour faciliter les accords amiables ou judiciaires.",
    icon: "balance",
  },
  {
    title: "Successions",
    subtitle: "Partage équitable",
    description:
      "Expertise adaptée aux indivisions successorales entre héritiers.",
    icon: "heritage",
  },
  {
    title: "Déclaration de succession",
    subtitle: "Conformité administrative",
    description:
      "Accompagnement dans l'évaluation des biens immobiliers à déclarer.",
    icon: "document",
  },
] as const;

const TESTIMONIALS = [
  { quote: "Témoignage client à compléter (prénom + ville).", author: "—", city: "—", placeholder: true },
  { quote: "Témoignage client à compléter (prénom + ville).", author: "—", city: "—", placeholder: true },
  { quote: "Témoignage client à compléter (prénom + ville).", author: "—", city: "—", placeholder: true },
] as const;

const FAQ = [
  {
    question: "Qu'est-ce qu'un expert immobilier agréé IPI ?",
    answer:
      "C'est un professionnel réglementé qui estime la valeur locative ou vénale d'un bien en toute indépendance, sur base d'une analyse du marché, du bien et de son environnement.",
  },
  {
    question: "Dans quels cas faire appel à une expertise ?",
    answer:
      "Lors d'une vente, d'une séparation, d'une succession, d'un partage entre héritiers ou pour une déclaration de succession impliquant un bien immobilier.",
  },
  {
    question: "Quelle zone couvrez-vous ?",
    answer:
      "J'interviens principalement à Mons, Soignies, La Louvière, Binche et Charleroi, ainsi que dans les communes environnantes du Hainaut.",
  },
  {
    question: "Comment se déroule une mission ?",
    answer:
      "Après un premier échange, une visite du bien est planifiée. Un rapport détaillé vous est ensuite remis, accompagné des éléments justificatifs utiles à votre démarche.",
  },
] as const;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE.brand,
  description: SITE.tagline,
  url: `https://www.${SITE.domain}`,
  telephone: "+32476305395",
  email: SITE.email,
  areaServed: SITE.zones.map((city) => ({ "@type": "City", name: city })),
  provider: {
    "@type": "Person",
    name: SITE.name,
    jobTitle: SITE.title,
    identifier: SITE.ipi,
  },
};

/* ─── UI helpers ─────────────────────────────────────────────────────────── */

function HexBadge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`flex size-14 shrink-0 items-center justify-center bg-brand-sage/25 text-brand-primary ${className}`}
      style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ icon, children }: { icon: React.ReactNode; children: string }) {
  return (
    <div className="reveal-up mb-6 flex items-center gap-4">
      <HexBadge>{icon}</HexBadge>
      <p className="section-label text-xs font-semibold uppercase text-brand-sage">{children}</p>
    </div>
  );
}

function ServiceIcon({ type }: { type: string }) {
  const cls = "size-6";
  if (type === "home")
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    );
  if (type === "balance")
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m0 0l1.05 4.33a1.5 1.5 0 01-1.4 1.86H5.1a1.5 1.5 0 01-1.4-1.86l1.05-4.33" />
      </svg>
    );
  if (type === "heritage")
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    );
  return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="reveal-up border-b border-brand-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-medium text-foreground">{question}</span>
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-full border border-brand-border text-brand-primary transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </span>
      </button>
      <div className="faq-panel" data-open={open}>
        <div>
          <p className="pb-5 leading-relaxed text-brand-muted">{answer}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [headerSolid, setHeaderSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setHeaderSolid(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !rootRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".hero-line", {
        y: 70,
        opacity: 0,
        duration: 1.1,
        stagger: 0.14,
        ease: "power3.out",
        delay: 0.1,
      });

      gsap.from(".hero-fade", {
        y: 36,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.55,
      });

      gsap.from(".hero-photo", {
        scale: 1.06,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        delay: 0.35,
      });

      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
          y: 44,
          opacity: 0,
          duration: 0.85,
          ease: "power2.out",
        });
      });

      gsap.from(".reveal-stagger-item", {
        scrollTrigger: {
          trigger: ".reveal-stagger",
          start: "top 84%",
        },
        y: 50,
        opacity: 0,
        duration: 0.75,
        stagger: 0.11,
        ease: "power2.out",
      });

      gsap.from(".reveal-card", {
        scrollTrigger: {
          trigger: ".reveal-cards",
          start: "top 86%",
        },
        y: 36,
        opacity: 0,
        duration: 0.7,
        stagger: 0.09,
        ease: "power2.out",
      });

      gsap.from(".zone-pill", {
        scrollTrigger: {
          trigger: ".zone-pills",
          start: "top 86%",
        },
        y: 24,
        opacity: 0,
        duration: 0.55,
        stagger: 0.07,
        ease: "power2.out",
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const navLinkClass = headerSolid
    ? "text-brand-muted hover:text-brand-primary"
    : "text-white/80 hover:text-white";

  return (
    <div ref={rootRef}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          headerSolid ? "border-b border-brand-border bg-white/95 shadow-sm backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <a href="#" className="relative z-10 shrink-0 rounded-lg bg-white/95 px-2 py-1">
            <Image src={SITE.logo} alt={`${SITE.name} — ${SITE.title}`} width={437} height={277} priority className="h-9 w-auto lg:h-10" />
          </a>
          <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Navigation principale">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`section-label text-[11px] font-semibold uppercase transition-colors ${navLinkClass}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
              headerSolid
                ? "bg-brand-primary text-white hover:bg-brand-primary-dark"
                : "bg-white text-brand-dark hover:bg-brand-sage-light"
            }`}
          >
            Contact
          </a>
        </div>
      </header>

      <main>
        {/* Hero sombre */}
        <section className="hero-dark relative min-h-[92vh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={SITE.profilePhoto}
              alt=""
              fill
              priority
              className="object-cover object-top opacity-35"
              sizes="100vw"
              aria-hidden
            />
          </div>

          <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-5 pb-28 pt-32 lg:px-8 lg:pb-36">
            <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
              <div>
                <p className="hero-line display-title text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl">MARCELIS</p>
                <p className="hero-line display-title mt-1 text-3xl text-brand-sage-light sm:text-4xl md:text-5xl">Stéphanie</p>
                <p className="hero-line display-title mt-2 text-2xl text-white/90 sm:text-3xl md:text-4xl">Expert Immobilier</p>
                <p className="hero-fade mt-8 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">{SITE.tagline}</p>
                <p className="hero-fade mt-3 text-sm font-medium tracking-widest text-brand-sage uppercase">{SITE.ipi}</p>
                <div className="hero-fade mt-10 flex flex-wrap gap-4">
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-brand-dark transition hover:bg-brand-sage-light"
                  >
                    Prendre rendez-vous
                  </a>
                  <a
                    href={SITE.phoneHref}
                    className="inline-flex items-center justify-center border border-white/40 px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:border-white hover:bg-white/10"
                  >
                    {SITE.phone}
                  </a>
                </div>
              </div>

              <div className="hero-photo relative mx-auto hidden aspect-[3/4] w-full max-w-xs overflow-hidden border-4 border-white/20 shadow-2xl lg:block lg:max-w-sm">
                <Image
                  src={SITE.profilePhoto}
                  alt={`${SITE.name}, ${SITE.title} agréé ${SITE.ipi}`}
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="384px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* À propos — encart blanc superposé */}
        <section id="a-propos" className="relative z-20 -mt-16 scroll-mt-28 md:-mt-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-0 bg-white shadow-2xl lg:grid-cols-[1fr_340px]">
              <div className="p-8 md:p-12 lg:p-14">
                <SectionLabel
                  icon={
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  }
                >
                  À propos
                </SectionLabel>
                <h2 className="reveal-up display-title text-2xl text-brand-primary-dark md:text-3xl">
                  EXPERTE INDÉPENDANTE AGRÉÉE IPI
                </h2>
                <div className="reveal-stagger mt-8 space-y-5">
                  {SITE.description.map((paragraph) => (
                    <p key={paragraph} className="reveal-stagger-item leading-relaxed text-brand-muted">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
              <aside className="flex flex-col justify-center bg-brand-surface p-8 md:p-10">
                <h3 className="reveal-up text-sm font-semibold uppercase tracking-widest text-brand-primary">Coordonnées</h3>
                <ul className="reveal-stagger mt-6 space-y-5 text-sm">
                  <li className="reveal-stagger-item">
                    <a href={SITE.phoneHref} className="font-medium text-foreground hover:text-brand-primary">
                      {SITE.phone}
                    </a>
                  </li>
                  <li className="reveal-stagger-item">
                    <a href={`mailto:${SITE.email}`} className="break-all font-medium text-foreground hover:text-brand-primary">
                      {SITE.email}
                    </a>
                  </li>
                  <li className="reveal-stagger-item text-brand-muted">
                    Hainaut — {SITE.zones.join(" · ")}
                  </li>
                </ul>
                <p className="reveal-up mt-8 border-t border-brand-border pt-6 text-xs text-brand-muted">
                  {SITE.ipi} · TVA {SITE.tva}
                </p>
              </aside>
            </div>
          </div>
        </section>

        {/* Bandeau visuel */}
        <div className="relative mt-16 h-52 overflow-hidden md:mt-20 md:h-72">
          <Image
            src={SITE.profilePhoto}
            alt=""
            fill
            className="object-cover object-[center_25%] brightness-110 saturate-50"
            sizes="100vw"
            aria-hidden
          />
          <div className="absolute inset-0 bg-white/30" />
        </div>

        {/* Services — encart sur bandeau */}
        <section id="services" className="relative z-20 -mt-20 scroll-mt-28 md:-mt-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="bg-white px-8 py-14 shadow-2xl md:px-14 md:py-16">
              <SectionLabel
                icon={
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
                  </svg>
                }
              >
                Services
              </SectionLabel>
              <h2 className="reveal-up display-title max-w-3xl text-2xl text-brand-primary-dark md:text-3xl">
                PRESTATIONS D&apos;EXPERTISE IMMOBILIÈRE
              </h2>
              <p className="reveal-up mt-4 max-w-2xl text-brand-muted">
                Des missions précises, des rapports détaillés et un accompagnement humain à chaque étape.
              </p>

              <div className="reveal-cards mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {SERVICES.map((service) => (
                  <article key={service.title} className="reveal-card group text-center">
                    <div className="mx-auto mb-5 flex justify-center">
                      <HexBadge className="size-16 bg-brand-sage/20 transition group-hover:bg-brand-sage/35">
                        <ServiceIcon type={service.icon} />
                      </HexBadge>
                    </div>
                    <p className="section-label text-[10px] font-semibold uppercase text-brand-sage">{service.subtitle}</p>
                    <h3 className="mt-2 text-sm font-semibold uppercase tracking-wide text-foreground">{service.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-brand-muted">{service.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Zone — section sombre */}
        <section id="zone" className="section-dark relative mt-24 scroll-mt-28 py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 text-center lg:px-8">
            <SectionLabel
              icon={
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              }
            >
              Zone d&apos;intervention
            </SectionLabel>
            <h2 className="reveal-up display-title text-2xl text-white md:text-3xl">LE HAINAUT, AU CŒUR DE VOTRE TERRITOIRE</h2>
            <p className="reveal-up mx-auto mt-5 max-w-xl text-white/70">
              J&apos;interviens à Mons, Soignies, La Louvière, Binche, Charleroi et dans les communes voisines.
            </p>
            <ul className="zone-pills reveal-up mt-14 flex flex-wrap justify-center gap-4">
              {SITE.zones.map((zone) => (
                <li
                  key={zone}
                  className="zone-pill border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-sm"
                >
                  {zone}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Témoignages */}
        <section id="temoignages" className="scroll-mt-28 bg-brand-surface py-24 md:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <SectionLabel
              icon={
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              }
            >
              Témoignages
            </SectionLabel>
            <h2 className="reveal-up display-title text-2xl text-brand-primary-dark md:text-3xl">CE QUE DISENT MES CLIENTS</h2>
            <div className="reveal-cards mt-14 grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((item) => (
                <blockquote
                  key={item.quote}
                  className={`reveal-card flex flex-col bg-white p-8 shadow-sm ${item.placeholder ? "border border-dashed border-brand-sage/50" : "border border-brand-border"}`}
                >
                  <p className="flex-1 leading-relaxed text-brand-muted">&ldquo;{item.quote}&rdquo;</p>
                  <footer className="mt-6 text-sm font-semibold text-brand-primary-dark">{item.author}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-28 py-24 md:py-28">
          <div className="mx-auto max-w-3xl px-5 lg:px-8">
            <SectionLabel
              icon={
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              }
            >
              FAQ
            </SectionLabel>
            <h2 className="reveal-up display-title text-center text-2xl text-brand-primary-dark md:text-3xl">QUESTIONS FRÉQUENTES</h2>
            <div className="mt-12">
              {FAQ.map((item) => (
                <FaqItem key={item.question} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact — section sombre */}
        <section id="contact" className="section-dark scroll-mt-28 py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <SectionLabel
                  icon={
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  }
                >
                  Contact
                </SectionLabel>
                <h2 className="reveal-up display-title text-2xl text-white md:text-3xl">CONTACTEZ-MOI</h2>
                <p className="reveal-up mt-5 max-w-md leading-relaxed text-white/75">
                  Pour une demande de rendez-vous ou une question sur votre situation, remplissez le formulaire. Je vous
                  recontacte dans les plus brefs délais.
                </p>
                <div className="reveal-up mt-8 space-y-3 text-sm">
                  <a href={SITE.phoneHref} className="block font-medium text-white hover:text-brand-sage-light">
                    {SITE.phone}
                  </a>
                  <a href={`mailto:${SITE.email}`} className="block font-medium text-white hover:text-brand-sage-light">
                    {SITE.email}
                  </a>
                </div>
              </div>

              <form
                action={`mailto:${SITE.email}`}
                method="post"
                encType="text/plain"
                className="reveal-up bg-white p-8 shadow-2xl md:p-10"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="civilite" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-brand-muted">
                      Civilité
                    </label>
                    <select id="civilite" name="Civilité" className="w-full border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-sage">
                      <option value="Mme">Mme</option>
                      <option value="M.">M.</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="nom" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-brand-muted">
                      Nom complet *
                    </label>
                    <input required id="nom" name="Nom" type="text" autoComplete="name" className="w-full border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-sage" />
                  </div>
                </div>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-brand-muted">
                      E-mail *
                    </label>
                    <input required id="email" name="Email" type="email" autoComplete="email" className="w-full border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-sage" />
                  </div>
                  <div>
                    <label htmlFor="telephone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-brand-muted">
                      Téléphone
                    </label>
                    <input id="telephone" name="Téléphone" type="tel" autoComplete="tel" className="w-full border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-sage" />
                  </div>
                </div>
                <div className="mt-5">
                  <label htmlFor="objet" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-brand-muted">
                    Type de demande *
                  </label>
                  <select required id="objet" name="Demande" className="w-full border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-sage">
                    <option value="Rendez-vous">Demande de rendez-vous</option>
                    <option value="Expertise vente">Expertise — vente</option>
                    <option value="Séparation">Séparation / divorce</option>
                    <option value="Succession">Succession</option>
                    <option value="Déclaration">Déclaration de succession</option>
                    <option value="Autre">Autre demande</option>
                  </select>
                </div>
                <div className="mt-5">
                  <label htmlFor="message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-brand-muted">
                    Message *
                  </label>
                  <textarea required id="message" name="Message" rows={4} className="w-full resize-y border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-sage" />
                </div>
                <label className="mt-5 flex items-start gap-3 text-xs leading-relaxed text-brand-muted">
                  <input required type="checkbox" name="RGPD" value="accepté" className="mt-0.5 size-4" />
                  J&apos;accepte que les informations saisies soient utilisées pour me recontacter, conformément au RGPD.
                </label>
                <button
                  type="submit"
                  className="mt-6 w-full bg-brand-primary py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-brand-primary-dark"
                >
                  Envoyer ma demande
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-brand-border bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 text-center text-sm text-brand-muted md:flex-row md:text-left lg:px-8">
          <div>
            <p className="font-semibold text-foreground">{SITE.brand}</p>
            <p className="mt-1">
              {SITE.name} · {SITE.title} · {SITE.ipi}
            </p>
            <p className="mt-1">TVA {SITE.tva}</p>
          </div>
          <p>
            Site réalisé par{" "}
            <a href="https://preums.be" className="font-medium text-[#FFA51F] hover:underline" target="_blank" rel="noopener noreferrer">
              Preums
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

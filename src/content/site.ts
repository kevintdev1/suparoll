export type NavLink = {
  label: string;
  href: string;
};

export type SeoEntry = {
  title: string;
  description: string;
};

export type Microcopy = {
  dismissToast: string;
  scrollLabel: string;
  notFoundTitle: string;
  notFoundBody: string;
  notFoundCta: string;
  newsletterLabel: string;
  newsletterPlaceholder: string;
  newsletterSubmit: string;
  newsletterSuccess: string;
  newsletterDemoNote: string;
};

export type FooterContent = {
  wordmark: string;
  tagline: string;
  links: NavLink[];
  legalLinks: NavLink[];
  newsletter: {
    enabled: boolean;
    title: string;
    description: string;
  };
  social: { label: string; href: string }[] | null;
  copyright: string;
};

export type SiteContent = {
  brand: string;
  tagline: string;
  skipToContent: string;
  navbar: {
    links: NavLink[];
    primaryNavLabel: string;
    mobileNavLabel: string;
    menuLabel: string;
    openMenu: string;
    closeMenu: string;
  };
  pageLabels: Record<string, string>;
  cursorLabels: Record<string, string>;
  footer: FooterContent;
  microcopy: Microcopy;
  seo: Record<string, SeoEntry>;
};

export const site: SiteContent = {
  brand: "Suparoll",
  tagline: "Cada instante, se revela",

  skipToContent: "Saltar al contenido",

  navbar: {
    links: [
      { label: "Cámara", href: "/camara" },
      { label: "Soporte", href: "/soporte" },
    ],
    primaryNavLabel: "Principal",
    mobileNavLabel: "Menú móvil",
    menuLabel: "Menú de navegación",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
  },

  pageLabels: {
    "/": "Inicio",
    "/camara": "Cámara",
    "/carrito": "Carrito",
    "/checkout": "Checkout",
    "/checkout/confirmacion": "Confirmación",
    "/soporte": "Soporte",
    "/legal/privacidad": "Privacidad",
    "/legal/terminos": "Términos",
  },

  cursorLabels: {
    view: "Ver",
    drag: "Arrastra",
    slide: "Desliza",
  },

  footer: {
    wordmark: "SUPAROLL",
    tagline: "Cada instante, se revela",
    links: [
      { label: "Cámara", href: "/camara" },
      { label: "Soporte", href: "/soporte" },
    ],
    legalLinks: [
      { label: "Privacidad", href: "/legal/privacidad" },
      { label: "Términos", href: "/legal/terminos" },
    ],
    newsletter: {
      enabled: true,
      title: "Recibe novedades",
      description:
        "Un correo de vez en cuando. Sin spam, solo lo esencial sobre Suparoll.",
    },
    social: [
      { label: "Instagram", href: "https://instagram.com/suparoll" },
      { label: "TikTok", href: "https://tiktok.com/@suparoll" },
    ],
    copyright: "© Suparoll",
  },

  microcopy: {
    dismissToast: "Cerrar aviso",
    scrollLabel: "Desliza para revelar",
    notFoundTitle: "Esta foto aún no se ha revelado",
    notFoundBody:
      "La página que buscas no existe o se movió. Vuelve al inicio y sigue explorando.",
    notFoundCta: "Volver al inicio",
    newsletterLabel: "Correo electrónico",
    newsletterPlaceholder: "Tu correo",
    newsletterSubmit: "Suscribirme",
    newsletterSuccess: "¡Listo!",
    newsletterDemoNote:
      "Modo demostración — el envío no está conectado a ningún servicio real.",
  },

  seo: {
    home: {
      title: "Suparoll — Cada instante, se revela",
      description:
        "Cámara instantánea con diseño icónico. Fotos físicas en segundos, sin pantallas. Descubre Suparoll.",
    },
    camara: {
      title: "Suparoll — Cámara instantánea",
      description:
        "Conoce la cámara Suparoll: especificaciones, variantes y todo lo que incluye la caja.",
    },
    carrito: {
      title: "Carrito — Suparoll",
      description: "Revisa los artículos en tu carrito antes de pagar.",
    },
    checkout: {
      title: "Checkout — Suparoll",
      description: "Completa tu compra de Suparoll.",
    },
    confirmacion: {
      title: "Pedido confirmado — Suparoll",
      description: "Resumen de tu pedido simulado de Suparoll.",
    },
    soporte: {
      title: "Soporte — Suparoll",
      description:
        "Preguntas frecuentes, envíos, devoluciones, garantía y contacto.",
    },
    privacidad: {
      title: "Privacidad — Suparoll",
      description: "Política de privacidad de Suparoll.",
    },
    terminos: {
      title: "Términos — Suparoll",
      description: "Términos y condiciones de Suparoll.",
    },
    notFound: {
      title: "Página no encontrada — Suparoll",
      description: "La página que buscas no existe.",
    },
  },
};

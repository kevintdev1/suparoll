export type NavLink = {
  label: string;
  href: string;
};

export type SeoEntry = {
  title: string;
  description: string;
};

export type Microcopy = {
  addToCart: string;
  added: string;
  viewCart: string;
  checkout: string;
  emptyCart: string;
  emptyCartCta: string;
  paymentError: string;
  outOfStock: string;
  inStock: string;
  undo: string;
  removedFromCart: string;
  simulatePayment: string;
  checkoutDemoNote: string;
  orderNumber: string;
  confirmationTitle: string;
  confirmationEmpty: string;
  continueExploring: string;
  decreaseQuantity: string;
  increaseQuantity: string;
  closeCart: string;
  loadingCart: string;
  cartError: string;
  scrollLabel: string;
  notFoundTitle: string;
  notFoundBody: string;
  notFoundCta: string;
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
  navbar: {
    links: NavLink[];
    cartLabel: string;
  };
  footer: FooterContent;
  microcopy: Microcopy;
  seo: Record<string, SeoEntry>;
};

export const site: SiteContent = {
  brand: "Suparoll",
  tagline: "Cada instante, se revela",

  navbar: {
    links: [
      { label: "Cámara", href: "/camara" },
      { label: "Soporte", href: "/soporte" },
    ],
    cartLabel: "Carrito",
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
    social: null,
    copyright: "© Suparoll",
  },

  microcopy: {
    addToCart: "Añadir al carrito",
    added: "Añadido",
    viewCart: "Ver carrito",
    checkout: "Ir a pagar",
    emptyCart: "Tu carrito está vacío. Explora la cámara y guarda tu favorita.",
    emptyCartCta: "Ver la cámara",
    paymentError:
      "No pudimos procesar el pago. Revisa tus datos e inténtalo de nuevo.",
    outOfStock: "Agotado",
    inStock: "Disponible",
    undo: "Deshacer",
    removedFromCart: "Eliminado del carrito",
    simulatePayment: "Simular pago",
    checkoutDemoNote:
      "Modo demostración — no se procesa un pago real ni se piden datos de tarjeta.",
    orderNumber: "Pedido",
    confirmationTitle: "Tu pedido está en camino a revelarse",
    confirmationEmpty:
      "No encontramos un pedido reciente. Vuelve a la cámara para empezar de nuevo.",
    continueExploring: "Seguir explorando",
    decreaseQuantity: "Quitar una unidad",
    increaseQuantity: "Añadir una unidad",
    closeCart: "Cerrar carrito",
    loadingCart: "Cargando carrito…",
    cartError: "No pudimos actualizar el carrito. Inténtalo de nuevo.",
    scrollLabel: "Desliza para revelar",
    notFoundTitle: "Esta foto aún no se ha revelado",
    notFoundBody:
      "La página que buscas no existe o se movió. Vuelve al inicio y sigue explorando.",
    notFoundCta: "Volver al inicio",
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

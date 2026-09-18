export type FaqTag = "home" | "product" | "support";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  tags: FaqTag[];
};

export const faqItems: FaqItem[] = [
  {
    id: "faq-film",
    question: "¿Qué tipo de película usa Suparoll?",
    answer: "[[PENDIENTE: tipo de película compatible]]",
    tags: ["home", "product", "support"],
  },
  {
    id: "faq-develop-time",
    question: "¿Cuánto tarda en revelarse la foto?",
    answer: "[[PENDIENTE: tiempo de revelado en segundos]]",
    tags: ["home", "product", "support"],
  },
  {
    id: "faq-shipping",
    question: "¿Hacen envíos a mi país?",
    answer: "[[PENDIENTE: política de envío]]",
    tags: ["home", "support"],
  },
  {
    id: "faq-returns",
    question: "¿Puedo devolver la cámara si no me convence?",
    answer: "[[PENDIENTE: política de devoluciones]]",
    tags: ["home", "support"],
  },
  {
    id: "faq-warranty",
    question: "¿Tiene garantía?",
    answer: "[[PENDIENTE: garantía]]",
    tags: ["home", "product", "support"],
  },
  {
    id: "faq-battery",
    question: "¿Necesita pilas o batería?",
    answer: "[[PENDIENTE: tipo de alimentación / batería]]",
    tags: ["home", "product"],
  },
  {
    id: "faq-gift",
    question: "¿Sirve como regalo?",
    answer:
      "Sí. Suparoll es ideal para regalar: viene lista para usar y cada foto es un recuerdo que se puede sostener, no solo guardar en el móvil.",
    tags: ["home", "product"],
  },
];

export function getFaqByTag(tag: FaqTag): FaqItem[] {
  return faqItems.filter((item) => item.tags.includes(tag));
}

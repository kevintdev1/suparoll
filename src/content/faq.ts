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
    answer:
      "Suparoll One usa cartuchos Suparoll Mini de 10 fotos. También es compatible con película Instax Mini de otras marcas.",
    tags: ["home", "product", "support"],
  },
  {
    id: "faq-develop-time",
    question: "¿Cuánto tarda en revelarse la foto?",
    answer:
      "Unos 15 segundos. La imagen aparece en la mano sin temperatura ni agitación: solo espera y mira cómo cobra color.",
    tags: ["home", "product", "support"],
  },
  {
    id: "faq-shipping",
    question: "¿Hacen envíos a mi país?",
    answer:
      "Enviamos a toda la península española. El pedido llega en 3–5 días laborables. Envío gratuito en pedidos a partir de $50.",
    tags: ["home", "support"],
  },
  {
    id: "faq-returns",
    question: "¿Puedo devolver la cámara si no me convence?",
    answer:
      "Tienes 30 días desde la recepción para devolver la cámara sin uso y con su embalaje original. Reembolsamos el importe en cuanto recibamos el producto.",
    tags: ["home", "support"],
  },
  {
    id: "faq-warranty",
    question: "¿Tiene garantía?",
    answer:
      "Sí: 2 años de garantía oficial contra defectos de fabricación. El registro online tarda menos de un minuto.",
    tags: ["home", "product", "support"],
  },
  {
    id: "faq-battery",
    question: "¿Necesita pilas o batería?",
    answer:
      "Lleva batería recargable integrada por USB-C. Una carga completa rinde hasta unas 100 fotos.",
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

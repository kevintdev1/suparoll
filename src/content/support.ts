export type SupportSection = {
  id: string;
  title: string;
  body: string;
};

export const supportContent = {
  title: "¿En qué podemos ayudarte?",
  subtitle: "FAQ, envíos, devoluciones, garantía y contacto.",
  sections: [
    {
      id: "shipping",
      title: "Envíos",
      body: "Preparamos tu pedido en 24–48 horas laborables y lo entregamos en 3–5 días en la península. Te enviamos el número de seguimiento por correo en cuanto sale del almacén. Envío gratuito a partir de $50.",
    },
    {
      id: "returns",
      title: "Devoluciones",
      body: "Si la cámara no encaja contigo, puedes devolverla en 30 días sin uso y con embalaje original. Escríbenos a hola@suparoll.com con tu número de pedido y te indicamos los pasos. El reembolso se procesa en 5–7 días laborables tras recibir el paquete.",
    },
    {
      id: "warranty",
      title: "Garantía",
      body: "Suparoll One incluye 2 años de garantía oficial contra defectos de fabricación. Regístrala en suparoll.com/garantia con el número de serie que encontrarás en la base de la cámara.",
    },
    {
      id: "contact",
      title: "Contacto",
      body: "¿Dudas sobre tu pedido, la película o el revelado? Escríbenos a hola@suparoll.com. Respondemos de lunes a viernes, de 9:00 a 18:00 (hora peninsular).",
    },
  ] satisfies SupportSection[],
};

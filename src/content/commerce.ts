export type CheckoutStepId = "contact" | "shipping" | "payment" | "review";

export type CommerceContent = {
  price: {
    onRequest: string;
  };
  product: {
    addToCart: string;
    added: string;
    inStock: string;
    outOfStock: string;
    colorLabel: string;
    unavailableVariant: string;
  };
  quantity: {
    label: string;
    decrease: string;
    increase: string;
  };
  cart: {
    title: string;
    close: string;
    empty: string;
    emptyCta: string;
    loading: string;
    error: string;
    dismissError: string;
    remove: string;
    removed: string;
    undo: string;
    checkout: string;
    itemSingular: string;
    itemPlural: string;
  };
  summary: {
    subtotal: string;
    shipping: string;
    total: string;
  };
  checkout: {
    title: string;
    demoNote: string;
    continue: string;
    simulatePayment: string;
    paymentError: string;
    formError: string;
    steps: { id: CheckoutStepId; title: string }[];
    fields: {
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      postal: string;
      country: string;
      cardNumber: string;
      cardExpiry: string;
      cardCvc: string;
    };
    paymentPlaceholders: {
      cardNumber: string;
      cardExpiry: string;
      cardCvc: string;
    };
    review: {
      contact: string;
      shipping: string;
    };
  };
  confirmation: {
    title: string;
    empty: string;
    orderNumber: string;
    thanks: string;
    continueExploring: string;
    snapshotAssetId: string;
    snapshotAlt: string;
  };
};

export const commerceContent: CommerceContent = {
  price: {
    onRequest: "Consultar precio",
  },

  product: {
    addToCart: "Añadir al carrito",
    added: "Añadido",
    inStock: "Disponible",
    outOfStock: "Agotado",
    colorLabel: "Color",
    unavailableVariant: "Esa variante no está disponible.",
  },

  quantity: {
    label: "Cantidad",
    decrease: "Quitar una unidad",
    increase: "Añadir una unidad",
  },

  cart: {
    title: "Carrito",
    close: "Cerrar carrito",
    empty: "Tu carrito está vacío. Explora la cámara y guarda tu favorita.",
    emptyCta: "Ver la cámara",
    loading: "Cargando carrito…",
    error: "No pudimos actualizar el carrito. Inténtalo de nuevo.",
    dismissError: "Cerrar aviso",
    remove: "Eliminar",
    removed: "Eliminado del carrito",
    undo: "Deshacer",
    checkout: "Ir a pagar",
    itemSingular: "artículo",
    itemPlural: "artículos",
  },

  summary: {
    subtotal: "Subtotal",
    shipping: "Envío",
    total: "Total",
  },

  checkout: {
    title: "Checkout",
    demoNote:
      "Modo demostración — no se procesa un pago real ni se piden datos de tarjeta.",
    continue: "Continuar",
    simulatePayment: "Simular pago",
    paymentError:
      "No pudimos procesar el pago. Revisa tus datos e inténtalo de nuevo.",
    formError: "Revisa los datos del formulario.",
    steps: [
      { id: "contact", title: "Contacto" },
      { id: "shipping", title: "Envío" },
      { id: "payment", title: "Pago" },
      { id: "review", title: "Revisión" },
    ],
    fields: {
      name: "Nombre",
      email: "Correo",
      phone: "Teléfono",
      address: "Dirección",
      city: "Ciudad",
      postal: "Código postal",
      country: "País",
      cardNumber: "Número de tarjeta",
      cardExpiry: "Caducidad",
      cardCvc: "CVC",
    },
    paymentPlaceholders: {
      cardNumber: "•••• •••• •••• ••••",
      cardExpiry: "MM/AA",
      cardCvc: "•••",
    },
    review: {
      contact: "Contacto",
      shipping: "Envío",
    },
  },

  confirmation: {
    title: "Tu pedido está en camino a revelarse",
    empty:
      "No encontramos un pedido reciente. Vuelve a la cámara para empezar de nuevo.",
    orderNumber: "Pedido",
    thanks: "Gracias, {name}. Esto es una confirmación de demostración.",
    continueExploring: "Seguir explorando",
    snapshotAssetId: "develop-photo",
    snapshotAlt: "Instantánea del pedido",
  },
};

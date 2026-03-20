export interface Load {
  id: number;
  route: string;
  dest: string;
  price: number;
  miles: number;
  type: "Full Load" | "Partial";
  cargo: string;
  image: string;
  tag: string | null;
}

export interface QuoteFormData {
  name: string;
  phone: string;
  from: string;
  to: string;
  cargo: string;
}

// ── AutoMapper аналог — отображаемая модель ───────────────────────────────
export interface LoadDisplay {
  id: number;
  title: string;
  priceFormatted: string;
  milesFormatted: string;
  pricePerMile: string;
  type: string;
  cargo: string;
  image: string;
  tag: string | null;
}
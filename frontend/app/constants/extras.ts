import type { Extra } from "@/app/types";

/** @deprecated Extras estáticos substituídos pelos ProductOptionGroups do backend. */
export const EXTRAS: Extra[] = [
  { id: "cheese", name: "Queijo extra", price: 1.5 },
  { id: "bacon", name: "Bacon", price: 2.0 },
  { id: "caramelized_onion", name: "Cebola caramelizada", price: 1.0 },
  { id: "extra_sauce", name: "Molho extra", price: 0.5 },
  { id: "mushroom", name: "Cogumelo", price: 1.5 },
];

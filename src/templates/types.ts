import type { Store, Product } from "@/lib/supabase/types";

/**
 * Contract that every template MUST implement.
 * The template engine passes these props to whichever template
 * the store has selected.
 */
export interface TemplateProps {
  store: Store;
  products: Product[];
}

/**
 * A template component is a React component that accepts TemplateProps.
 */
export type TemplateComponent = React.ComponentType<TemplateProps>;

/**
 * Registry entry for each available template.
 */
export interface TemplateEntry {
  id: string;
  name: string;
  description: string;
  component: TemplateComponent;
}

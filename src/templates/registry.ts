import type { TemplateComponent, TemplateEntry } from "./types";
import { BoldTemplate } from "./bold";

const TEMPLATE_REGISTRY: Record<string, TemplateEntry> = {
  bold: {
    id: "bold",
    name: "Bold",
    description:
      "High-conversion template with urgency timers, trust badges, and social proof. Designed for single-product or small catalog stores.",
    component: BoldTemplate,
  },
} as const;

export function getTemplate(templateId: string): TemplateComponent {
  const entry = TEMPLATE_REGISTRY[templateId];

  if (!entry) {
    // Fallback to bold if template not found
    return TEMPLATE_REGISTRY.bold.component;
  }

  return entry.component;
}

export function getAvailableTemplates(): TemplateEntry[] {
  return Object.values(TEMPLATE_REGISTRY);
}

export { TEMPLATE_REGISTRY };

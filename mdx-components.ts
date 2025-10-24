import type { MDXComponents } from "mdx/types";
import uiComponents from "@/components/ui";

export function useMDXComponents(components: MDXComponents) {
  return {
    ...uiComponents,
    ...components,
  };
}

import { UiComponentMap } from "~/client/component-registery";
import type { FrameworkRendererProps } from "~/shared/listining-types";
import type { FormRendererProps } from "~/types/form-builder.types";

export function FrameworkRenderer({ render }: FrameworkRendererProps) {

  const Component = UiComponentMap[render.component_type];
  if (!Component) return null;

  return Component ? <Component payload={render.payload as any} /> : null;

}

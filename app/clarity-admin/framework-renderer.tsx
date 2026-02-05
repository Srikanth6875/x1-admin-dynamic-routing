import { UiComponentMap } from "~/clarity-admin/frame-work-registery";
import { FrameWorkRendererProps } from "./frame-work-types";

export function FrameworkRenderer({ render }: FrameWorkRendererProps) {

  const Component = UiComponentMap[render.component_type];
  if (!Component) return null;

  return Component ? <Component payload={render.payload} /> : null;
}

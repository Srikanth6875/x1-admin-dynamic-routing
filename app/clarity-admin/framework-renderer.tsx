import { UiComponentMap } from "./frame-work-registery";
import { FrameWorkRendererProps } from "./frame-work-types";

export function FrameworkRenderer({ render }: FrameWorkRendererProps) {

  const Component = UiComponentMap[render.type];
  if (!Component) return null;

  return Component ? <Component payload={render.payload as any} /> : null;
}

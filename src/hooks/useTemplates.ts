import { useState } from "react";

export interface BuilderTemplate {
  id: string;
  name: string;
  pages: number;
}

export function useTemplates(initialData: BuilderTemplate[] = [
  { id: "t1", name: "My first dashboard", pages: 1 }
]) {
  const [templates] = useState<BuilderTemplate[]>(initialData);

  return { templates };
}

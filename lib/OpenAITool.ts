export class OpenAITool {
  name: string;
  description: string;
  parameters: { name: string; type: string; description: string }[];

  constructor({ name, description, parameters }: { name: string; description: string; parameters: { name: string; type: string; description: string }[] }) {
    this.name = name;
    this.description = description;
    this.parameters = parameters;
  }
}
import { OpenAITool } from './OpenAITool';

export class SwaggerAPI {
  // Convert Swagger JSON to OpenAI tools
  convertToOpenAITools(swaggerJson: any, includeEndpoints: string[], excludeEndpoints: string[]): OpenAITool[] {
    const tools: OpenAITool[] = [];

    // Loop through the paths in the Swagger API definition
    for (const path in swaggerJson.paths) {
      if (this.shouldInclude(path, includeEndpoints, excludeEndpoints)) {
        for (const method in swaggerJson.paths[path]) {
          const operation = swaggerJson.paths[path][method];

          // Create an OpenAI tool for each operation
          const tool = new OpenAITool({
            name: operation.operationId || method + path,  // Use operationId if available, otherwise combine method and path
            description: operation.summary || 'No description available',
            parameters: this.extractParameters(operation.parameters),  // Extract the parameters
          });

          tools.push(tool);
        }
      }
    }

    return tools;
  }

  // Determines whether the path should be included based on registration rules (include/exclude)
  private shouldInclude(path: string, includeEndpoints: string[], excludeEndpoints: string[]): boolean {
    // Exclude paths that match any exclude pattern
    if (excludeEndpoints.some(exclude => path.includes(exclude))) return false;

    // If there are include filters, include the path only if it matches one of them
    if (includeEndpoints.length > 0 && !includeEndpoints.some(include => path.includes(include))) return false;

    return true;  // Include path if no exclusions match and it passes include checks
  }

  // Extracts the parameters from the Swagger operation
  private extractParameters(parameters: any[]): { name: string; type: string; description: string }[] {
    if (!parameters) return [];

    return parameters.map(param => ({
      name: param.name,
      type: param.schema ? param.schema.type : 'unknown',  // Use 'unknown' if no type is defined
      description: param.description || '',
    }));
  }
}
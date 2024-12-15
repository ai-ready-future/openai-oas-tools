import { default as openapiTS } from "openapi-typescript";
import fetch from "node-fetch";
import { OpenAPIV3 } from "openapi-types";
import * as swagger2openapi from "swagger2openapi";
import ts from "typescript";

export class ApiSpecParser {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  private async fetchSpec(): Promise<OpenAPIV3.Document> {
    const response = await fetch(this.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch OpenAPI spec: ${response.statusText}`);
    }

    const spec = await response.json();

    // Convert Swagger 2.x to OpenAPI 3.x if needed
    if (spec.swagger && spec.swagger.startsWith("2.")) {
      const { openapi } = await swagger2openapi.convertObj(spec, {});
      return openapi as OpenAPIV3.Document;
    }

    return spec as OpenAPIV3.Document;
  }

  /**
   * Extract operations from the OpenAPI paths
   * @param paths OpenAPI paths object
   */
  private extractOperations(paths: OpenAPIV3.PathsObject): Record<string, any> {
    const operations: Record<string, any> = {};

    for (const [path, methods] of Object.entries(paths)) {
      for (const [method, rawDetails] of Object.entries(methods as Record<string, unknown>)) {
        const details = rawDetails as OpenAPIV3.OperationObject;
        const operationId = details.operationId || `${method.toUpperCase()} ${path}`;
        operations[operationId] = {
          method,
          path,
          parameters: details.parameters || [],
          responses: details.responses || {},
          summary: details.summary || "",
        };
      }
    }

    return operations;
  }

  /**
   * Parse the OpenAPI spec and return structured data
   */
  public async parse(): Promise<{
    operations: Record<string, any>;
    components: OpenAPIV3.ComponentsObject | undefined;
    types: ts.Node[];
  }> {
    const spec = await this.fetchSpec();

    const operations = this.extractOperations(spec.paths || {});
    const components = spec.components || {};
    const types = await openapiTS(spec as any);

    return { operations, components, types };
  }
}
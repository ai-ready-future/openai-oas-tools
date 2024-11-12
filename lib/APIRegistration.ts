import axios from 'axios';
import { OpenAITool } from './OpenAITool';
import { SwaggerAPI } from './SwaggerAPI';

// Type for API authentication parameters (you can extend this based on your needs)
interface AuthParams {
  apiKey: string;
  token?: string;
}

export class APIRegistration {
  apiUrl: string;
  includeEndpoints: string[];
  excludeEndpoints: string[];
  authParams: AuthParams | null;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
    this.includeEndpoints = [];
    this.excludeEndpoints = [];
    this.authParams = null;
  }

  // Include specific endpoints or prefixes to register
  include(endpoints: string[]): this {
    this.includeEndpoints = endpoints;
    return this;
  }

  // Exclude specific endpoints or prefixes
  exclude(endpoints: string[]): this {
    this.excludeEndpoints = endpoints;
    return this;
  }

  // Set authentication parameters
  auth(authParams: AuthParams): this {
    this.authParams = authParams;
    return this;
  }

  // Fetch the Swagger JSON definition from the API
  private async fetchSwaggerDefinition(): Promise<any> {
    try {
      const response = await axios.get(this.apiUrl, {
        headers: this.authParams ? { Authorization: `Bearer ${this.authParams.apiKey}` } : {},
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching Swagger definition from ${this.apiUrl}:`, error);
      throw error;
    }
  }

  // Convert Swagger JSON to OpenAI tools (only include/exclude specified endpoints)
  async convertToOpenAITools(): Promise<OpenAITool[]> {
    const swaggerJson = await this.fetchSwaggerDefinition();
    return new SwaggerAPI().convertToOpenAITools(swaggerJson, this.includeEndpoints, this.excludeEndpoints);
  }

  // Find the matching API call for the function name returned by OpenAI
  findMatchingAPICall(functionName: string): Function | null {
    // This is where you can implement the logic to find and return the actual API endpoint handler
    // For simplicity, let's assume you map functionName directly to an API URL (can be extended further)
    if (functionName === 'getUserData') {
      return this.apiCallExample; // Example: return the corresponding API call handler
    }
    return null;
  }

  // Example API call handler (you can implement real API calls here)
  private async apiCallExample(parameters: any): Promise<any> {
    // Implement your API call here, e.g., calling an endpoint like '/users/{id}'
    const url = `${this.apiUrl}/users/${parameters.userId}`;
    const response = await axios.get(url);
    return response.data;
  }
}
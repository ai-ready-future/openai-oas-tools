import { APIRegistration } from "./APIRegistration";
import { OpenAITool } from "./OpenAITool";

export class OpenAIOasTools {
  apiRegistrations: any[] = [];

  constructor() {
    this.apiRegistrations = [];
  }

  register(apiUrl: string) {
    const registration = new APIRegistration(apiUrl);
    this.apiRegistrations.push(registration);
    return registration;
  }

  async getTools(): Promise<OpenAITool[]> {

    const tools: OpenAITool[] = [];

    for (const registration of this.apiRegistrations) {
      const extractedTools = await registration.convertToOpenAITools();
      tools.push(...extractedTools);
    }

    return tools;
  }

  async handleModelResponse(response: any) {
    const functionName = response.functionCall.name;
    const parameters = response.functionCall.parameters;

    for (const registration of this.apiRegistrations) {
      const apiCall = registration.findMatchingAPICall(functionName);
      if (apiCall) {
        return await apiCall(parameters);
      }
    }
    throw new Error(`No matching API found for function ${functionName}`);
  }
}
export class OpenAISwaggerTools {
  apiRegistrations: any[] = [];

  constructor() {
    this.apiRegistrations = [];
  }

  register(apiUrl: string) {
    const registration = new APIRegistration(apiUrl);
    this.apiRegistrations.push(registration);
    return registration;
  }

  getTools() {
    const tools = [];

    this.apiRegistrations.forEach(registration => {
      tools.push(...registration.convertToOpenAITools());
    });

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
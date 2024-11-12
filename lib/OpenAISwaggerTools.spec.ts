import { OpenAISwaggerTools } from './OpenAISwaggerTools';

describe('OpenAISwaggerTools', () => {
  let tools: OpenAISwaggerTools;

  beforeEach(() => {
    tools = new OpenAISwaggerTools();
  });

  it('should initialize with an empty list of API registrations', () => {
    expect(tools.apiRegistrations).toHaveLength(0);
  });

  it('should register an API correctly', () => {
    const apiUrl = 'https://api.example.com/swagger.json';
    const registration = tools.register(apiUrl);
    expect(tools.apiRegistrations).toHaveLength(1);
    expect(registration).toBeInstanceOf(APIRegistration);
  });

  it('should convert registered APIs into OpenAI tools', () => {
    const apiUrl = 'https://api.example.com/swagger.json';
    tools.register(apiUrl);
    const toolsList = tools.getTools();
    expect(toolsList).toBeInstanceOf(Array);
    expect(toolsList.length).toBeGreaterThan(0);
  });

  it('should handle a response from the model and call the correct API', async () => {
    const mockResponse = {
      functionCall: {
        name: 'getUserData',
        parameters: { userId: 123 }
      }
    };
    const result = await tools.handleModelResponse(mockResponse);
    expect(result).toEqual({ success: true });
  });
});
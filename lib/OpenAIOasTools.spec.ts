import { APIRegistration } from './APIRegistration';
import { OpenAIOasTools } from './OpenAIOasTools';
import { OpenAITool } from './OpenAITool';

describe('OpenAIOASTools', () => {
  let tools: OpenAIOasTools;

  beforeEach(() => {
    tools = new OpenAIOasTools();
  });

  it('should initialize with an empty list of API registrations', () => {
    expect(tools.apiRegistrations).toHaveLength(0);
  });

  it('should register an API correctly', () => {
    const apiUrl = 'https://petstore.swagger.io/v2/swagger.json'
    const registration = tools.register(apiUrl);
    expect(tools.apiRegistrations).toHaveLength(1);
    expect(registration).toBeInstanceOf(APIRegistration);
  });

  it('should convert registered APIs into OpenAI tools', async () => {
    const apiUrl = 'https://petstore.swagger.io/v2/swagger.json';
    tools.register(apiUrl);
    const toolsList: OpenAITool[] = await tools.getTools();
    expect(toolsList).toBeInstanceOf(Array);
    expect(toolsList.length).toBeGreaterThan(0);
  });

  it('should handle a response from the model and call the correct API', async () => {

    const apiUrl = 'https://petstore.swagger.io/v2/swagger.json';
    const registration = tools.register(apiUrl);

    const mockResponse = {
      functionCall: {
        name: '',
        parameters: { userId: 123 }
      }
    };

    const result = await tools.handleModelResponse(mockResponse);
    expect(result).toEqual({ success: true });
  });
});
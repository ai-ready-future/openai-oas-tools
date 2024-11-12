import { OpenAISwaggerTools } from '../lib/OpenAISwaggerTools';  // Adjust path if necessary
import { OpenAITool } from '../lib/OpenAITool';  // Adjust path if necessary

// Example API URL and Swagger definition
const apiUrl = 'https://api.example.com/swagger.json';

// Create an instance of OpenAISwaggerTools
const openAISwaggerTools = new OpenAISwaggerTools();

// Register an API with include/exclude filters and authentication parameters
openAISwaggerTools
  .register(apiUrl)
  .include(['/users']) // Include only paths that start with "/users"
  .exclude(['/admin']) // Exclude paths that start with "/admin"
  .auth({ apiKey: 'your-api-key' }); // Add any necessary authentication params

// Convert registered APIs into OpenAI tools (i.e., transforming Swagger definitions)
const tools: OpenAITool[] = openAISwaggerTools.getTools();

// Log the OpenAI tools generated from Swagger
console.log('OpenAI Tools:', tools);

// Example of how to handle a response from the OpenAI model
const mockResponse = {
  functionCall: {
    name: 'getUserData',  // This should match one of the API operations
    parameters: { userId: 123 }
  }
};

// Handle the model's response and make the corresponding API call
openAISwaggerTools.handleModelResponse(mockResponse)
  .then(apiResponse => {
    // Process the API response (e.g., returning user data)
    console.log('API Response:', apiResponse);
  })
  .catch(error => {
    // Handle errors (e.g., no matching API call found)
    console.error('Error handling model response:', error);
  });
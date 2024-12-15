import { ApiSpecParser } from "./api.spec.parser"; // Adjust the path if necessary

describe("ApiSpecParser Integration Test", () => {
  const petstoreUrl = "https://petstore.swagger.io/v2/swagger.json";

  it("should correctly fetch, parse, and return operations, components, and types from the Petstore API", async () => {
    // Arrange
    console.log("[Test] Initializing ApiSpecParser...");
    const parser = new ApiSpecParser(petstoreUrl);

    // Act
    console.log("[Test] Starting parsing process...");
    const result = await parser.parse();

    // Assert
    console.log("[Test] Parsing complete. Inspecting results...");
    
    console.log("[Test] Operations:");
    console.log(JSON.stringify(result.operations, null, 2)); // Pretty-print operations

    console.log("[Test] Components:");
    console.log(JSON.stringify(result.components, null, 2)); // Pretty-print components

    // console.log("[Test] Generated TypeScript Types:");
    // console.log(result.types); // Print generated TypeScript types

    // Validate structure
    expect(result).toHaveProperty("operations");
    expect(result).toHaveProperty("components");
    expect(result).toHaveProperty("types");

    // Check operations
    expect(Object.keys(result.operations).length).toBeGreaterThan(0);
    const operation = Object.values(result.operations)[0];
    expect(operation).toHaveProperty("method");
    expect(operation).toHaveProperty("path");

    // Check components
    expect(result.components).toBeDefined();
    expect(result.components).toHaveProperty("schemas");

    // Check generated types
    expect(result.types.length).toBeGreaterThan(0);
  });
});
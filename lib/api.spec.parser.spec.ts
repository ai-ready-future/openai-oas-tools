import { ApiSpecParser } from "./api.spec.parser"; // Ensure the path is correct and the module exists

describe("ApiSpecParser Integration Test", () => {
  const petstoreUrl = "https://petstore.swagger.io/v2/swagger.json";

  it("should correctly fetch, parse, and return operations, components, and types from the Petstore API", async () => {
    // Arrange
    const parser = new ApiSpecParser(petstoreUrl);

    // Act
    const result = await parser.parse();

    // Assert
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
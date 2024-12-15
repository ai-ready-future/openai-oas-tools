"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openapi_typescript_1 = __importDefault(require("openapi-typescript"));
const node_fetch_1 = __importDefault(require("node-fetch")); // Required to fetch the OpenAPI spec
function getTypes(url) {
    return __awaiter(this, void 0, void 0, function* () {
        // Fetch the OpenAPI spec
        const response = yield (0, node_fetch_1.default)(url);
        const spec = yield response.json();
        // Generate TypeScript types as a string
        const types = (0, openapi_typescript_1.default)(spec, {});
        // Dynamically evaluate types or use them as needed
        return types;
    });
}
// Example usage
(() => __awaiter(void 0, void 0, void 0, function* () {
    const types = yield getTypes("https://petstore.swagger.io/v2/swagger.json");
    console.log(types); // Outputs the generated TypeScript definitions
}))();

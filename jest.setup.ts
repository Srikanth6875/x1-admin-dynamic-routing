import "@testing-library/jest-dom";

//Polyfill for React Router (and other libs needing encoding)
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

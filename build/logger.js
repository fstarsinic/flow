"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/pino.config.ts
const pino_1 = __importDefault(require("pino"));
const isDevelopment = true; //process.env.NODE_ENV === 'development';
const logger = (0, pino_1.default)({
    level: isDevelopment ? 'debug' : 'info',
    // Add more configuration as needed
    transport: isDevelopment
        ? {
            target: 'pino-pretty',
            options: { colorize: true }
        }
        : undefined,
});
exports.default = logger;

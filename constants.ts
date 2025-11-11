import { Type } from '@google/genai';

export const SAMPLE_OPENAPI_JSON = `{
  "openapi": "3.0.0",
  "info": {
    "title": "Example Pet Store API",
    "version": "1.0.0",
    "description": "A simple API for managing pets in a store"
  },
  "servers": [
    {
      "url": "https://api.example.com/v1"
    }
  ],
  "paths": {
    "/pets": {
      "get": {
        "summary": "List all pets",
        "operationId": "listPets",
        "responses": {
          "200": {
            "description": "A paged array of pets"
          }
        }
      },
      "post": {
        "summary": "Create a pet",
        "operationId": "createPet",
        "responses": {
          "201": {
            "description": "Null response"
          }
        }
      }
    },
    "/pets/{petId}": {
      "get": {
        "summary": "Info for a specific pet",
        "operationId": "showPetById",
        "parameters": [
          {
            "name": "petId",
            "in": "path",
            "required": true,
            "description": "The id of the pet to retrieve",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Expected response to a valid request"
          }
        }
      }
    }
  }
}`;

export const SAMPLE_POSTMAN_JSON = `{
  "info": {
    "_postman_id": "c9f2b1b3-b3c1-4b7f-8a5a-9b8d9f1e1b1c",
    "name": "User Management API (Postman)",
    "description": "A collection for managing users.",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Users",
      "item": [
        {
          "name": "Get a list of users",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "https://api.example.com/users?page=1",
              "protocol": "https",
              "host": [
                "api",
                "example",
                "com"
              ],
              "path": [
                "users"
              ],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                }
              ]
            },
            "description": "Fetches a paginated list of users."
          },
          "response": []
        },
        {
          "name": "Create a new user",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\"username\\": \\"testuser\\",\\n  \\"email\\": \\"test@example.com\\"\\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "https://api.example.com/users",
              "protocol": "https",
              "host": [
                "api",
                "example",
                "com"
              ],
              "path": [
                "users"
              ]
            },
            "description": "Creates a new user with the provided details."
          },
          "response": []
        }
      ]
    }
  ]
}`;

export const SAMPLE_JSON = SAMPLE_OPENAPI_JSON; // Default


const DOCUMENT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
        },
        required: ['title', 'content'],
      },
    },
  },
  required: ['sections'],
};

export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    beginner_doc: DOCUMENT_SCHEMA,
    quick_start_doc: DOCUMENT_SCHEMA,
    security_doc: DOCUMENT_SCHEMA,
  },
};

export const GENERATE_DRAFTS_INSTRUCTION = `You are an expert technical writer. Based on the provided N_API specification, generate comprehensive and easy-to-understand documentation for the specified audiences. Structure each document with a clear title and content for each section. The documentation should be practical, accurate, and tailored to the audience's skill level. For code examples, use generic placeholders like 'YOUR_API_KEY' or 'example.com'.`;

export const AUDIENCE_CONFIG = {
  'Beginner': {
    name: 'Beginner Guide',
    description: 'A high-level overview of the API, its purpose, and key features. Simple language, minimal jargon.',
  },
  'Quick Start Developer': {
    name: 'Developer Quick Start',
    description: 'A step-by-step guide for developers to make their first API call. Includes authentication and code snippets.',
  },
  'Security Analyst': {
    name: 'Security Overview',
    description: 'Focuses on security aspects like authentication, authorization, rate limiting, and data handling.',
  },
};
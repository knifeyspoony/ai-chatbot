import { createAzure } from "@ai-sdk/azure";
import { customProvider } from "ai";
import { isTestEnvironment } from "../constants";

const azure = createAzure({
  resourceName: process.env.AZURE_RESOURCE_NAME,
  apiKey: process.env.AZURE_API_KEY,
  apiVersion: process.env.AZURE_API_VERSION,
});

const deploymentId = process.env.AZURE_DEPLOYMENT_ID || "gpt-4.1";

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        "chat-model": azure(deploymentId),
        "chat-model-reasoning": azure(deploymentId),
        "title-model": azure(deploymentId),
        "artifact-model": azure(deploymentId),
      },
    });

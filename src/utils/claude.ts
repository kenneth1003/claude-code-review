import Anthropic from "@anthropic-ai/sdk";
import { CodeReviewResult } from "../types";

export class ClaudeService {
  constructor() {}

  async generateCodeReview(
    diff: string,
    language: string = "en"
  ): Promise<CodeReviewResult> {
    const prompt = "";

    return {
      summary: "Code Review Summary 123",
      details: "Code Review Details 123",
      suggestions: this.extractSuggestions("Code Review Suggestions 123"),
      timestamp: new Date().toISOString(),
    };
  }

  private extractSuggestions(text: string): string[] {
    const suggestions: string[] = [];
    const lines = text.split("\n");

    for (const line of lines) {
      if (
        line.toLowerCase().includes("suggest") ||
        line.toLowerCase().includes("recommend") ||
        line.toLowerCase().includes("consider")
      ) {
        suggestions.push(line.trim());
      }
    }

    return suggestions;
  }
}

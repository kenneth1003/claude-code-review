import Anthropic from '@anthropic-ai/sdk';
import { CodeReviewResult } from '../types';

export class ClaudeService {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({
      apiKey,
    });
  }

  async generateCodeReview(diff: string, language: string = 'en'): Promise<CodeReviewResult> {
    const prompts = {
      en: `Please analyze the following git diff and provide a comprehensive code review summary:

${diff}

Please provide:
1. A brief summary of the changes
2. Detailed analysis of the modifications
3. Suggestions for improvements or potential issues
4. Overall assessment

Format your response in markdown.`,
      zh: `請分析以下 git diff 並提供全面的代碼審查摘要：

${diff}

請提供：
1. 變更的簡要摘要
2. 修改的詳細分析
3. 改進建議或潛在問題
4. 整體評估

請用 markdown 格式回覆。`,
      jp: `以下のgit diffを分析し、包括的なコードレビューサマリーを提供してください：

${diff}

以下を提供してください：
1. 変更の簡潔な要約
2. 修正の詳細分析
3. 改善提案または潜在的な問題
4. 全体的な評価

マークダウン形式で回答してください。`
    };

    const prompt = prompts[language as keyof typeof prompts] || prompts.en;

    const response = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude API');
    }

    return {
      summary: content.text.split('\n')[0] || 'Code Review Summary',
      details: content.text,
      suggestions: this.extractSuggestions(content.text),
      timestamp: new Date().toISOString(),
    };
  }

  private extractSuggestions(text: string): string[] {
    const suggestions: string[] = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.toLowerCase().includes('suggest') || 
          line.toLowerCase().includes('recommend') ||
          line.toLowerCase().includes('consider')) {
        suggestions.push(line.trim());
      }
    }
    
    return suggestions;
  }
}
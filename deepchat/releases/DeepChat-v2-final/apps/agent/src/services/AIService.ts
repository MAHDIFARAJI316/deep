import OpenAI from 'openai';
import { logger } from '../utils/logger';

export class AIService {
  private openai: OpenAI;
  private ready: boolean = false;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.ready = true;
  }

  async generateResponse(message: string, context: any): Promise<string> {
    try {
      const systemPrompt = this.buildSystemPrompt(context);
      
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return completion.choices[0].message.content || 'متاسفانه نتوانستم پاسخ مناسبی تولید کنم.';
    } catch (error) {
      logger.error('OpenAI API error:', error);
      throw new Error('خطا در تولید پاسخ هوش مصنوعی');
    }
  }

  private buildSystemPrompt(context: any): string {
    return `
شما یک دستیار هوشمند برای پلتفرم DeepChat 2.0 هستید با تم Mario.
شما باید:
1. پاسخ‌های مفید و دقیق ارائه دهید
2. از تم Mario استفاده کنید (🍄, 🎮, ⭐)
3. در صورت وجود، از اطلاعات زمینه‌ای استفاده کنید
4. پاسخ‌ها را به زبان فارسی ارائه دهید

اطلاعات زمینه‌ای:
${context.ragContext ? JSON.stringify(context.ragContext) : 'هیچ اطلاعات زمینه‌ای موجود نیست'}

لطفاً پاسخ مفید و دوستانه ارائه دهید.
    `;
  }

  isReady(): boolean {
    return this.ready;
  }
}
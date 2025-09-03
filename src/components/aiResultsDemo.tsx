'use client';

import React, { useState } from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import AIResultsModal from './aiResultModal';
import { AIResponse } from './aiResultModal';

const AIResultsDemo: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);

    // Example AI response data
    const sampleResponse: AIResponse = {
        title: "Fitness & Nutrition AI Analysis",
        subtitle: "Latest trends and insights from social media",
        content: `# AI-Powered Fitness & Nutrition Revolution

## 🤖 Key Trends in Fitness, Nutrition & AI-Powered Diets

### Rise of AI-Powered Fitness & Nutrition Apps
Many new apps now personalize workouts and meal plans using AI, adapting in real time based on user data.

- **FitAI Coach** (Next.js app, Google Gemini AI) generates tailored plans based on age, goals, and dietary needs
- **NW-FIT** offers an AI Fitness Coach that customizes recipes and workouts
- **"Hea!"** tracks macros and personalizes meals for any diet goal. Over 64,000 views & 47 likes
- LinkedIn users explore always-on AI nutrition coaches, accessible via chat or WhatsApp

### Automated Nutrition & Meal Tracking
AI is increasingly automating food/nutrition logging and tracking, reducing manual effort.

> "AI can personalize plans, but watch out for privacy risks and generic advice. Best used with humans, not as a replacement."

### Market Insights
- **Protein Market Growth**: ₹1,28,460 crore by 2032 with 15.8% CAGR
- **Major Investment**: Significant investments from brands and startups
- **User Engagement**: 64K+ views on popular AI nutrition apps

## ⚠️ Important Considerations

### Challenges & Cautions
- Data privacy concerns
- Risk of generic/biased advice  
- Need for human expertise alongside AI
- Emphasis on authentic, sustainable health over quick AI hacks

## 🏆 Popular Trends
1. **Keto diets** with AI-powered meal planning
2. **Protein-rich snacks** and supplements
3. **Nutrient-packed smoothies** for weight loss
4. **Sustainable eating** approaches

*Generated from analysis of Twitter and LinkedIn posts*`,
        timestamp: new Date().toISOString(),
        model: "GPT-4 Turbo"
    };

    const handleShowResults = () => {
        setAiResponse(sampleResponse);
        setIsModalOpen(true);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-8">
            <div className="text-center">
                <div className="mb-8">
                    <h1 className="mb-4 text-4xl font-bold text-gray-900">
                        AI Results Modal Demo
                    </h1>
                    <p className="text-gray-600">
                        Click the button to see dynamically rendered AI content
                    </p>
                </div>

                <button
                    onClick={handleShowResults}
                    className="group relative overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-8 py-4 text-white font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="relative flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5" />
                        <span>Show AI Results</span>
                        <Sparkles className="h-4 w-4" />
                    </div>
                </button>

                <div className="mt-8 text-sm text-gray-500">
                    <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
                </div>
            </div>

            <AIResultsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aiResponse={aiResponse}
            />
        </div>
    );
};

export default AIResultsDemo;
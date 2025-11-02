import { NextRequest, NextResponse } from 'next/server';
import { DocumentAnswer } from '@/types';

// Document queries are handled through VAPI voice conversations
// This endpoint provides guidance to use the voice feature instead
console.log('Document query endpoint ready - directing users to voice conversations');

export async function POST(request: NextRequest) {
  try {
    const { question, documentContent, documentName } = await request.json();

    if (!question || !documentContent) {
      return NextResponse.json(
        { error: 'Question and document content are required' },
        { status: 400 }
      );
    }

    //Prompt
    const prompt = `
Based on the following document content, please answer the user's question. If the answer cannot be found in the document, say so clearly.

Document: "${documentName}"
Content: ${documentContent.substring(0, 4000)} // Limit content to avoid token limits

Question: ${question}

Please provide a clear, concise answer based on the document content:`;

    let answer = '';

    // Always use fallback response since VAPI handles AI processing
    answer = `Great question about "${question}"! I can see you're asking about the document "${documentName}". 
    
For the best AI-powered analysis of your document, please use the voice conversation feature with your AI companion. Your companion has advanced document understanding capabilities and can:

• Discuss specific sections of your uploaded PDF
• Answer detailed questions about the content
• Provide explanations and examples
• Connect document concepts to your learning topic

Simply start a voice session and ask: "Can you help me understand this document?" or ask specific questions about the content.`;

    // Find relevant text snippet (simple approach)
    const words = question.toLowerCase().split(' ');
    const sentences = documentContent.split('. ');
    let relevantText = '';
    
    for (const sentence of sentences) {
      if (words.some((word: string) => sentence.toLowerCase().includes(word))) {
        relevantText = sentence.substring(0, 200) + '...';
        break;
      }
    }

    const response: DocumentAnswer = {
      answer,
      relevantText,
      confidence: 0.8, // Simple confidence score
    };

    return NextResponse.json({
      success: true,
      ...response
    });

  } catch (error) {
    console.error('Error processing document query:', error);
    
    // Enhanced fallback response
    return NextResponse.json({
      success: true,
      answer: `I encountered an issue while processing your question about the document. For the best experience with document analysis, please use the voice conversation feature with your AI companion, which provides advanced document understanding capabilities.`,
      relevantText: 'Please try asking your AI companion about this document during a voice session.',
      confidence: 0.3,
    });
  }
}
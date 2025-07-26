import { GoogleGenAI } from "@google/genai";

async function main(prompt) {
  console.log('=== Gemini API Call ===');
  console.log('Prompt:', prompt?.substring(0, 100) + '...');
  console.log('API Key available:', !!process.env.GEMINI_API_KEY);
  
  try {
    const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
    
    console.log('Client created successfully');
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    console.log('Response received');
    console.log('Response keys:', Object.keys(response || {}));
    console.log('Response.text type:', typeof response?.text);
    
    // Debug: Print raw response
    console.log('Raw response:', JSON.stringify(response, null, 2));
    
    // Coba berbagai cara akses
    if (response && response.text) {
      if (typeof response.text === 'string') {
        console.log('✅ Text is string');
        return response.text;
      } else if (typeof response.text === 'function') {
        console.log('✅ Text is function');
        return response.text();
      } else {
        console.log('❌ Text type unknown:', typeof response.text);
        return String(response.text);
      }
    } else {
      console.log('❌ No text property found');
      console.log('Available properties:', Object.keys(response || {}));
      throw new Error('No text content in response');
    }
    
  } catch (error) {
    console.error('Gemini API Error Details:');
    console.error('- Message:', error.message);
    console.error('- Stack:', error.stack);
    console.error('- Name:', error.name);
    
    throw new Error(`Gemini API failed: ${error.message}`);
  }
}

export default main;
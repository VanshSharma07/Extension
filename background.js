const GEMINI_API_KEY = 'AIzaSyDejJwWDCHA0djQNLLEYOurFgUljQT2NsY';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const RATE_LIMIT_DELAY = 10000; // 10 seconds
let lastRequestTime = 0;

async function getAnswerFromGemini(question) {
    if (!question || question.trim().length === 0) {
        console.log('❌ Empty question received');
        return null;
    }

    const prompt = `Question: ${question}\nProvide only the correct answer without any explanation.`;
    console.log('🔄 Sending request to Gemini API...');

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            const error = `API Error: ${response.status}`;
            console.error('❌', error);
            throw new Error(error);
        }

        const data = await response.json();
        console.log('📊 API Response:', data);

        if (!data.candidates || !data.candidates[0]) {
            const error = 'No answer generated';
            console.error('❌', error);
            throw new Error(error);
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('❌ Gemini API Error:', error);
        return null;
    }
}

// Listen for messages from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getAnswer') {
        getAnswerFromGemini(request.question).then(answer => {
            sendResponse({ answer });
        }).catch(error => {
            console.error('❌ Error getting answer:', error);
            sendResponse({ answer: null });
        });
        return true; // Keep the message channel open for sendResponse
    }
}); 

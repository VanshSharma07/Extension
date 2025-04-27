const GEMINI_API_KEY = 'AIzaSyCNIeaUmJaypTPzXwnNjevafL7suWWQMzU';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const RATE_LIMIT_DELAY = 10000; // 10 seconds
let lastRequestTime = 0;

async function getAnswerFromGemini(question, isCodingProblem = false) {
    if (!question || question.trim().length === 0) {
        console.log('❌ Empty question received');
        return null;
    }

    // More concise prompts to reduce token usage
    const prompt = isCodingProblem ? 
        `Provide a concise answer with code for: "${question}" Use markdown code blocks with language identifiers. Keep comments minimal but clear.` : 
        `Question: ${question}\nProvide a brief, clear answer.`;
    
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
                }],
                // Add generation config to limit response length
                generationConfig: {
                    maxOutputTokens: 1024,
                    temperature: 0.2,
                    topP: 0.95
                }
            })
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        
        const data = await response.json();
        if (!data.candidates || !data.candidates[0]) throw new Error('No answer generated');
        
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('❌ Gemini API Error:', error);
        return null;
    }
}

async function getCodeSolutionFromGemini(problem, language = 'C++') {
    if (!problem || problem.trim().length === 0) return null;

    // Concise prompt for code solutions
    const prompt = `Write ${language} code only for: ${problem} Use minimal, clear comments.`;
    
    console.log('🔄 Requesting code solution...');

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
                }],
                // Configure to produce more concise output
                generationConfig: {
                    maxOutputTokens: 1024,
                    temperature: 0.1,
                    topP: 0.9
                }
            })
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        
        const data = await response.json();
        if (!data.candidates || !data.candidates[0]) throw new Error('No code solution generated');
        
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('❌ Gemini API Error:', error);
        return null;
    }
}

async function getMCQAnswerFromGemini(question) {
    if (!question || question.trim().length === 0) return null;

    // Updated prompt to get both the option letter and its text
    const prompt = `For this multiple choice question: "${question}"
    Identify the correct option (A, B, C, or D).
    Format your response as: "X: option text" where X is the correct option letter and "option text" is the text of that option.
    Keep it concise.`;
    
    console.log('🔄 Analyzing MCQ question...');

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
                }],
                // Updated generation config to allow for longer response with option text
                generationConfig: {
                    maxOutputTokens: 100,
                    temperature: 0.1,
                    topP: 0.8
                }
            })
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        
        const data = await response.json();
        if (!data.candidates || !data.candidates[0]) throw new Error('No MCQ answer generated');
        
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('❌ Gemini API Error:', error);
        return null;
    }
}

// Listen for messages from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getAnswer') {
        getAnswerFromGemini(request.question, request.isCoding).then(answer => {
            sendResponse({ answer });
        }).catch(error => {
            console.error('❌ Error:', error);
            sendResponse({ answer: null });
        });
        return true;
    }
    else if (request.action === 'getCodeSolution') {
        getCodeSolutionFromGemini(request.problem, request.language || 'C++').then(code => {
            sendResponse({ code });
        }).catch(error => {
            console.error('❌ Error:', error);
            sendResponse({ code: null });
        });
        return true;
    }
    else if (request.action === 'getMCQAnswer') {
        getMCQAnswerFromGemini(request.question).then(answer => {
            sendResponse({ answer });
        }).catch(error => {
            console.error('❌ Error:', error);
            sendResponse({ answer: null });
        });
        return true;
    }
});

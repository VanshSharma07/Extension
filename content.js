let selectedText = '';
let answerBox = null;
let chatBox = null;
let codeBox = null;

// Function to create and display answer in a box
function displayAnswer(answer) {
    // Create the answer box if it doesn't exist
    if (!answerBox) {
        answerBox = document.createElement('div');
        answerBox.id = 'extension-answer-box';
        answerBox.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            max-width: 300px;
            max-height: 200px;
            overflow: auto;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            z-index: 9999;
            box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
            font-family: Arial, sans-serif;
            font-size: 14px;
        `;
        
        // Create header with title and close button
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #eee;
            padding-bottom: 8px;
            margin-bottom: 10px;
        `;
        
        const title = document.createElement('div');
        title.textContent = 'Answer';
        title.style.cssText = `
            font-weight: bold;
            color: #333;
        `;
        
        // Improved close button with cross icon
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&#10006;'; // Cross symbol (✖)
        closeButton.style.cssText = `
            background-color: #f1f1f1;
            border: none;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #555;
            font-size: 12px;
            transition: all 0.2s ease;
            padding: 0;
        `;
        
        // Hover effect
        closeButton.onmouseover = function() {
            this.style.backgroundColor = '#e0e0e0';
            this.style.color = '#333';
        };
        closeButton.onmouseout = function() {
            this.style.backgroundColor = '#f1f1f1';
            this.style.color = '#555';
        };
        
        closeButton.onclick = function() {
            answerBox.style.display = 'none';
        };
        
        header.appendChild(title);
        header.appendChild(closeButton);
        answerBox.appendChild(header);
        document.body.appendChild(answerBox);
    }
    
    // Create content container
    const contentDiv = document.createElement('div');
    
    // Add the answer
    contentDiv.innerHTML = answer;
    
    // Clear previous content and add new content
    // Keep the first child (header with close button) and replace the rest
    while (answerBox.childNodes.length > 1) {
        answerBox.removeChild(answerBox.lastChild);
    }
    answerBox.appendChild(contentDiv);
    
    // Make sure it's visible
    answerBox.style.display = 'block';
    
    console.log('✅ Answer displayed in box');
}

// Modify the chat box creation to use a textarea instead of input
function toggleChatBox() {
    console.log('Toggle chat box called');
    
    // Check if chat box exists and toggle visibility
    const existingBox = document.getElementById('extension-chat-box');
    if (existingBox) {
        if (existingBox.style.display === 'none') {
            console.log('Showing existing chat box');
            existingBox.style.display = 'flex';
        } else {
            console.log('Hiding existing chat box');
            existingBox.style.display = 'none';
        }
        return;
    }
    
    console.log('Creating new chat box');
    
    // Create chat box using HTML string approach (since this works in the debug version)
    chatBox = document.createElement('div');
    chatBox.id = 'extension-chat-box';
    
    // Create the HTML content
    chatBox.innerHTML = `
        <div style="position: fixed; bottom: 20px; right: 20px; width: 350px; height: 400px; 
                  background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;
                  z-index: 2147483647; box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
                  font-family: Arial, sans-serif; display: flex; flex-direction: column; overflow: hidden;">
            
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center;
                       border-bottom: 1px solid #eee; padding: 12px 15px; background-color: #f1f1f1;">
                <div style="font-weight: bold; color: #333;">Chat Assistant</div>
                <button id="chat-close-btn" style="background-color: #e0e0e0; border: none; border-radius: 50%;
                                                 width: 22px; height: 22px; display: flex; align-items: center;
                                                 justify-content: center; cursor: pointer; color: #555; font-size: 12px;">✖</button>
            </div>
            
            <!-- Chat history -->
            <div id="chat-history" style="flex: 1; overflow-y: auto; padding: 15px; display: flex;
                                        flex-direction: column; gap: 10px; background-color: #fafafa;"></div>
            
            <!-- Input area -->
            <div style="display: flex; padding: 10px; border-top: 1px solid #eee; background-color: #fff; align-items: flex-end;">
                <textarea id="chat-textarea" placeholder="Type your question... (Shift+Enter for new line)"
                          style="flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 8px; outline: none;
                                 font-size: 14px; resize: none; min-height: 22px; max-height: 100px; overflow-y: auto;
                                 font-family: Arial, sans-serif;"></textarea>
                <button id="chat-send-btn" style="margin-left: 10px; padding: 8px 16px; background-color: #4285f4;
                                                color: white; border: none; border-radius: 20px; cursor: pointer;
                                                font-size: 14px;">Send</button>
            </div>
        </div>
    `;
    
    // Append to body
    document.body.appendChild(chatBox);
    
    console.log('Chat box created using innerHTML approach');
    
    // Set up event listeners
    const closeBtn = document.getElementById('chat-close-btn');
    const sendBtn = document.getElementById('chat-send-btn');
    const textarea = document.getElementById('chat-textarea');
    const chatHistory = document.getElementById('chat-history');
    
    if (closeBtn) {
        closeBtn.onclick = function() {
            chatBox.style.display = 'none';
        };
    }
    
    if (sendBtn && textarea && chatHistory) {
        // Auto-resize textarea
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight > 100 ? 100 : this.scrollHeight) + 'px';
        });
        
        // Handle send button click
        sendBtn.onclick = function() {
            sendChatMessage(textarea, chatHistory);
        };
        
        // Handle Enter key
        textarea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage(textarea, chatHistory);
            }
        });
    }
    
    // Focus the textarea
    if (textarea) {
        textarea.focus();
    }
}

// Helper function to send a message from the chat
function sendChatMessage(textarea, chatHistory) {
    const question = textarea.value.trim();
    if (!question) return;
    
    // Add user message to chat
    addMessageToChatHistory(chatHistory, 'user', question);
    
    // Clear textarea and reset height
    textarea.value = '';
    textarea.style.height = 'auto';
    
    // Detect if it's likely a coding question
    const isCodingProblem = question.toLowerCase().includes('code') || 
                          question.toLowerCase().includes('function') ||
                          question.toLowerCase().includes('algorithm') ||
                          question.toLowerCase().includes('program');
    
    // Send to background script
    chrome.runtime.sendMessage({ 
        action: 'getAnswer', 
        question: question,
        isCoding: isCodingProblem
    }, (response) => {
        if (response && response.answer) {
            addMessageToChatHistory(chatHistory, 'assistant', response.answer);
        } else {
            addMessageToChatHistory(chatHistory, 'assistant', "Sorry, I couldn't generate an answer.");
        }
    });
}

// Helper function to add a message to the chat history
function addMessageToChatHistory(chatHistory, sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        max-width: 85%;
        padding: 10px 14px;
        border-radius: 12px;
        margin-bottom: 10px;
        word-wrap: break-word;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        ${sender === 'user' ? 
            'background-color: #e3f2fd; color: #0d47a1; align-self: flex-end; border: 1px solid #bbdefb;' : 
            'background-color: #f5f5f5; color: #212121; align-self: flex-start; border: 1px solid #e0e0e0;'}
    `;
    
    // Check if this is a code block (from assistant)
    if (sender === 'assistant' && containsCodeBlock(message)) {
        const parsedContent = formatCodeBlocks(message);
        messageDiv.innerHTML = parsedContent;
        
        // Add event listeners to all copy buttons after inserting the HTML
        setTimeout(() => {
            const copyButtons = messageDiv.querySelectorAll('[id$="-btn"]');
            copyButtons.forEach(button => {
                const buttonId = button.id;
                const codeId = buttonId.replace('-btn', '-code');
                button.addEventListener('click', function() {
                    const codeElement = document.getElementById(codeId);
                    if (codeElement) {
                        navigator.clipboard.writeText(codeElement.textContent).then(() => {
                            const originalText = this.innerHTML;
                            this.innerHTML = '<span>Copied!</span>';
                            setTimeout(() => {
                                this.innerHTML = originalText;
                            }, 2000);
                        });
                    }
                });
            });
        }, 0);
    } else {
        // Simple message display for regular text
        messageDiv.textContent = message;
    }
    
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Helper function to detect if message contains code
function containsCodeBlock(message) {
    // Check for common code indicators like ```
    return message.includes('```') || 
           (message.includes('{') && message.includes('}') && 
           (message.includes('function') || message.includes('class') || 
            message.includes('int ') || message.includes('void ')));
}

// Function to format code blocks with syntax highlighting and copy button
function formatCodeBlocks(message) {
    // Simple regex to identify code blocks between triple backticks
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    
    // If no code blocks with triple backticks, check if entire message looks like code
    if (!message.includes('```') && containsCodeBlock(message)) {
        return createFormattedCodeBlock(message, detectLanguage(message));
    }
    
    // Replace code blocks with formatted versions
    return message.replace(codeBlockRegex, (match, language, code) => {
        return createFormattedCodeBlock(code, language || 'code');
    });
}

// Helper to detect probable language if not specified
function detectLanguage(code) {
    if (code.includes('class') && code.includes('{') && 
       (code.includes('public:') || code.includes('private:'))) {
        return 'cpp';
    } else if (code.includes('function') && code.includes('{')) {
        return 'javascript';
    } else if (code.includes('def ') && code.includes(':')) {
        return 'python';
    }
    return 'code'; // default
}

// Create a formatted code block with copy button
function createFormattedCodeBlock(code, language) {
    // Escape HTML to prevent XSS
    const escapedCode = code.replace(/&/g, '&amp;')
                          .replace(/</g, '&lt;')
                          .replace(/>/g, '&gt;')
                          .replace(/"/g, '&quot;')
                          .replace(/'/g, '&#039;');
    
    const uniqueId = 'code-' + Math.random().toString(36).substr(2, 9);
    
    return `
        <div class="code-container" style="position: relative; background: #1e1e1e; border-radius: 6px; margin: 0; overflow: hidden;">
            <div class="code-header" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #2d2d2d; color: #e0e0e0;">
                <span style="font-size: 12px; text-transform: uppercase;">${language}</span>
                <button id="${uniqueId}-btn" style="background: #4285f4; border: none; color: white; padding: 4px 10px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; font-size: 12px;">
                    <span>Copy code</span>
                </button>
            </div>
            <pre style="margin: 0; padding: 12px 15px; color: #e0e0e0; overflow-x: auto; font-family: 'Consolas', 'Monaco', 'Courier New', monospace; font-size: 14px; line-height: 1.5;"><code id="${uniqueId}-code">${escapedCode}</code></pre>
        </div>
    `;
}

// Fix the duplicate event listener issue by removing one of them
// Keep only this event listener for Alt+A
document.addEventListener('keydown', function(event) {
    if (event.altKey && event.key.toLowerCase() === 'a') {
        console.log('Alt+A detected');
        event.preventDefault();
        toggleChatBox();
    }
});

// Add event listener for Alt+C
document.addEventListener('keydown', function(event) {
    if (event.altKey && event.key.toLowerCase() === 'c') {
        console.log('Alt+C detected');
        event.preventDefault();
        
        // Get selected text for code solution
        const selectedText = window.getSelection().toString().trim();
        
        if (selectedText) {
            // Show a simple loading indicator
            if (!codeBox) {
                createCodeBox();
            }
            
            codeBox.style.display = 'block';
            document.getElementById('code-content').innerHTML = 'Getting code solution...';
            
            // Request code solution from background script
            chrome.runtime.sendMessage({
                action: 'getCodeSolution',
                problem: selectedText
            }, (response) => {
                if (response && response.code) {
                    displayCodeSolution(response.code);
                } else {
                    document.getElementById('code-content').innerHTML = 
                        "Sorry, I couldn't generate a code solution.";
                }
            });
        } else {
            // Alert user to select text first
            alert('Please select text to get a code solution.');
        }
    }
});

// Create code solution box
function createCodeBox() {
    codeBox = document.createElement('div');
    codeBox.id = 'extension-code-box';
    codeBox.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 480px;
        max-height: 80vh;
        overflow: auto;
        background-color: #ffffff;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 0;
        z-index: 9999;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        font-family: Arial, sans-serif;
        font-size: 14px;
        display: none;
    `;
    
    // Create header with title and close button
    const header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 15px;
        background-color: #f5f5f5;
        border-bottom: 1px solid #eee;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    `;
    
    const title = document.createElement('div');
    title.textContent = 'Code Solution';
    title.style.cssText = `
        font-weight: bold;
        color: #333;
    `;
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&#10006;'; // Cross symbol (✖)
    closeButton.style.cssText = `
        background-color: transparent;
        border: none;
        border-radius: 50%;
        width: 22px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #555;
        font-size: 12px;
        transition: all 0.2s ease;
        padding: 0;
    `;
    
    // Hover effect
    closeButton.onmouseover = function() {
        this.style.backgroundColor = '#e0e0e0';
        this.style.color = '#333';
    };
    closeButton.onmouseout = function() {
        this.style.backgroundColor = 'transparent';
        this.style.color = '#555';
    };
    
    closeButton.onclick = function() {
        codeBox.style.display = 'none';
    };
    
    header.appendChild(title);
    header.appendChild(closeButton);
    codeBox.appendChild(header);
    
    // Content container with padding
    const contentDiv = document.createElement('div');
    contentDiv.id = 'code-content';
    contentDiv.style.cssText = `
        padding: 15px;
        overflow-x: hidden;
    `;
    codeBox.appendChild(contentDiv);
    
    document.body.appendChild(codeBox);
}

// Display code solution
function displayCodeSolution(code) {
    const contentDiv = document.getElementById('code-content');
    if (!contentDiv) return;
    
    // Format code with properly identified language
    const language = detectLanguage(code);
    contentDiv.innerHTML = createFormattedCodeBlock(code, language);
    
    // Add event listeners to copy buttons
    setTimeout(() => {
        const copyButtons = contentDiv.querySelectorAll('[id$="-btn"]');
        copyButtons.forEach(button => {
            const buttonId = button.id;
            const codeId = buttonId.replace('-btn', '-code');
            button.addEventListener('click', function() {
                const codeElement = document.getElementById(codeId);
                if (codeElement) {
                    navigator.clipboard.writeText(codeElement.textContent).then(() => {
                        const originalText = this.innerHTML;
                        this.innerHTML = '<span>Copied!</span>';
                        setTimeout(() => {
                            this.innerHTML = originalText;
                        }, 2000);
                    });
                }
            });
        });
    }, 0);
}

// Function to create and display MCQ answer in a box
function displayMCQAnswer(answer) {
    // Create the MCQ answer box if it doesn't exist
    if (!document.getElementById('extension-mcq-box')) {
        const mcqBox = document.createElement('div');
        mcqBox.id = 'extension-mcq-box';
        mcqBox.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            max-width: 80vw;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 10px;
            z-index: 9999;
            box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
            font-family: Arial, sans-serif;
            font-size: 14px;
            display: none;
            text-align: left;
        `;
        
        // Create header with title and close button
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        `;
        
        const title = document.createElement('div');
        title.textContent = 'Answer';
        title.style.cssText = `
            font-weight: bold;
            color: #333;
            margin-left: 5px;
        `;
        
        // Close button with cross icon
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&#10006;'; // Cross symbol (✖)
        closeButton.style.cssText = `
            background-color: transparent;
            border: none;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #555;
            font-size: 12px;
            padding: 0;
        `;
        
        closeButton.onclick = function() {
            mcqBox.style.display = 'none';
        };
        
        header.appendChild(title);
        header.appendChild(closeButton);
        mcqBox.appendChild(header);
        
        // Create content container
        const contentDiv = document.createElement('div');
        contentDiv.id = 'mcq-content';
        contentDiv.style.cssText = `
            display: flex;
            flex-direction: column;
            font-size: 16px;
            color: #333;
        `;
        
        // Letter container
        const letterDiv = document.createElement('div');
        letterDiv.id = 'mcq-letter';
        letterDiv.style.cssText = `
            font-size: 24px;
            font-weight: bold;
            color: #4285f4;
            margin-bottom: 5px;
        `;
        
        // Option text container
        const textDiv = document.createElement('div');
        textDiv.id = 'mcq-text';
        textDiv.style.cssText = `
            font-size: 14px;
            color: #555;
            line-height: 1.4;
        `;
        
        contentDiv.appendChild(letterDiv);
        contentDiv.appendChild(textDiv);
        mcqBox.appendChild(contentDiv);
        
        document.body.appendChild(mcqBox);
    }
    
    // Get the MCQ box and update its content
    const mcqBox = document.getElementById('extension-mcq-box');
    const letterDiv = document.getElementById('mcq-letter');
    const textDiv = document.getElementById('mcq-text');
    
    // Check if we're displaying a loading state
    if (answer === '...' || answer === '?') {
        letterDiv.textContent = answer;
        textDiv.textContent = '';
        mcqBox.style.width = '70px';
    } else {
        // Parse answer to extract letter and text
        let optionLetter = '';
        let optionText = '';
        
        if (answer.includes(':')) {
            // Format expected: "A: This is the option text"
            const parts = answer.split(':');
            optionLetter = parts[0].trim().toUpperCase();
            optionText = parts.slice(1).join(':').trim();
        } else {
            // Fallback to old format - just try to extract the letter
            const match = answer.match(/[ABCD]/i);
            if (match) {
                optionLetter = match[0].toUpperCase();
                optionText = answer.replace(match[0], '').trim();
            } else {
                optionLetter = '?';
                optionText = answer;
            }
        }
        
        letterDiv.textContent = optionLetter;
        textDiv.textContent = optionText;
        mcqBox.style.width = '300px';
    }
    
    // Make sure it's visible
    mcqBox.style.display = 'block';
    
    console.log('✅ MCQ Answer displayed in box');
}

// Function to get the MCQ answer from Gemini
async function getMCQAnswer(question) {
    if (!question || question.trim().length === 0) {
        console.log('❌ Empty MCQ question received');
        return null;
    }
    
    // Show a loading message
    displayMCQAnswer('...');
    
    // Request MCQ answer from background script
    chrome.runtime.sendMessage({
        action: 'getMCQAnswer',
        question: question
    }, (response) => {
        if (response && response.answer) {
            displayMCQAnswer(response.answer);
        } else {
            displayMCQAnswer('?');
        }
    });
}

// Add event listener for Alt+S
document.addEventListener('keydown', function(event) {
    if (event.altKey && event.key.toLowerCase() === 's') {
        console.log('Alt+S detected');
        event.preventDefault();
        
        // Get selected text for MCQ question
        const selectedText = window.getSelection().toString().trim();
        
        if (selectedText) {
            getMCQAnswer(selectedText);
        } else {
            // Alert user to select text first
            alert('Please select an MCQ question to get the answer.');
        }
    }
});

// Add event listener for Alt+X to toggle code box
document.addEventListener('keydown', function(event) {
    if (event.altKey && event.key.toLowerCase() === 'x') {
        console.log('Alt+X detected');
        event.preventDefault();
        
        // Toggle code box if it exists
        if (codeBox) {
            if (codeBox.style.display === 'none') {
                codeBox.style.display = 'block';
                console.log('Code box shown with Alt+X');
            } else {
                codeBox.style.display = 'none';
                console.log('Code box hidden with Alt+X');
            }
        } else {
            console.log('No code box exists yet. Use Alt+C first to generate code.');
        }
    }
});

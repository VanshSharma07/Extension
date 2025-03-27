let selectedText = '';
let answerBox = null;

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

document.addEventListener('mouseup', function() {
    selectedText = window.getSelection().toString().trim();
    console.log('🔍 Text selected:', selectedText);
});

// Listen for keydown events
document.addEventListener('keydown', async function(event) {
    if (event.altKey && event.key === 's') {
        event.preventDefault(); // Prevent default action
        if (selectedText) {
            console.log('📝 Selected Question:', selectedText);
            // Send a message to the background script to get the answer
            chrome.runtime.sendMessage({ action: 'getAnswer', question: selectedText }, (response) => {
                if (response && response.answer) {
                    console.log('✅ Generated Answer:', response.answer);
                    // Display the answer in a box
                    displayAnswer(response.answer);
                } else {
                    console.log('❌ No answer generated');
                    displayAnswer("Sorry, I couldn't generate an answer.");
                }
            });
        } else {
            console.log('❌ No text selected');
            displayAnswer("Please select some text first.");
        }
    }
});

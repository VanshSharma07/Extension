let selectedText = '';

// Function to send the answer to the API endpoint
function sendAnswerToAPI(answer) {
    fetch('https://extensionapp-20t3.onrender.com/receiveData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: answer,
            author: "User"
        }),
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    })
    .then(data => {
        console.log('✅ Answer sent to API:', data);
    })
    .catch(error => {
        console.error('❌ Error sending answer to API:', error);
    });
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
                    // Send the answer to the API endpoint
                    sendAnswerToAPI(response.answer);
                } else {
                    console.log('❌ No answer generated');
                }
            });
        } else {
            console.log('❌ No text selected');
        }
    }
});

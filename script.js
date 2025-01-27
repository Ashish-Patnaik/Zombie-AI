const bar = document.querySelector(".message input");
const send = document.querySelector(".message button");
const robo = document.querySelector(".chat");
const heading = document.getElementById("heading");
const backendUrl = "https://chatbot-backend-o71u.onrender.com/api/chat";

function addLoadingIndicator() {
    const loadingHTML = `
      <div class="bot typing-indicator">
        <img class="bac" src="zombie.png">
        <div class="dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
    `;
    robo.insertAdjacentHTML('beforeend', loadingHTML);
    return robo.lastElementChild;
}

function removeLoadingIndicator(indicator) {
    if (indicator && indicator.parentNode) {
        indicator.remove();
    }
}

send.onclick = function() {
    if (bar.value.length > 0) {
        const userMessage = `
            <div class="user">
                <img class="pic" src="devil.png">
                <span>${bar.value}</span>
            </div>
        `;
        robo.insertAdjacentHTML('beforeend', userMessage);

        // Shrink or hide the heading
        heading.style.fontSize = '44px';
        heading.style.opacity = '0.5';

        // Add loading indicator
        const loadingIndicator = addLoadingIndicator();

        // Scroll to bottom
        robo.scrollTop = robo.scrollHeight;

        // Fetch response from backend API with correct format
        fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: bar.value  // Changed this line to match backend expectations
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Remove loading indicator
            removeLoadingIndicator(loadingIndicator);

            // Changed this to match the backend response format
            const botResponse = data.response;  // Changed this line
            
            const responseHTML = `
                <div class="bot">
                    <img class="bac" src="zombie.png">
                    <span>${botResponse}</span>
                </div>
            `;
            robo.insertAdjacentHTML('beforeend', responseHTML);
            robo.scrollTop = robo.scrollHeight;
        })
        .catch(error => {
            // Remove loading indicator
            removeLoadingIndicator(loadingIndicator);

            console.error("Error fetching response from backend:", error);
            const errorHTML = `
                <div class="bot">
                    <img class="bac" src="zombie.png">
                    <span>Error: Could not get a response. Please try again.</span>
                </div>
            `;
            robo.insertAdjacentHTML('beforeend', errorHTML);
            robo.scrollTop = robo.scrollHeight;
        });

        // Clear the input field
        bar.value = '';
    }
};
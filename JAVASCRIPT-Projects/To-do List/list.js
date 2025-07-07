const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
    const taskText = inputBox.value.trim();
    
    if(taskText === ''){
        // Enhanced alert with better styling
        showNotification("Please enter a task!", "error");
        inputBox.focus();
        inputBox.style.animation = "shake 0.5s ease-in-out";
        setTimeout(() => {
            inputBox.style.animation = "";
        }, 500);
        return;
    }
    
    // Check for duplicate tasks
    const existingTasks = Array.from(listContainer.children).map(li => 
        li.firstChild.textContent.trim().toLowerCase()
    );
    
    if(existingTasks.includes(taskText.toLowerCase())) {
        showNotification("This task already exists!", "warning");
        inputBox.focus();
        return;
    }
    
    let li = document.createElement("li");
    li.innerHTML = taskText;
    
    // Add a subtle entrance animation
    li.style.opacity = "0";
    li.style.transform = "translateX(-20px)";
    
    listContainer.appendChild(li);
    
    let span = document.createElement("span");
    span.innerHTML = "\u00d7"; // Unicode for multiplication sign (×)
    span.title = "Delete task";
    li.appendChild(span);
    
    // Trigger entrance animation
    setTimeout(() => {
        li.style.opacity = "1";
        li.style.transform = "translateX(0)";
    }, 10);
    
    inputBox.value = "";
    saveData();
    showNotification("Task added successfully!", "success");
}

// Enhanced notification system
function showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideInNotification 0.3s ease-out;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Set background color based on type
    const colors = {
        success: 'linear-gradient(135deg, #2ecc71, #27ae60)',
        error: 'linear-gradient(135deg, #e74c3c, #c0392b)',
        warning: 'linear-gradient(135deg, #f39c12, #e67e22)',
        info: 'linear-gradient(135deg, #3498db, #2980b9)'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = "slideOutNotification 0.3s ease-in forwards";
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInNotification {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutNotification {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

listContainer.addEventListener("click", function(e){
    // Check if clicked on LI directly or its text content
    let targetLi = e.target;
    if(e.target.tagName !== "LI" && e.target.tagName !== "SPAN") {
        targetLi = e.target.closest("li");
    }
    
    if(targetLi && targetLi.tagName === "LI" && e.target.tagName !== "SPAN"){
        targetLi.classList.toggle("checked");
        const isChecked = targetLi.classList.contains("checked");
        
        // Add completion animation
        if(isChecked) {
            showNotification("Task completed! 🎉", "success");
            targetLi.style.animation = "checkTask 0.5s ease-out";
        } else {
            showNotification("Task unmarked", "info");
        }
        
        saveData();
    }
    else if(e.target.tagName === "SPAN"){
        const taskText = e.target.parentElement.firstChild.textContent.trim();
        
        // Add deletion animation
        e.target.parentElement.style.animation = "slideOutTask 0.3s ease-in forwards";
        
        setTimeout(() => {
            e.target.parentElement.remove();
            saveData();
            showNotification(`Task "${taskText}" deleted`, "info");
        }, 300);
    }
}, false);

// Add Enter key support for input
inputBox.addEventListener("keypress", function(e) {
    if(e.key === "Enter") {
        addTask();
    }
});

// Add task counter
function updateTaskCounter() {
    const totalTasks = listContainer.children.length;
    const completedTasks = listContainer.querySelectorAll('.checked').length;
    const pendingTasks = totalTasks - completedTasks;
    
    // Update or create counter element
    let counter = document.querySelector('.task-counter');
    if (!counter) {
        counter = document.createElement('div');
        counter.className = 'task-counter';
        counter.style.cssText = `
            text-align: center;
            margin-top: 20px;
            padding: 15px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.6));
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(10px);
            color: #2c3e50;
            font-weight: 500;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        `;
        document.querySelector('.todo-app').appendChild(counter);
    }
    
    if (totalTasks === 0) {
        counter.style.display = 'none';
    } else {
        counter.style.display = 'block';
        counter.innerHTML = `
            <span style="color: #667eea;">📋 Total: ${totalTasks}</span> | 
            <span style="color: #2ecc71;">✅ Completed: ${completedTasks}</span> | 
            <span style="color: #e74c3c;">⏳ Pending: ${pendingTasks}</span>
        `;
    }
}

function saveData(){
    localStorage.setItem("data", listContainer.innerHTML);
    updateTaskCounter();
}

function showTask(){
    const savedData = localStorage.getItem("data");
    if (savedData) {
        listContainer.innerHTML = savedData;
    }
    updateTaskCounter();
}

// Enhanced initialization
function initializeApp() {
    showTask();
    
    // Add welcome message for first-time users
    if (!localStorage.getItem("data") || listContainer.children.length === 0) {
        setTimeout(() => {
            showNotification("Welcome! Start by adding your first task above 👆", "info");
        }, 1000);
    }
    
    // Focus on input for better UX
    inputBox.focus();
}

// Add additional CSS animations
const additionalStyle = document.createElement('style');
additionalStyle.textContent = `
    @keyframes slideOutTask {
        from {
            opacity: 1;
            transform: translateX(0);
            max-height: 60px;
            margin-bottom: 8px;
            padding: 18px 12px 18px 55px;
        }
        to {
            opacity: 0;
            transform: translateX(-100%);
            max-height: 0;
            margin-bottom: 0;
            padding: 0 12px 0 55px;
        }
    }
    
    .todo-app {
        animation: slideIn 0.6s ease-out;
    }
    
    /* Add subtle pulse for pending tasks */
    ul li:not(.checked):hover {
        animation: subtlePulse 0.3s ease-in-out;
    }
    
    @keyframes subtlePulse {
        0%, 100% { transform: scale(1) translateX(8px); }
        50% { transform: scale(1.02) translateX(8px); }
    }
    
    /* Improve mobile responsiveness */
    @media (max-width: 480px) {
        .todo-app {
            margin: 50px auto 20px;
            padding: 30px 20px 50px;
        }
        
        .todo-app h2 {
            font-size: 28px;
        }
        
        button {
            padding: 16px 35px;
            font-size: 14px;
        }
        
        ul li {
            padding: 16px 10px 16px 50px;
            font-size: 16px;
        }
        
        .notification {
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;
document.head.appendChild(additionalStyle);

// Initialize the app
initializeApp();
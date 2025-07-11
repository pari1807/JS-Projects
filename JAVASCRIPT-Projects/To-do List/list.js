// Get references to HTML elements
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Function to add a new task
function addTask() {
    const taskText = inputBox.value.trim();
    
    // Check if input is empty
    if(taskText === ''){
        alert("Please enter a task!");
        return;
    }
    
    // Create new list item
    let li = document.createElement("li");
    li.innerHTML = taskText;
    listContainer.appendChild(li);
    
    // Create delete button
    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);
    
    // Clear input and save
    inputBox.value = "";
    saveData();
}

// Handle clicks on tasks and delete buttons
listContainer.addEventListener("click", function(e){
    // If clicked on task text, toggle completed state
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked");
        saveData();
    }
    // If clicked on delete button, remove task
    else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
        saveData();
    }
});

// Allow Enter key to add tasks
inputBox.addEventListener("keypress", function(e) {
    if(e.key === "Enter") {
        addTask();
    }
});

// Save tasks to browser storage
function saveData(){
    localStorage.setItem("data", listContainer.innerHTML);
}

// Load saved tasks when page loads
function showTask(){
    const savedData = localStorage.getItem("data");
    if (savedData) {
        listContainer.innerHTML = savedData;
    }
}

// Load tasks when page starts
showTask();
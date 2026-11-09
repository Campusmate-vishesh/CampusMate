/* =========================
   TASK SYSTEM
========================= */

let tasks = [];
let savedTasks = localStorage.getItem("campusTasks");

if (savedTasks) {
    tasks = JSON.parse(savedTasks);
}

function openTasks() {
    document.getElementById("tasksSection").scrollIntoView({
        behavior: "smooth"
    });
}

function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
    id: Date.now(),
    text: taskText,
    deadline: document.getElementById("taskDeadlineInput").value,
    completed: false
};

    tasks.push(task);

localStorage.setItem("campusTasks", JSON.stringify(tasks));

input.value = "";
document.getElementById("taskDeadlineInput").value = "";

displayTasks();
updateStats();
updateDashboardCounts();
updateNotifications();
}

function displayTasks() {
    const taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    const searchText = document
    .getElementById("taskSearch")
    .value.trim().toLowerCase();

const visibleTasks = tasks.filter(function(task) {
    return task.text.toLowerCase().includes(searchText);
});
if (visibleTasks.length === 0) {
    const message = document.createElement("li");

    message.className = "task-empty";
    message.textContent = searchText
        ? "No matching tasks found."
        : "No tasks yet. Add your first task!";

    taskList.appendChild(message);
    return;
}

visibleTasks.forEach(function(task) {
        const li = document.createElement("li");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span class="task-text">
                ${task.text}
            </span>
            <span class="task-deadline">
    ${
        task.deadline
        ? "📅 Due: " + formatDate(task.deadline)
        : ""
    }
</span>
            

            <div class="task-actions">

    ${
        task.completed
        ? '<span class="completed-status">🟢 Completed</span>'
        : `<button
            class="complete-btn"
            onclick="completeTask(${task.id})">
            Complete
          </button>`
    }

    <button
        class="delete-btn"
        onclick="deleteTask(${task.id})">
        Delete
    </button>

</div>

        `;

        taskList.appendChild(li);
    });
}

function completeTask(id) {
    const task = tasks.find(function(task) {
        return task.id === id;
    });

    if (task) {
    task.completed = !task.completed;
}

localStorage.setItem("campusTasks", JSON.stringify(tasks));

displayTasks();
updateStats();
updateDashboardCounts();
updateNotifications();
}

function deleteTask(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
        return;
    }

    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    localStorage.setItem(
        "campusTasks",
        JSON.stringify(tasks)
    );
displayTasks();
updateStats();
updateDashboardCounts();
updateNotifications();
}

function updateStats() {
    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const pending = total - completed;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
}


function updateProductivityDashboard() {
    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const pending = total - completed;

    const totalElement = document.getElementById("productivityTotal");
    const completedElement = document.getElementById("productivityCompleted");
    const pendingElement = document.getElementById("productivityPending");
    const progressBar = document.getElementById("productivityProgressBar");
    const progressText = document.getElementById("productivityProgressText");

    if (!totalElement || !completedElement || !pendingElement ||
        !progressBar || !progressText) {
        return;
    }

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    totalElement.textContent = total;
    completedElement.textContent = completed;
    pendingElement.textContent = pending;
    progressBar.style.width = percentage + "%";
    progressText.textContent = percentage + "% completed";
}

updateProductivityDashboard();


/* =========================
   EXAM SYSTEM
========================= */

let exams = [];
let savedExams = localStorage.getItem("campusExams");

if (savedExams) {
    exams = JSON.parse(savedExams);
}

function openExams() {
    document.getElementById("examsSection").scrollIntoView({
        behavior: "smooth"
    });
}

function addExam() {
    const subjectInput = document.getElementById("subjectInput");
    const dateInput = document.getElementById("examDateInput");

    const subject = subjectInput.value.trim();
    const date = dateInput.value;

    if (subject === "" || date === "") {
        alert("Please enter subject and exam date.");
        return;
    }

    const exam = {
        id: Date.now(),
        subject: subject,
        date: date,
        completed: false
    };

    exams.push(exam);

localStorage.setItem("campusExams", JSON.stringify(exams));

subjectInput.value = "";
    dateInput.value = "";

displayExams();
updateExamStats();
updateDashboardCounts();
updateNotifications();
}

function displayExams() {
    const examList = document.getElementById("examList");

    examList.innerHTML = "";

const searchText = document
    .getElementById("examSearch")
    .value.trim().toLowerCase();

const sortedExams = [...exams]
    .filter(function(exam) {
        return exam.subject.toLowerCase().includes(searchText);
    })
    .sort(function(a, b) {
        return a.date.localeCompare(b.date);
    });
    if (sortedExams.length === 0) {
    const message = document.createElement("div");

    message.className = "exam-empty";
    message.textContent = searchText
        ? "No matching exams found."
        : "No exams added yet.";

    examList.appendChild(message);
    return;
}

sortedExams.forEach(function(exam) {
        const div = document.createElement("div");

        div.className = "exam-card";

        if (exam.completed) {
            div.classList.add("exam-completed");
        }

        const daysLeft = calculateDaysLeft(exam.date);

        let countdownText = "";

        if (exam.completed) {
            countdownText = "✅ Exam Completed";
        } else if (daysLeft > 0) {
            countdownText = "⏳ " + daysLeft + " days left";
        } else if (daysLeft === 0) {
            countdownText = "🔥 Exam is Today!";
        } else {
            countdownText = "⚠️ Exam date passed";
        }

        div.innerHTML = `
            <div class="exam-info">

                <h3>📝 ${exam.subject}</h3>

                <p>
                    📅 Exam Date:
                    ${formatDate(exam.date)}
                </p>

                <p class="days-left">
                    ${countdownText}
                </p>

            </div>

            <div class="exam-actions">

                <label class="done-label">

                    <input
                        type="checkbox"
                        ${exam.completed ? "checked" : ""}
                        onchange="toggleExamDone(${exam.id})"
                    >

                    Exam Done

                </label>

                <button
                    class="exam-delete"
                    onclick="deleteExam(${exam.id})">
                    Delete
                </button>

            </div>
        `;

        examList.appendChild(div);
    });
}

function calculateDaysLeft(dateString) {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const examDate = new Date(dateString + "T00:00:00");

    examDate.setHours(0, 0, 0, 0);

    const difference = examDate - today;

    return Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    );
}

function toggleExamDone(id) {
    const exam = exams.find(function(exam) {
        return exam.id === id;
    });

if (exam) {
    exam.completed = !exam.completed;
}

localStorage.setItem("campusExams", JSON.stringify(exams));

displayExams();
updateExamStats();
updateDashboardCounts();
updateNotifications();
}

function deleteExam(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this exam?"
    );

    if (!confirmDelete) {
        return;
    }

    exams = exams.filter(function(exam) {
        return exam.id !== id;
    });

localStorage.setItem("campusExams", JSON.stringify(exams));

displayExams();
updateExamStats();
updateDashboardCounts();
updateNotifications();
}

function updateExamStats() {
    const total = exams.length;

    const upcoming = exams.filter(function(exam) {
        return !exam.completed &&
               calculateDaysLeft(exam.date) >= 0;
    }).length;

    document.getElementById("totalExams").textContent = total;
    document.getElementById("upcomingExams").textContent = upcoming;
}


/* =========================
   DATE FORMAT
========================= */

function formatDate(dateString) {
    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


/* =========================
   TIMETABLE SYSTEM
========================= */

let timetable = [];
let savedTimetable = localStorage.getItem("campusTimetable");

if (savedTimetable) {
    timetable = JSON.parse(savedTimetable);
}

function openTimetable() {
    document.getElementById("timetableSection").scrollIntoView({
        behavior: "smooth"
    });
}


/* =========================
   AUTO DAY FROM DATE
========================= */

function updateDay() {
    const dateInput = document.getElementById("dateInput");
    const selectedDay = document.getElementById("selectedDay");

    if (!dateInput || !selectedDay) {
        return;
    }

    if (dateInput.value === "") {
        selectedDay.value = "";
        return;
    }

    const date = new Date(
        dateInput.value + "T00:00:00"
    );

    selectedDay.value = date.toLocaleDateString(
        "en-IN",
        {
            weekday: "long"
        }
    );
}


/* =========================
   ADD CLASS
========================= */

function addClass() {

    const date =
        document.getElementById("dateInput").value;

    const day =
        document.getElementById("selectedDay").value;

    const subject =
        document.getElementById("classInput").value.trim();

    const time =
        document.getElementById("timeInput").value;

    const room =
        document.getElementById("roomInput").value.trim();


    if (date === "" || subject === "" || time === "") {
        alert("Please select date, subject and time.");
        return;
    }


    const classData = {

        id: Date.now(),

        date: date,

        day: day,

        subject: subject,

        time: time,

        room: room

    };


    timetable.push(classData);

localStorage.setItem("campusTimetable", JSON.stringify(timetable));

displayTimetable();
updateDashboardCounts();
updateNotifications();



    document.getElementById("dateInput").value = "";
    document.getElementById("selectedDay").value = "";
    document.getElementById("classInput").value = "";
    document.getElementById("timeInput").value = "";
    document.getElementById("roomInput").value = "";
}


/* =========================
   DISPLAY TIMETABLE
========================= */

function displayTimetable() {

    const list =
        document.getElementById("timetableList");

    list.innerHTML = "";


const searchText = document
    .getElementById("timetableSearch")
    .value.trim().toLowerCase();

const sortedClasses = [...timetable]
    .filter(function(classData) {
        return (
            classData.subject.toLowerCase().includes(searchText) ||
            (classData.room || "").toLowerCase().includes(searchText) ||
            (classData.day || "").toLowerCase().includes(searchText)
        );
    })
    .sort(function(a, b) {
        const dateOrder = a.date.localeCompare(b.date);

        if (dateOrder !== 0) {
            return dateOrder;
        }

        return a.time.localeCompare(b.time);
    });
    if (sortedClasses.length === 0) {
    const message = document.createElement("div");

    message.className = "timetable-empty";
    message.textContent = searchText
        ? "No matching classes found."
        : "No classes added yet.";

    list.appendChild(message);
    return;
}

    sortedClasses.forEach(function(classData) {

        const div =
            document.createElement("div");

        div.className = "class-card";


        div.innerHTML = `

            <div class="class-info">

                <h3>
                    📚 ${classData.subject}
                </h3>

                <p>
                    📅 ${formatDate(classData.date)}
                </p>

                <p>
                    📆 ${classData.day}
                </p>

                <p>
                    🕐 ${formatTime(classData.time)}
                </p>

                <p>
                    🏫 ${classData.room || "Room not added"}
                </p>

            </div>


            <button
                class="class-delete"
                onclick="deleteClass(${classData.id})">

                Delete

            </button>

        `;


        list.appendChild(div);

    });

}


/* =========================
   DELETE CLASS
========================= */

function deleteClass(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this class?"
    );

    if (!confirmDelete) {
        return;
    }

    timetable = timetable.filter(function(classData) {
        return classData.id !== id;
    });

localStorage.setItem("campusTimetable", JSON.stringify(timetable));

displayTimetable();
updateDashboardCounts();
updateNotifications();
}


/* =========================
   FORMAT TIME
========================= */

function formatTime(time) {

    const [hours, minutes] =
        time.split(":");

    const date = new Date();

    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));
    date.setSeconds(0);


    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


/* =========================
   OLD TEST
========================= */

function showMessage(section) {

    alert("You opened " + section);

}


/* =========================
   INITIAL DISPLAY
========================= */

displayTasks();
updateStats();

displayExams();
updateExamStats();

displayTimetable();

setTimeout(function() {
    updateNotifications();
}, 0);


/* =========================
   NOTES SYSTEM
========================= */

let notes = [];
let savedNotes = localStorage.getItem("campusNotes");

if (savedNotes) {
    notes = JSON.parse(savedNotes);
}

function openNotes() {
    document.getElementById("notesSection").scrollIntoView({
        behavior: "smooth"
    });
}

function addNote() {
    const titleInput = document.getElementById("noteTitle");
    const textInput = document.getElementById("noteText");

    const title = titleInput.value.trim();
    const text = textInput.value.trim();

    if (title === "" || text === "") {
        alert("Please enter note title and note.");
        return;
    }

    const category = prompt(
    "Enter category: Maths, Physics, C Programming, Communication or Other"
);

if (!category || category.trim() === "") {
    return;
}

const note = {
    id: Date.now(),
    title: title,
    text: text,
    category: category.trim()
};

    notes.push(note);

    localStorage.setItem(
        "campusNotes",
        JSON.stringify(notes)
    );

    titleInput.value = "";
    textInput.value = "";

    displayNotes();
updateDashboardCounts();
}

function displayNotes() {

    const notesList = document.getElementById("notesList");

    notesList.innerHTML = "";

    const searchText = document
        .getElementById("notesSearch")
        .value
        .trim()
        .toLowerCase();

    const categoryFilter =
    document.getElementById("notesCategoryFilter").value;

const visibleNotes = notes
    .filter(function(note) {
        return (
            (
                note.title.toLowerCase().includes(searchText) ||
                note.text.toLowerCase().includes(searchText)
            ) &&
            (
                categoryFilter === "all" ||
            (note.category || "Other").trim().toLowerCase() === categoryFilter.trim().toLowerCase()
            )
        );
    })
    .sort(function(a, b) {
        return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
    });

    if (visibleNotes.length === 0) {

        const message = document.createElement("div");

        message.className = "notes-empty";

        message.textContent = searchText
            ? "No matching notes found."
            : "No notes added yet.";

        notesList.appendChild(message);

        return;
    }

    visibleNotes.forEach(function(note) {

        const div = document.createElement("div");

        div.className = "note-card";

        div.innerHTML = `
            <div class="note-info">

                <h3>📌 ${note.title}</h3>

                <p>${note.text}</p>
            <p>📚 Category: ${note.category || "Other"}</p>

            </div>

            <button
    class="note-pin"
    onclick="togglePinNote(${note.id})">
    ${note.pinned ? "📌 Unpin" : "📌 Pin"}
</button>

            <button
                class="note-edit"
                onclick="editNote(${note.id})">
                Edit
            </button>

            <button
                class="note-delete"
                onclick="deleteNote(${note.id})">
                Delete
            </button>
        `;

        notesList.appendChild(div);
    });
}

function togglePinNote(id) {

    const note = notes.find(function(note) {
        return note.id === id;
    });

    if (!note) {
        return;
    }

    note.pinned = !note.pinned;

    localStorage.setItem(
        "campusNotes",
        JSON.stringify(notes)
    );

    displayNotes();
}

function editNote(id) {

    const note = notes.find(function(note) {
        return note.id === id;
    });

    if (!note) {
        return;
    }

    document.getElementById("editNoteTitle").value =
        note.title;

    document.getElementById("editNoteText").value =
        note.text;

    document.getElementById("editNoteForm").style.display =
        "block";

    document.getElementById("editNoteForm").dataset.id =
        id;
}

function saveEditedNote() {

    const form =
        document.getElementById("editNoteForm");

    const id =
        Number(form.dataset.id);

    const note =
        notes.find(function(note) {
            return note.id === id;
        });

    if (!note) {
        return;
    }

    const newTitle =
        document.getElementById("editNoteTitle").value.trim();

    const newText =
        document.getElementById("editNoteText").value.trim();

    if (newTitle === "" || newText === "") {
        alert("Title and note cannot be empty.");
        return;
    }

    note.title = newTitle;
    note.text = newText;

    localStorage.setItem(
        "campusNotes",
        JSON.stringify(notes)
    );

    form.style.display = "none";

    displayNotes();
}

function cancelEdit() {

    document.getElementById("editNoteForm").style.display =
        "none";
}

function deleteNote(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) {
        return;
    }

    notes = notes.filter(function(note) {
        return note.id !== id;
    });

    localStorage.setItem(
        "campusNotes",
        JSON.stringify(notes)
    );

    displayNotes();
updateDashboardCounts();
}

/* =========================
   ENTER KEY SUPPORT
========================= */

const taskInput = document.getElementById("taskInput");
if (taskInput) {
    taskInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addTask();
        }
    });
}

const subjectInput = document.getElementById("subjectInput");
if (subjectInput) {
    subjectInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addExam();
        }
    });
}

const noteTitle = document.getElementById("noteTitle");
if (noteTitle) {
    noteTitle.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addNote();
        }
    });
}

const classInput = document.getElementById("classInput");
if (classInput) {
    classInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addClass();
        }
    });
}
document.getElementById("taskSearch").addEventListener("input", function() {
    displayTasks();
});
document.getElementById("examSearch").addEventListener("input", function() {
    displayExams();
});
document.getElementById("timetableSearch").addEventListener("input", function() {
    displayTimetable();
});

document.getElementById("notesSearch").addEventListener("input", function() {
    displayNotes();
});
document.getElementById("notesCategoryFilter").addEventListener("change", function() {
    displayNotes();
});
/* =========================
   DASHBOARD COUNTS
========================= */

function updateDashboardCounts() {

    const pendingTasks = tasks.filter(function(task) {
    return !task.completed;
}).length;

document.getElementById("dashboardTaskCount").textContent =
    pendingTasks + (pendingTasks === 1 ? " Task" : " Tasks");

    const upcoming = exams.filter(function(exam) {
        return !exam.completed &&
               calculateDaysLeft(exam.date) >= 0;
    }).length;

    document.getElementById("dashboardExamCount").textContent =
        upcoming + (upcoming === 1 ? " Upcoming Exam" : " Upcoming Exams");

    document.getElementById("dashboardClassCount").textContent =
        timetable.length + (timetable.length === 1 ? " Class" : " Classes");

    document.getElementById("dashboardNoteCount").textContent =
        notes.length + (notes.length === 1 ? " Note" : " Notes");
            updateProductivityDashboard();
}

updateDashboardCounts();
const savedTheme = localStorage.getItem("campusTheme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    document.getElementById("themeButton").textContent = "☀️ Light Mode";
}
/* =========================
   THEME SYSTEM
========================= */

function toggleTheme() {

    document.body.classList.toggle("dark-theme");

    const button = document.getElementById("themeButton");

    if (document.body.classList.contains("dark-theme")) {
        button.textContent = "☀️ Light Mode";
    } else {
        button.textContent = "🌙 Dark Mode";
    }
        localStorage.setItem(
        "campusTheme",
        document.body.classList.contains("dark-theme") ? "dark" : "light"
    );
}

/* =========================
   SMART NOTIFICATIONS
========================= */

function openNotifications() {
    document.getElementById("notificationsSection").scrollIntoView({
        behavior: "smooth"
    });
}


/* =========================
   OPEN NOTIFICATION TARGET
========================= */

function openNotificationTarget(type) {

    if (type === "exam") {
        openExams();
    }

    else if (type === "task") {
        openTasks();
    }

    else if (type === "class") {
        openTimetable();
    }

    else {
        openNotifications();
    }
}


/* =========================
   UPDATE NOTIFICATIONS
========================= */

function updateNotifications() {

    const notificationList =
        document.getElementById("notificationList");

    const notificationCount =
        document.getElementById("notificationCount");

    if (!notificationList || !notificationCount) {
        return;
    }

    let notifications = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);


    /* =========================
       EXAM REMINDERS
    ========================= */

    exams.forEach(function(exam) {

        if (exam.completed) {
            return;
        }

        const examDate =
            new Date(exam.date + "T00:00:00");

        examDate.setHours(0, 0, 0, 0);

        const difference =
            Math.ceil(
                (examDate - today) /
                (1000 * 60 * 60 * 24)
            );


        if (difference === 0) {

            notifications.push({
                type: "exam",
                icon: "🔥",
                title: "Exam Today",
                text: exam.subject,
                priority: "urgent"
            });

        } else if (difference === 1) {

            notifications.push({
                type: "exam",
                icon: "⚠️",
                title: "Exam Tomorrow",
                text: exam.subject,
                priority: "warning"
            });

        } else if (difference > 1 && difference <= 3) {

            notifications.push({
                type: "exam",
                icon: "📚",
                title: "Upcoming Exam",
                text: exam.subject + " in " + difference + " days",
                priority: "normal"
            });
        }

    });


    /* =========================
       CLASS REMINDERS
    ========================= */

    timetable.forEach(function(classData) {

        const classDate =
            new Date(classData.date + "T00:00:00");

        classDate.setHours(0, 0, 0, 0);

        const difference =
            Math.ceil(
                (classDate - today) /
                (1000 * 60 * 60 * 24)
            );


        if (difference === 0) {

            notifications.push({
                type: "class",
                icon: "🏫",
                title: "Class Today",
                text:
                    classData.subject +
                    " at " +
                    formatTime(classData.time),
                priority: "urgent"
            });

        } else if (difference === 1) {

            notifications.push({
                type: "class",
                icon: "📅",
                title: "Class Tomorrow",
                text:
                    classData.subject +
                    " at " +
                    formatTime(classData.time),
                    priority: "warning"
                
            });

        }

    });


    /* =========================
       TASK REMINDERS
    ========================= */

    tasks.forEach(function(task) {

        if (task.completed || !task.deadline) {
            return;
        }

        const taskDate =
            new Date(task.deadline + "T00:00:00");

        taskDate.setHours(0, 0, 0, 0);

        const difference =
            Math.ceil(
                (taskDate - today) /
                (1000 * 60 * 60 * 24)
            );


        if (difference === 0) {

            notifications.push({
                type: "task",
                icon: "🔥",
                title: "Task Due Today",
                text: task.text,
                priority: "urgent"
            });

        } else if (difference === 1) {

            notifications.push({
                type: "task",
                icon: "⚠️",
                title: "Task Due Tomorrow",
                text: task.text,
                priority: "warning"
            });

        } else if (difference > 1 && difference <= 3) {

            notifications.push({
                type: "task",
                icon: "📌",
                title: "Upcoming Task",
                text:
                    task.text +
                    " in " +
                    difference +
                    " days",
                priority: "normal"
            });

        }

    });


    /* =========================
       DISPLAY
    ========================= */
notifications.sort(function(a, b) {
    const priorityOrder = {
        urgent: 1,
        warning: 2,
        normal: 3
    };

    return priorityOrder[a.priority] - priorityOrder[b.priority];
});
    notificationList.innerHTML = "";


    if (notifications.length === 0) {
        

        notificationList.innerHTML = `
            <div class="notification-empty">
                <div class="notification-empty-icon">✅</div>
                <strong>You're all caught up!</strong>
                <p>No important notifications right now.</p>
            </div>
        `;

    } else {

        notifications.forEach(function(notification) {

            const div =
                document.createElement("div");

            div.className =
                "notification-item " +
                notification.priority;

            div.onclick = function() {
                openNotificationTarget(
                    notification.type
                );
            };

            div.innerHTML = `
                <div class="notification-icon">
                    ${notification.icon}
                </div>

                <div class="notification-content">

                    <strong>
                        ${notification.title}
                    </strong>

                    <p>
                        ${notification.text}
                    </p>

                    <span class="notification-action">
                        Click to view →
                    </span>

                </div>
            `;

            notificationList.appendChild(div);

        });
    }


    /* =========================
       NOTIFICATION COUNT
    ========================= */

    if (notifications.length === 0) {

        notificationCount.textContent =
            "No Alerts";

    } else {

        notificationCount.textContent =
            notifications.length +
            (
                notifications.length === 1
                    ? " Alert"
                    : " Alerts"
            );
    }

}



/* =========================
   SMART STUDY PLANNER - v2.0
========================= */

function createStudyPlan() {

    const subject =
        document.getElementById("plannerSubject").value.trim();

    const examDate =
        document.getElementById("plannerExamDate").value;

    const level =
        document.getElementById("plannerLevel").value;

    const hours =
        Number(document.getElementById("plannerHours").value);

    const result =
        document.getElementById("studyPlanResult");

    if (
        subject === "" ||
        examDate === "" ||
        level === "" ||
        !hours
    ) {
        alert("Please fill all planner details.");
        return;
    }

    const daysLeft = calculateDaysLeft(examDate);

    if (daysLeft < 0) {
        alert("Please select a future exam date.");
        return;
    }

    let dailyHours = hours;

    if (level === "low") {
        dailyHours = Math.min(hours, 8);
    } else if (level === "medium") {
        dailyHours = Math.min(hours, 6);
    } else {
        dailyHours = Math.min(hours, 4);
    }

    let planHTML = `
        <div class="study-plan-card">

            <h3>📚 ${subject} — Smart Study Plan</h3>

            <p>
                📅 Exam Date:
                <strong>${formatDate(examDate)}</strong>
            </p>

            <p>
                ⏳ Days Remaining:
                <strong>${daysLeft} days</strong>
            </p>

            <p>
                ⏱️ Daily Study:
                <strong>${dailyHours} hours</strong>
            </p>

            <hr>

            <h3>🗓️ Day-by-Day Study Plan</h3>

            <div class="study-plan-days">
    `;

    if (daysLeft === 0) {

        planHTML += `
            <div class="planner-day">
                <strong>📖 TODAY</strong>
                <span>
                    Revise important topics, formulas and practice questions.
                </span>
                <small>
                    ⏱️ ${dailyHours} hours
                </small>
            </div>
        `;

    } else {

        for (let day = 1; day <= daysLeft; day++) {

            let focus;

            if (day === daysLeft) {

                focus = "🔄 Final Revision + Practice";

            } else if (day === 1) {

                focus = "📖 Start Syllabus + Important Topics";

            } else if (day <= Math.ceil(daysLeft / 2)) {

                focus = "📚 Learn New Topics";

            } else {

                focus = "📝 Practice + Revision";
            }

            planHTML += `
                <div class="planner-day">

                    <strong>
                        Day ${day}
                    </strong>

                    <span>
                        ${focus}
                    </span>

                    <small>
                        ⏱️ ${dailyHours} hours study
                    </small>

                </div>
            `;
        }
    }

    planHTML += `
            </div>

            <div class="planner-summary">

                <strong>🎯 Smart Strategy</strong>

                <p>
                    Study ${subject} for ${dailyHours} hours every day.
                    First learn the topics, then practice questions,
                    and keep the final day for revision.
                </p>

            </div>

        </div>
    `;

    result.innerHTML = planHTML;

    localStorage.setItem(
        "campusStudyPlan",
        JSON.stringify({
            subject: subject,
            examDate: examDate,
            level: level,
            hours: hours
        })
    );
}


/* =========================
   PLANNER ENTER KEY
========================= */

const plannerSubject =
    document.getElementById("plannerSubject");

if (plannerSubject) {

    plannerSubject.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                event.preventDefault();

                createStudyPlan();
            }
        }
    );
}

/* =========================
   AI ASSISTANT
========================= */

function askCampusAI() {

    const input = document.getElementById("aiUserInput");
    const messages = document.getElementById("aiChatMessages");

    const question = input.value.trim().toLowerCase();

    if (question === "") {
        return;
    }

    /* USER BUBBLE */

    const userMessage = document.createElement("div");

    userMessage.className = "ai-message ai-user";

    userMessage.innerHTML = `
        <span class="ai-name">👤 You</span>
        <div>${input.value}</div>
    `;

    messages.appendChild(userMessage);

    let answer = "";

    /* =========================
       COMBINED STUDY + TIMETABLE
    ========================= */

    if (
        (
            question.includes("padhai") ||
            question.includes("padhna") ||
            question.includes("study")
        ) &&
        (
            question.includes("aaj") ||
            question.includes("today") ||
            question.includes("timetable") ||
            question.includes("schedule") ||
            question.includes("class") ||
            question.includes("suggest")
        )
    ) {

        const today = new Date();

        const todayName = today.toLocaleDateString("en-US", {
            weekday: "long"
        });

        const todayClasses = timetable
            .filter(function(item) {
                return item.day === todayName;
            })
            .sort(function(a, b) {
                return a.time.localeCompare(b.time);
            });

        const pendingTasks = tasks.filter(function(task) {
            return !task.completed;
        });

        const upcomingExams = exams
            .filter(function(exam) {
                return !exam.completed &&
                       calculateDaysLeft(exam.date) >= 0;
            })
            .sort(function(a, b) {
                return new Date(a.date) - new Date(b.date);
            });

        answer = `
            🧠 <strong>Aaj ka Smart Study Suggestion</strong><br><br>
        `;

        /* TODAY'S CLASSES */

        if (todayClasses.length > 0) {

            answer += `
                📚 <strong>Aaj ki Classes</strong><br>
                ${todayClasses.map(function(item) {
                    return `
                        • ${item.subject}
                        — ${formatTime(item.time)}
                        ${item.room
                            ? " — Room " + item.room
                            : ""}
                    `;
                }).join("<br>")}
                <br><br>
            `;

        } else {

            answer += `
                📚 <strong>Aaj koi class nahi hai.</strong><br><br>
            `;
        }


        /* PENDING TASKS */

        if (pendingTasks.length > 0) {

            answer += `
                📋 <strong>Pending Tasks</strong><br>
                ${pendingTasks.slice(0, 5).map(function(task) {
                    return `• ${task.text}`;
                }).join("<br>")}
                <br><br>
            `;

        } else {

            answer += `
                📋 <strong>Koi pending task nahi hai.</strong><br><br>
            `;
        }


        /* NEAREST EXAM */

        if (upcomingExams.length > 0) {

            const nearestExam = upcomingExams[0];

            const daysLeft =
                calculateDaysLeft(nearestExam.date);

            answer += `
                📝 <strong>Nearest Exam</strong><br>
                • ${nearestExam.subject}
                — ${formatDate(nearestExam.date)}
                <br>
                ⏳ ${daysLeft === 0
                    ? "Exam is today!"
                    : daysLeft + " days left"}
                <br><br>
            `;

        } else {

            answer += `
                📝 <strong>Koi upcoming exam nahi hai.</strong><br><br>
            `;
        }


        /* STUDY RECOMMENDATION */

        if (upcomingExams.length > 0) {

            const nearestExam = upcomingExams[0];
            const daysLeft =
                calculateDaysLeft(nearestExam.date);

            answer += `
                🎯 <strong>Meri Recommendation</strong><br>
                Aaj <strong>${nearestExam.subject}</strong>
                ko priority do, kyunki ye tumhara nearest exam hai.
                <br><br>

                📖 Pehle important topics revise karo,
                phir practice questions solve karo.
            `;

        } else {

            answer += `
                🎯 <strong>Meri Recommendation</strong><br>
                Aaj apni pending tasks complete karo
                aur timetable ke subjects ko revise karo.
            `;
        }
    }


    /* =========================
       TASKS
    ========================= */

    else if (
        question.includes("task") ||
        question.includes("kaam") ||
        question.includes("work")
    ) {

        const pendingTasks = tasks.filter(function(task) {
            return !task.completed;
        });

        if (pendingTasks.length === 0) {

            answer = `
                <strong>🎉 Great!</strong><br>
                Tumhare abhi koi pending tasks nahi hain.
            `;

        } else {

            answer = `
                📋 Tumhare paas
                <strong>${pendingTasks.length}</strong>
                pending task${pendingTasks.length === 1 ? "" : "s"} hain.<br><br>

                ${pendingTasks.map(function(task) {
                    return `• ${task.text}`;
                }).join("<br>")}
            `;
        }
    }


    /* =========================
       EXAMS
    ========================= */

    else if (
        question.includes("exam") ||
        question.includes("paper") ||
        question.includes("test")
    ) {

        const upcomingExams = exams
            .filter(function(exam) {
                return !exam.completed;
            })
            .sort(function(a, b) {
                return new Date(a.date) - new Date(b.date);
            });

        if (upcomingExams.length === 0) {

            answer = `
                🎉 Abhi koi upcoming exam nahi hai.
            `;

        } else {

            answer = `
                📚 <strong>Upcoming Exams</strong><br><br>

                ${upcomingExams.slice(0, 5).map(function(exam) {
                    return `
                        • <strong>${exam.subject}</strong>
                        — ${formatDate(exam.date)}
                    `;
                }).join("<br>")}
            `;
        }
    }

        /* =========================
       SMART WHOLE DAY TIMETABLE
    ========================= */

    else if (
        question.includes("whole day") ||
        question.includes("full day") ||
        question.includes("day timetable") ||
        question.includes("timetable bana") ||
        question.includes("timetable suggest") ||
        question.includes("schedule bana") ||
        question.includes("schedule suggest") ||
        question.includes("routine bana") ||
        question.includes("study timetable")
    ) {

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const todayClasses = timetable
            .filter(function(item) {

                const classDate =
                    new Date(item.date + "T00:00:00");

                classDate.setHours(0, 0, 0, 0);

                return classDate.getTime() === today.getTime();
            })
            .sort(function(a, b) {
                return a.time.localeCompare(b.time);
            });

        const pendingTasks = tasks.filter(function(task) {
            return !task.completed;
        });

        const upcomingExams = exams
            .filter(function(exam) {
                return !exam.completed &&
                       calculateDaysLeft(exam.date) >= 0;
            })
            .sort(function(a, b) {
                return new Date(a.date) - new Date(b.date);
            });

        answer = `
            🧠 <strong>Your Smart Whole-Day Timetable</strong><br><br>
        `;

        /* CLASSES */

        if (todayClasses.length > 0) {

            answer += `
                📚 <strong>Today's Classes</strong><br>
                ${todayClasses.map(function(item) {
                    return `
                        • ${formatTime(item.time)}
                        — <strong>${item.subject}</strong>
                        ${item.room
                            ? " — Room " + item.room
                            : ""}
                    `;
                }).join("<br>")}
                <br><br>
            `;

        } else {

            answer += `
                📚 <strong>No classes today</strong><br>
                You have free time for study and tasks.<br><br>
            `;
        }


        /* PENDING TASKS */

        if (pendingTasks.length > 0) {

            answer += `
                📋 <strong>Priority Tasks</strong><br>
                ${pendingTasks.slice(0, 3).map(function(task) {
                    return `• ${task.text}`;
                }).join("<br>")}
                <br><br>
            `;

        }


        /* NEAREST EXAM */

        if (upcomingExams.length > 0) {

            const nearestExam = upcomingExams[0];

            answer += `
                📝 <strong>Nearest Exam</strong><br>
                • ${nearestExam.subject}
                — ${formatDate(nearestExam.date)}
                <br><br>
            `;
        }


        /* SUGGESTED DAY */

            

        answer += `
            🗓️ <strong>Suggested Study Schedule</strong><br><br>

            🌅 <strong>Morning</strong><br>
            • 8:00–9:00 → Important subject revision<br>
            • 9:00–10:00 → Study / Class<br><br>

            ☀️ <strong>Afternoon</strong><br>
            • 12:00–1:00 → Pending task work<br>
            • 1:00–2:00 → Lunch & Rest<br>
            • 2:00–3:00 → Exam preparation<br><br>

            🌆 <strong>Evening</strong><br>
            • 5:00–6:00 → Practice questions<br>
            • 6:00–7:00 → Break / Free time<br>
            • 7:00–8:00 → Dinner 🍽️<br><br>

            🌙 <strong>Night</strong><br>
            • 8:00–9:00 → Revision<br>
            • 9:00–9:15 → Plan tomorrow<br><br>

            🎯 <strong>Tip:</strong>
            Sabse pehle nearest exam aur urgent pending task ko priority do.
        `;
    }


    /* =========================
       CLASSES / TIMETABLE
    ========================= */

    else if (
        question.includes("class") ||
        question.includes("classes") ||
        question.includes("timetable") ||
        question.includes("schedule")
    ) {

        const today = new Date();

        const todayName = today.toLocaleDateString("en-US", {
            weekday: "long"
        });

        const tomorrow = new Date(today);

        tomorrow.setDate(
            tomorrow.getDate() + 1
        );

        const tomorrowName =
            tomorrow.toLocaleDateString("en-US", {
                weekday: "long"
            });


        /* TODAY */

                /* TODAY */

        if (
            question.includes("aaj") ||
            question.includes("today")
        ) {

            const todayClasses = timetable
                .filter(function(item) {
                    const itemDate = new Date(item.date + "T00:00:00");
                    itemDate.setHours(0, 0, 0, 0);

                    const todayDate = new Date();
                    todayDate.setHours(0, 0, 0, 0);

                    return itemDate.getTime() === todayDate.getTime();
                })
                .sort(function(a, b) {
                    return a.time.localeCompare(b.time);
                });



            if (todayClasses.length === 0) {

                answer =
                    "📚 <strong>Aaj koi class nahi hai.</strong><br><br>" +
                    "Enjoy your free time! 😎";

            } else {

                answer =
                    "📚 <strong>Aaj ki Classes</strong><br><br>";

                todayClasses.forEach(function(item) {

                    answer +=
                        "• <strong>" +
                        item.subject +
                        "</strong> — " +
                        formatTime(item.time) +
                        (item.room
                            ? " — Room " + item.room
                            : "") +
                        "<br>";
                });
            }

        }


        /* TOMORROW */

        else if (
            question.includes("kal") ||
            question.includes("tomorrow")
        ) {

            const tomorrowClasses = timetable
                .filter(function(item) {
                    return item.day === tomorrowName;
                })
                .sort(function(a, b) {
                    return a.time.localeCompare(b.time);
                });

            if (tomorrowClasses.length === 0) {

                answer =
                    "📚 <strong>Kal koi class nahi hai.</strong><br><br>" +
                    "Looks like a free day! 😎";

            } else {

                answer =
                    "📅 <strong>Kal ki Classes</strong><br><br>";

                tomorrowClasses.forEach(function(item) {

                    answer +=
                        "• <strong>" +
                        item.subject +
                        "</strong> — " +
                        formatTime(item.time) +
                        (item.room
                            ? " — Room " + item.room
                            : "") +
                        "<br>";
                });
            }

        }


        /* COMPLETE TIMETABLE */

        else {

            if (timetable.length === 0) {

                answer =
                    "📚 Tumhare timetable mein abhi koi class added nahi hai.";

            } else {

                answer =
                    "📅 <strong>Your Timetable</strong><br><br>";

                const sortedTimetable =
                    [...timetable].sort(function(a, b) {

                        const dateOrder =
                            a.date.localeCompare(b.date);

                        if (dateOrder !== 0) {
                            return dateOrder;
                        }

                        return a.time.localeCompare(b.time);
                    });

                sortedTimetable.forEach(function(item) {

                    answer +=
                        "• <strong>" +
                        item.day +
                        "</strong> — " +
                        item.subject +
                        " — " +
                        formatTime(item.time) +
                        (item.room
                            ? " — Room " + item.room
                            : "") +
                        "<br>";
                });
            }
        }
    }


    /* =========================
       GENERAL STUDY PLAN
    ========================= */

    else if (
        question.includes("study plan") ||
        question.includes("planner") ||
        question.includes("padhai") ||
        question.includes("study")
    ) {

        const savedPlan =
            localStorage.getItem("campusStudyPlan");

        if (savedPlan) {

            const plan =
                JSON.parse(savedPlan);

            answer = `
                🧠 <strong>Your Smart Study Plan</strong><br><br>

                📚 Subject:
                <strong>${plan.subject}</strong><br>

                📅 Exam:
                <strong>${formatDate(plan.examDate)}</strong><br>

                ⏱️ Daily Study:
                <strong>${plan.hours} hours</strong><br><br>

                🎯 Focus on concepts first, then practice
                questions and keep time for revision.
            `;

        } else {

            answer = `
                🧠 Abhi koi Study Plan saved nahi hai.<br><br>
                Smart Study Planner mein ek plan generate karo.
            `;
        }
    }


    /* =========================
       GENERAL TODAY
    ========================= */

    else if (
        question.includes("aaj") ||
        question.includes("today")
    ) {

        const pendingTasks = tasks.filter(function(task) {
            return !task.completed;
        });

        let todayPlan = "";

        if (pendingTasks.length > 0) {

            todayPlan += `
                📋 <strong>Pending Tasks</strong><br>
                ${pendingTasks.slice(0, 5).map(function(task) {
                    return `• ${task.text}`;
                }).join("<br>")}
                <br><br>
            `;
        }

        if (exams.length > 0) {

            const upcomingExam = exams
                .filter(function(exam) {
                    return !exam.completed;
                })
                .sort(function(a, b) {
                    return new Date(a.date) - new Date(b.date);
                })[0];

            if (upcomingExam) {

                todayPlan += `
                    📚 <strong>Upcoming Exam</strong><br>
                    • ${upcomingExam.subject}
                    — ${formatDate(upcomingExam.date)}
                    <br><br>
                `;
            }
        }

        todayPlan += `
            🧠 <strong>Study Tip</strong><br>
            Aaj pehle important task complete karo,
            phir exam preparation aur revision par focus karo.
        `;

        answer = todayPlan;
    }


    /* =========================
       GREETING
    ========================= */

else if (
    question === "hlo" ||
    question === "hii" ||
    question.includes("hello") ||
    question.includes("hi") ||
    question.includes("hey") ||
    question.includes("namaste")
) {

        answer = `
            👋 <strong>Hey!</strong><br><br>
            Main CampusMate AI hoon 🤖<br>
            Tum mujhse tasks, exams, classes,
            timetable aur study plans ke baare mein pooch sakte ho.
        `;
    }


    /* =========================
       DEFAULT
    ========================= */

    else {

        answer = `
            🤖 Main tumhari CampusMate information ke basis par help kar sakta hoon.<br><br>

            Try asking:<br>
            • 📋 Mere kitne tasks hain?<br>
            • 📚 Mera next exam kab hai?<br>
            • 🗓️ Aaj meri classes kya hain?<br>
            • 🧠 Mera study plan kya hai?<br>
            • 🎯 Aaj mujhe kya padhna chahiye?
        `;
    }


    /* AI BUBBLE */

    const aiMessage =
        document.createElement("div");

    aiMessage.className =
        "ai-message ai-bot";

    aiMessage.innerHTML = `
        <span class="ai-name">🤖 CampusMate AI</span>
        <div>${answer}</div>
    `;

    messages.appendChild(aiMessage);


    /* CLEAR INPUT */

    input.value = "";


    /* AUTO SCROLL */

    messages.scrollTop =
        messages.scrollHeight;
}


/* =========================
   AI ASSISTANT ENTER KEY
========================= */

const aiUserInput = document.getElementById("aiUserInput");

if (aiUserInput) {
    aiUserInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            askCampusAI();
        }
        
    });
}
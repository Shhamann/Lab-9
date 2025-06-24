document.addEventListener("DOMContentLoaded", () => {
    const workoutList = document.getElementById("workoutList");
    const workoutForm = document.getElementById("workoutForm");
    const totalStepsDisplay = document.getElementById("totalSteps"); // Изменено с querySelector

    // Функция для загрузки общей суммы шагов
    function loadTotalSteps() {
        fetch("/api/workouts/total_steps")
            .then(response => response.json())
            .then(data => {
                totalStepsDisplay.textContent = data.total_steps || 0;
            })
            .catch(error => console.error("Error loading total steps:", error));
    }

    // Функция загрузки списка пользователей
    function loadWorkouts() {
        fetch("/api/workouts")
            .then(response => response.json())
            .then(workouts => {
                workoutList.innerHTML = "";
                workouts.forEach(workout => {
                    const li = document.createElement("li");
                    li.innerHTML = `${workout.steps} (${workout.date}) 
                        <button onclick="deleteWorkout(${workout.id})">❌</button>`;
                    workoutList.appendChild(li);
                });
                // Добавляем вызов loadTotalSteps после загрузки списка
                loadTotalSteps();
            })
            .catch(error => console.error("Error loading workouts:", error));
    }

    // Добавление пользователя
    workoutForm.addEventListener("submit", event => {
        event.preventDefault();
        const steps = document.getElementById("steps").value;
        const date = document.getElementById("date").value;

        fetch("/api/workouts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ steps, date })
        }).then(response => response.json())
          .then(() => {
              workoutForm.reset();
              loadWorkouts(); // Это вызовет и loadTotalSteps()
          })
          .catch(error => console.error("Error adding workout:", error));
    });

    // Удаление пользователя
    window.deleteWorkout = (id) => {
        fetch(`/api/workouts/${id}`, { method: "DELETE" })
            .then(() => loadWorkouts()) // Это вызовет и loadTotalSteps()
            .catch(error => console.error("Error deleting workout:", error));
    };

    // Загрузка пользователей и общей суммы при загрузке страницы
    loadWorkouts();
});
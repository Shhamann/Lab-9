document.addEventListener("DOMContentLoaded", () => {
    const userList = document.getElementById("userList");
    const userForm = document.getElementById("userForm");

    // Функция загрузки списка пользователей
    function loadUsers() {
        fetch("/api/users")
            .then(response => response.json())
            .then(users => {
                userList.innerHTML = "";
                users.forEach(user => {
                    const li = document.createElement("li");
                    li.innerHTML = `${user.name} (${user.email}) 
                        <button onclick="deleteUser(${user.id})">❌</button>`;
                    userList.appendChild(li);
                });
            });
    }

    // Добавление пользователя
    userForm.addEventListener("submit", event => {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;

        fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email })
        }).then(response => response.json())
          .then(() => {
              userForm.reset();
              loadUsers();
          });
    });

    // Удаление пользователя
    window.deleteUser = (id) => {
        fetch(`/api/users/${id}`, { method: "DELETE" })
            .then(() => loadUsers());
    };

    // Загрузка пользователей при загрузке страницы
    loadUsers();
});

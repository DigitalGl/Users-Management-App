
const createUserForm = document.querySelector("[data-create-user-form]");
const usersContainer = document.querySelector("[data-users-container]");
const edituserFromDialog = document.querySelector("[data-edit-user-from-dialog]");

const MOCK_API_URL = "https://6800b06ab72e9cfaf7285009.mockapi.io/Schema";

let users = [];

// Клик по всему контейнеру (делегирование событий)
usersContainer.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-user-remove-btn")) {
        // console.log("userRemoveBtn" in e.target.dataset);
        const isRemoveUser = confirm("Вы точно хотите удалить данного пользователя?");

        isRemoveUser && removeExistingUserAsync(e.target.dataset.userId);
    }
})



// События отправки формы создания пользователя
createUserForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(createUserForm);
    const formUserData = Object.fromEntries(formData);

    console.log(formUserData);

    const newUserData = {
        name: formUserData.userName,
        city: formUserData.userCity,
        email: formUserData.userEmail,
        avatar: formUserData.userImageUrl,
    }

    createNewUserAsync(newUserData);
})



// Удаление существуещего пользователя
const removeExistingUserAsync = async (userId) => {
    try {
        const response = await fetch(`${MOCK_API_URL}/${userId}`, {
            method: "DELETE"
        });

        if (response.status === 404) {
            throw new Error(`${userId} не найден`)
        }

        const removedUser = await response.json();

        users = users.filter(user => user.id !== removedUser.id);
        renderUsers();


        alert("Пользователь Успешно Удален");
    } catch (error) {
        console.error("Ошибка при удалении пользователя: ", error.message)
    }
}

//Создание нового пользователя 
const createNewUserAsync = async (newUserData) => {
    try {
        const response = await fetch(MOCK_API_URL, {
            method: "POST",
            body: JSON.stringify(newUserData),
            headers: {
                "Content-type": "aplication/json"
            }
        });
        const newCreatedUser = await response.json();

        users.unshift(newCreatedUser);
        renderUsers();

        createUserForm.reset();

        alert("Новый Пользователь Успешно Создан")
    } catch (error) {
        console.error("Ошибка создания нового пользователя: ", error.message)
    }
}


// Получение всех пользователей
const getUsersAsync = async () => {
    try {
        const response = await fetch(MOCK_API_URL);
        users = await response.json();

        renderUsers();
    } catch (error) {
        console.error("Пойманая Ошибка: ", error.message)
    }
}


// Отрисовка пользователей
const renderUsers = () => {
    usersContainer.innerHTML = "";

    users.forEach((user) => {
        usersContainer.insertAdjacentHTML("beforeend", `
            <div class="user-card">
                <h3>${user.name}</h3>
                <p>City: ${user.city}</p>
                <span>Email: ${user.email}</span>
                <img src=""${user.avatar}/>
                <button class="user-edit-btn" data-user-id="${user.id}" 
                data-user-edit-btn>🛠️</button>
                <button class="user-remove-btn" data-user-id="${user.id}"
                data-user-remove-btn>❌</button>
            </div>
        `)
    })
}



getUsersAsync();








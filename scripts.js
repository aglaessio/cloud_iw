// Senha fixa
const correctPassword = "@facanabota";

// Carrega arquivos salvos ou inicializa vazio
let files = JSON.parse(localStorage.getItem("files")) || [];

// Verifica a senha
function checkPassword() {
    const passwordInput = document.getElementById("password").value;
    if (passwordInput === correctPassword) {
        document.getElementById("login").style.display = "none";
        document.getElementById("content").style.display = "block";
        loadFiles();
    } else {
        alert("Senha incorreta!");
    }
}

// Carrega a lista de arquivos na tela principal
function loadFiles() {
    const fileList = document.getElementById("file-list");
    fileList.innerHTML = "";
    files.forEach(file => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${file.url}" target="_blank">${file.name}</a>`;
        fileList.appendChild(li);
    });
}

// Mostra a tela de edição
function showEditScreen() {
    document.getElementById("content").style.display = "none";
    document.getElementById("edit-screen").style.display = "block";
    loadEditFiles();
}

// Carrega arquivos na tela de edição
function loadEditFiles() {
    const editFileList = document.getElementById("edit-file-list");
    editFileList.innerHTML = "";
    files.forEach((file, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${file.name} - <a href="${file.url}" target="_blank">Link</a></span>
            <button onclick="removeFile(${index})">Remover</button>
        `;
        editFileList.appendChild(li);
    });
}

// Adiciona um novo arquivo
function addFile() {
    const name = document.getElementById("file-name").value;
    const url = document.getElementById("file-url").value;
    if (name && url) {
        files.push({ name, url });
        localStorage.setItem("files", JSON.stringify(files));
        document.getElementById("file-name").value = "";
        document.getElementById("file-url").value = "";
        loadEditFiles();
    } else {
        alert("Preencha nome e URL!");
    }
}

// Remove um arquivo
function removeFile(index) {
    files.splice(index, 1);
    localStorage.setItem("files", JSON.stringify(files));
    loadEditFiles();
}

// Salva e volta à tela principal
function saveAndReturn() {
    document.getElementById("edit-screen").style.display = "none";
    document.getElementById("content").style.display = "block";
    loadFiles();
}

// Logout
function logout() {
    document.getElementById("content").style.display = "none";
    document.getElementById("login").style.display = "block";
    document.getElementById("password").value = "";
}

// Suporte ao Enter no login
document.getElementById("password").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        checkPassword();
    }
});
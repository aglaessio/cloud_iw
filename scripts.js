const repoOwner = "aglaessio"; // Substitua pelo seu usuário GitHub
const repoName = "cloud_iw"; // Substitua pelo nome do seu repositório
const token = "SEU_TOKEN_PESSOAL"; // Gere em Settings > Developer Settings > Personal Access Tokens
const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents`;
const fileList = document.getElementById("file-list");
const searchInput = document.getElementById("search");

// Função para obter ícone por tipo de arquivo
function getFileIcon(type) {
    switch (type) {
        case "xlsx": case "xls": case "xlm": return "fas fa-file-excel";
        case "pdf": return "fas fa-file-pdf";
        case "doc": return "fas fa-file-word";
        case "jpg": case "jpeg": return "fas fa-file-image";
        default: return "fas fa-file";
    }
}

// Listar arquivos do repositório
async function listFiles() {
    const response = await fetch(apiUrl, {
        headers: { "Authorization": `token ${token}` }
    });
    const files = await response.json();
    renderFiles(files);
}

// Renderizar arquivos na interface
function renderFiles(files) {
    fileList.innerHTML = "";
    files.forEach(file => {
        if (file.type === "file" && /\.(xls|xlm|xlsx|pdf|doc|jpg|jpeg)$/i.test(file.name)) {
            const li = document.createElement("li");
            const i = document.createElement("i");
            const a = document.createElement("a");
            const btn = document.createElement("button");

            i.className = getFileIcon(file.name.split('.').pop().toLowerCase());
            a.href = file.download_url;
            a.textContent = file.name;
            a.target = "_blank";
            btn.textContent = "Download";
            btn.onclick = () => window.open(file.download_url, "_blank");

            li.appendChild(i);
            li.appendChild(a);
            li.appendChild(btn);
            fileList.appendChild(li);
        }
    });
}

// Upload de arquivos
async function uploadFiles() {
    const files = document.getElementById("file-upload").files;
    for (let file of files) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const content = e.target.result.split(',')[1]; // Base64
            const path = file.name;

            await fetch(`${apiUrl}/${path}`, {
                method: "PUT",
                headers: {
                    "Authorization": `token ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: `Upload de ${path}`,
                    content: content
                })
            });
            listFiles(); // Atualiza a lista após o upload
        };
        reader.readAsDataURL(file);
    }
}

// Filtro de pesquisa
searchInput.addEventListener("input", async () => {
    const term = searchInput.value.toLowerCase();
    const response = await fetch(apiUrl, { headers: { "Authorization": `token ${token}` } });
    const files = await response.json();
    const filtered = files.filter(file => file.name.toLowerCase().includes(term));
    renderFiles(filtered);
});

// Inicializar
listFiles();

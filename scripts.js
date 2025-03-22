const repoOwner = "aglaessio"; // Substitua se o usuário for diferente
const repoName = "cloud_iw"; // Substitua se o repositório for diferente
const token = "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"; // Seu token
const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents`;
const fileList = document.getElementById("file-list");
const searchInput = document.getElementById("search");
const uploadBtn = document.getElementById("upload-btn");

// Função para obter ícone por tipo de arquivo
function getFileIcon(type) {
    switch (type.toLowerCase()) {
        case "xlsx":
        case "xls":
        case "xlm":
            return "fas fa-file-excel";
        case "pdf":
            return "fas fa-file-pdf";
        case "doc":
            return "fas fa-file-word";
        case "jpg":
        case "jpeg":
            return "fas fa-file-image";
        default:
            return "fas fa-file";
    }
}

// Listar arquivos do repositório
async function listFiles() {
    try {
        const response = await fetch(apiUrl, {
            headers: {
                "Authorization": `token ${token}`,
                "Accept": "application/vnd.github.v3+json"
            }
        });
        if (!response.ok) {
            throw new Error(`Erro ao listar arquivos: ${response.status} - ${response.statusText}`);
        }
        const files = await response.json();
        renderFiles(files);
    } catch (error) {
        console.error("Erro ao listar arquivos:", error);
        alert("Erro ao carregar arquivos. Verifique o console para mais detalhes.");
    }
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

            i.className = getFileIcon(file.name.split('.').pop());
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
    if (!files.length) {
        alert("Por favor, selecione pelo menos um arquivo.");
        return;
    }

    for (let file of files) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const content = e.target.result.split(',')[1]; // Base64 sem prefixo
                const path = file.name;

                const response = await fetch(`${apiUrl}/${path}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `token ${token}`,
                        "Accept": "application/vnd.github.v3+json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: `Upload de ${path} via Cloud IW`,
                        content: content
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Erro ao fazer upload: ${errorData.message}`);
                }

                console.log(`Upload de ${path} concluído com sucesso!`);
                listFiles(); // Atualiza a lista após o upload
            } catch (error) {
                console.error("Erro no upload:", error);
                alert(`Falha ao enviar ${file.name}: ${error.message}`);
            }
        };
        reader.onerror = () => {
            console.error("Erro ao ler o arquivo:", file.name);
            alert(`Erro ao processar ${file.name}`);
        };
        reader.readAsDataURL(file);
    }
}

// Filtro de pesquisa
searchInput.addEventListener("input", async () => {
    const term = searchInput.value.toLowerCase();
    try {
        const response = await fetch(apiUrl, {
            headers: {
                "Authorization": `token ${token}`,
                "Accept": "application/vnd.github.v3+json"
            }
        });
        if (!response.ok) throw new Error(`Erro ao buscar arquivos: ${response.status}`);
        const files = await response.json();
        const filtered = files.filter(file => file.name.toLowerCase().includes(term));
        renderFiles(filtered);
    } catch (error) {
        console.error("Erro na pesquisa:", error);
    }
});

// Associar o evento de clique ao botão de upload
uploadBtn.addEventListener("click", uploadFiles);

// Inicializar a lista de arquivos
listFiles();

const repoOwner = "aglaessio"; // Substitua se for outro usuário
const repoName = "cloud_iw"; // Substitua se for outro repositório
const token = "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"; // Nunca exponha um token real
const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents`;
const fileList = document.getElementById("file-list");
const searchInput = document.getElementById("search");
const uploadBtn = document.getElementById("upload-btn");

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
                const contentBase64 = e.target.result.split(",")[1];
                const path = file.name;
                
                // Verificar se o arquivo já existe
                let sha = null;
                const checkFile = await fetch(`${apiUrl}/${path}`, {
                    headers: {
                        "Authorization": `token ${token}`,
                        "Accept": "application/vnd.github.v3+json"
                    }
                });
                
                if (checkFile.ok) {
                    const fileData = await checkFile.json();
                    sha = fileData.sha;
                }
                
                // Enviar arquivo
                const response = await fetch(`${apiUrl}/${path}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `token ${token}`,
                        "Accept": "application/vnd.github.v3+json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: `Upload de ${path} via Cloud IW`,
                        content: contentBase64,
                        sha: sha
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Erro ao fazer upload: ${errorData.message}`);
                }

                console.log(`Upload de ${path} concluído com sucesso!`);
                listFiles();
            } catch (error) {
                console.error("Erro no upload:", error);
                alert(`Falha ao enviar ${file.name}: ${error.message}`);
            }
        };
        reader.readAsDataURL(file);
    }
}

uploadBtn.addEventListener("click", uploadFiles);

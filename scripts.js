const correctPassword = "@facanabota";
const accessToken = "EwBYBMl6BAAUBKgm8k1UswUNwklmy2v7U/S+1fEAAaqxkbmhQr1u+2/ybd8FUYg07P1DAIVkd1hRzNCKQw+88IVhnXsE3EMPQvVMq+C/Kc9k3XLPGZVoNNauzLQNV6dv+VA57FJga+8zNS981v9j1oZm7ybuGA27qqjWC1WHzo4GG3rfbDCg0Byz9yU1GYr/7eZxlOzce/Qq/KmdHwkd4Co9PjBHtaLHt6tiCWtEv7SR2SsZjTgorybIqvQJkCUl0SzMqoheACABAooKO6PPYkJAr2921LfdUglIE4f/ajsZr3AAiSrewPZZzYQcCJvMgbGZfQRW38MnSkVK83zincG5uXXnepNn1PbFue5kJqZfexkFK3TpiAjFRXhI5QYQZgAAENnjWYoz36DN7uxvDo2+xTUgA8zUSc2fgi6nDcTVdoBQx4LvqhcxtQQTKR6SYZ669wMCqP7DKqox49TDKegIXZQB8zk3iTUKysEsr3iq7oASLyAYo4veiYf6OJvqNiAmXvwzax7YaDjeabT2TaaJn5itIgYW7Faa02pVovXDTito7SUm5d5mdgznd49xRSG7mBpCutZg7dVqe+b9E8alyHcwLrhPcCwhjnkscQ22SS4Ds3EUiN5LJu+3dTvc1iD5SpNtIWWqv718iIAR29DqtjgU1rKg1/01l05mH6ysXWnFfOeNIp8UmJ3coMEkF7UdwMV/D5pTpub6AU5SEwgXLoWaA+k1T8tfifeGuiz/uOQfyXNKRX0WzytX/dkKtVnsI3lyPtNZJ3FqACNyhdjS8Rq/WpUVPc3AuJdLmvth2Q24849E1ya+lkUiNqYJYg+wGTrZB9bR0Tn61jwFViKpj1FgWneF5Mq8usKKgXG3inqdDqidj8uMVeGhI1lYR+a3mJ/ACsHmsdFjCSMk9Rrpf7D/2B78CEgSk6yBlu2ZlgdcF0s4KRXn1eq16U/HJ4wuLfvu2p2EeiZ7sy77PiGY3D/XSk8XI9JFc82TB76IOp+dPqNI7jsyn7eZgqQhpA3UJx4qsyVvSbsX/LgYpg1qHzq2QP9cuA2JfECWGzrWtDr2GDbcV2GwmT220+WhOF/qv0fIYadOH/MFC2DaW4zlQ7DzO4cXO9hX6nZbt7XJJdMNz/gnZGgw/St4Rno+OloHAEq+W3Al/7jY0e6y21KMHkuqrOdtpC2CBcTL4gzwtmIL5eqA/udvNzKALegTWhK/8bikMQAE9xcUBe47LYIy77X/nZEjv/IjFbmWP/BD+sXQlTuCwqg1G00tJDbBE54kAyre/k6Eupibi1/erp+M21joWuOz1x1jKx3il/n/6U9tAfWUEYFWap9PtrHVfIwRl+d97Gp8kCZYh5xJeVcqD/AFhpnkNppT2MK138ng9fDVztkIGSZAroTrJ/52XCIC5jKramYfjb+czKzk9mtdogXaYJeAqKnoh4UkxkjQXAOmhKkPFtER5IRFEzT/UKIBhPYPSwM=";

function checkPassword() {
    const passwordInput = document.getElementById("password").value;
    if (passwordInput === correctPassword) {
        document.getElementById("login").style.display = "none";
        document.getElementById("content").style.display = "block";
        fetchFiles();
    } else {
        alert("Senha incorreta!");
    }
}

async function fetchFiles() {
    const url = "https://graph.microsoft.com/v1.0/me/drive/root:/EgxhnTuZeTZPk5aSleYjxIcBc1QJDMiXuCton3RYAVYgYg:/children";
    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        if (!response.ok) throw new Error("Erro na requisição: " + response.status);
        const data = await response.json();
        const fileList = document.getElementById("file-list");
        fileList.innerHTML = "";
        data.value.forEach(item => {
            const li = document.createElement("li");
            const link = item.webUrl;
            li.innerHTML = `<a href="${link}" target="_blank">${item.name}</a>`;
            if (item.folder) li.classList.add("folder"); // Marca pastas
            fileList.appendChild(li);
        });
    } catch (error) {
        console.error("Erro ao buscar arquivos:", error);
        alert("Erro ao carregar arquivos. O token pode ter expirado ou o acesso foi negado.");
    }
}

function logout() {
    document.getElementById("content").style.display = "none";
    document.getElementById("login").style.display = "block";
    document.getElementById("password").value = "";
}

document.getElementById("password").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        checkPassword();
    }
});

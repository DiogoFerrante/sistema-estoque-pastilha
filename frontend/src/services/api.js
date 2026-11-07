const API_URL = "http://localhost:1880";

// BUSCAR PASTILHAS
export async function buscarPastilhas() {
    const resposta = await fetch(`${API_URL}/pastilhas`);

    if (!resposta.ok) {
        throw new Error("Erro ao buscar as pastilhas.");
    }

    return await resposta.json();
}

// REGISTRAR ENTRADA
export async function registrarEntrada(idPastilha, quantidade, idUsuario) {
    const resposta = await fetch(`${API_URL}/entrada`, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
            id_pastilha: idPastilha,
            quantidade: quantidade,
            id_usuario: idUsuario
        })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.mensagem || "Erro ao registrar entrada.");
    }

    return dados;
}

// REGISTRAR SAÍDA
export async function registrarSaida(idPastilha, quantidade, idUsuario) {
    const resposta = await fetch(`${API_URL}/saida`, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
            id_pastilha: idPastilha,
            quantidade: quantidade,
            id_usuario: idUsuario
        })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.mensagem || "Erro ao registrar saída.");
    }

    return dados;
}

// BUSCAR MOVIMENTAÇÕES
export async function buscarMovimentacoes() {
    const resposta = await fetch(`${API_URL}/movimentacoes`);

    if (!resposta.ok) {
        throw new Error("Erro ao buscar movimentações.");
    }

    return await resposta.json();
}

// BUSCAR DASHBOARD
export async function buscarDashboard() {
    const resposta = await fetch(`${API_URL}/dashboard`);

    if (!resposta.ok) {
        throw new Error("Erro ao buscar dados do dashboard.");
    }

    const dados = await resposta.json();

    return dados[0];
}

// CADASTRAR NOVA PASTILHA
export async function cadastrarPastilha(dadosPastilha) {
    const resposta = await fetch(`${API_URL}/pastilhas`, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(dadosPastilha)
    });

    const dados = await resposta.json();

    if (!resposta.ok || !dados.sucesso) {
        throw new Error(
            dados.mensagem || "Erro ao cadastrar a pastilha."
        );
    }

    return dados;
}

// EXCLUIR PASTILHA
export async function excluirPastilha(idPastilha) {
    const resposta = await fetch(
        `${API_URL}/pastilhas/${idPastilha}`,
        {
            method: "DELETE"
        }
    );

    const dados = await resposta.json();

    if (!resposta.ok || !dados.sucesso) {
        throw new Error(
            dados.mensagem || "Erro ao excluir a pastilha."
        );
    }

    return dados;
}

// CADASTRAR USUÁRIO
export async function cadastrarUsuario(nome, email, senha) {
    const resposta = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify({
            nome: nome,
            email: email,
            senha: senha
        })
    });

    const dados = await resposta.json();

    if (!resposta.ok || !dados.sucesso) {
        throw new Error(
            dados.mensagem || "Erro ao cadastrar usuário."
        );
    }

    return dados;
}

// REALIZAR LOGIN
export async function realizarLogin(email, senha) {
    const resposta = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify({
            email: email,
            senha: senha
        })
    });

    const dados = await resposta.json();

    if (!resposta.ok || dados.sucesso === false) {
        throw new Error(
            dados.mensagem || "E-mail ou senha incorretos."
        );
    }

    return dados;
}
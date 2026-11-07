import { useState } from "react";
import { cadastrarUsuario } from "../../services/api";
import "./Cadastro.css";

function Cadastro({ onVoltar }) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function cadastrar(e) {
        e.preventDefault();

        if (!nome || !email || !senha || !confirmarSenha) {
            alert("Preencha todos os campos.");
            return;
        }

        if (senha !== confirmarSenha) {
            alert("As senhas não são iguais.");
            return;
        }

        if (senha.length < 8) {
            alert("A senha deve possuir pelo menos 8 caracteres.");
            return;
        }

        try {
            setCarregando(true);

            await cadastrarUsuario(nome, email, senha);

            alert("Cadastro realizado com sucesso!");

            onVoltar();

        } catch (erro) {
            alert(erro.message);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="cadastro-container">
            <div className="cadastro-card">

                <div className="cadastro-logo">
                    <h1>DDA</h1>
                    <span>METALÚRGICA</span>
                </div>

                <h2>Criar conta</h2>

                <p>
                    Cadastre-se para acessar o sistema de estoque.
                </p>

                <form onSubmit={cadastrar}>

                    <div className="cadastro-campo">
                        <label>Nome completo</label>

                        <input
                            type="text"
                            placeholder="Digite seu nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            disabled={carregando}
                        />
                    </div>

                    <div className="cadastro-campo">
                        <label>E-mail</label>

                        <input
                            type="email"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={carregando}
                        />
                    </div>

                    <div className="cadastro-campo">
                        <label>Senha</label>

                        <input
                            type="password"
                            placeholder="Crie uma senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            disabled={carregando}
                        />
                    </div>

                    <div className="cadastro-campo">
                        <label>Confirmar senha</label>

                        <input
                            type="password"
                            placeholder="Digite a senha novamente"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            disabled={carregando}
                        />
                    </div>

                    <button
                        type="submit"
                        className="cadastro-botao"
                        disabled={carregando}
                    >
                        {carregando ? "Cadastrando..." : "Criar conta"}
                    </button>

                </form>

                <div className="cadastro-voltar">
                    Já possui uma conta?

                    <button
                        onClick={onVoltar}
                        disabled={carregando}
                    >
                        Fazer login
                    </button>
                </div>

                <footer>
                    DDA Metalúrgica © 2026
                </footer>

            </div>
        </div>
    );
}

export default Cadastro;
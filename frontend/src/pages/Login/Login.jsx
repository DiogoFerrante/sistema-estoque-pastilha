import { useState } from "react";
import { realizarLogin } from "../../services/api";
import "./Login.css";

function Login({ onEntrar, onCadastro, onEsqueciSenha }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function entrar(e) {
        e.preventDefault();

        if (!email || !senha) {
            alert("Preencha o e-mail e a senha.");
            return;
        }

        try {
            setCarregando(true);

            const usuario = await realizarLogin(email, senha);

            alert("Login realizado com sucesso!");

            onEntrar(usuario);

        } catch (erro) {
            alert(erro.message);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">

                <div className="login-logo">
                    <h1>DDA</h1>
                    <span>METALÚRGICA</span>
                </div>

                <h2>Bem-vindo!</h2>

                <p>
                    Acesse o sistema de controle de estoque.
                </p>

                <form onSubmit={entrar}>

                    <div className="login-campo">
                        <label>E-mail</label>

                        <input
                            type="email"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={carregando}
                        />
                    </div>

                    <div className="login-campo">
                        <label>Senha</label>

                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            disabled={carregando}
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-botao"
                        disabled={carregando}
                    >
                        {carregando ? "Verificando..." : "Entrar no sistema"}
                    </button>

                </form>

                <button
                    className="login-link"
                    onClick={onEsqueciSenha}
                    disabled={carregando}
                >
                    Esqueci minha senha
                </button>

                <div className="login-cadastro">
                    Não possui uma conta?

                    <button
                        onClick={onCadastro}
                        disabled={carregando}
                    >
                        Cadastre-se
                    </button>
                </div>

                <footer>
                    DDA Metalúrgica © 2026
                </footer>

            </div>
        </div>
    );
}

export default Login;
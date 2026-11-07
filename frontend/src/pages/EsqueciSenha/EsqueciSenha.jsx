import { useState } from "react";
import "./EsqueciSenha.css";

function EsqueciSenha({ onVoltar }) {
    const [email, setEmail] = useState("");
    const [mensagem, setMensagem] = useState("");

    function recuperarSenha(e) {
        e.preventDefault();

        if (!email) {
            setMensagem("Informe seu e-mail para continuar.");
            return;
        }

        setMensagem(
            "Solicitação registrada! A recuperação será ativada quando conectarmos o sistema ao backend."
        );
    }

    return (
        <div className="recuperacao-container">

            <div className="recuperacao-card">

                <div className="recuperacao-logo">
                    <h1>DDA</h1>
                    <span>METALÚRGICA</span>
                </div>

                <div className="recuperacao-icone">
                    <span>?</span>
                </div>

                <h2>Esqueceu sua senha?</h2>

                <p>
                    Informe o e-mail cadastrado para iniciar
                    a recuperação da sua senha.
                </p>

                <form onSubmit={recuperarSenha}>

                    <div className="recuperacao-campo">
                        <label>E-mail cadastrado</label>

                        <input
                            type="email"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setMensagem("");
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="recuperacao-botao"
                    >
                        Recuperar senha
                    </button>

                </form>

                {mensagem && (
                    <div className="recuperacao-mensagem">
                        {mensagem}
                    </div>
                )}

                <button
                    className="recuperacao-voltar"
                    onClick={onVoltar}
                >
                    Voltar para o Login
                </button>

                <footer>
                    DDA Metalúrgica © 2026
                </footer>

            </div>

        </div>
    );
}

export default EsqueciSenha;
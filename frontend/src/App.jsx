import { useState } from "react";

import Dashboard from "./pages/Dashboard/Dashboard";
import CodigoBarras from "./pages/CodigoBarras/CodigoBarras";
import Pastilhas from "./pages/Pastilhas/Pastilhas";
import Relatorios from "./pages/Relatorios/Relatorios";
import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import EsqueciSenha from "./pages/EsqueciSenha/EsqueciSenha";

import "./App.css";

function App() {
    const [paginaAtual, setPaginaAtual] = useState("Login");
    const [usuarioLogado, setUsuarioLogado] = useState(null);

    // REALIZAR LOGIN
    function entrarNoSistema(usuario) {
        setUsuarioLogado(usuario);
        setPaginaAtual("Dashboard");
    }

    // SAIR DO SISTEMA
    function sairDoSistema() {
        setUsuarioLogado(null);
        setPaginaAtual("Login");
    }

    // RENDERIZAR PÁGINAS
    function renderizarPagina() {

        if (paginaAtual === "Login") {
            return (
                <Login
                    onEntrar={entrarNoSistema}
                    onCadastro={() => setPaginaAtual("Cadastro")}
                    onEsqueciSenha={() => setPaginaAtual("EsqueciSenha")}
                />
            );
        }

        if (paginaAtual === "Cadastro") {
            return (
                <Cadastro
                    onVoltar={() => setPaginaAtual("Login")}
                />
            );
        }

        if (paginaAtual === "EsqueciSenha") {
            return (
                <EsqueciSenha
                    onVoltar={() => setPaginaAtual("Login")}
                />
            );
        }

        switch (paginaAtual) {

            case "Dashboard":
                return <Dashboard />;

            case "Pastilhas":
                return <Pastilhas />;

            case "Entrada/Saída":
                return <CodigoBarras usuario={usuarioLogado} />;

            case "Relatórios":
                return <Relatorios />;

            default:
                return <Dashboard />;
        }
    }

    const estaLogado = usuarioLogado !== null;

    return (
        <div className="app">

            {estaLogado && (
                <>
                    <header className="app-header">

                        <div>
                            <h2>DDA Metalúrgica</h2>
                            <span>Sistema de Controle de Estoque</span>
                        </div>

                        <div className="app-usuario">
                            <span>
                                Olá, {usuarioLogado.nome || usuarioLogado.email}
                            </span>

                            <button onClick={sairDoSistema}>
                                Sair
                            </button>
                        </div>

                    </header>

                    <nav className="app-menu">

                        <button onClick={() => setPaginaAtual("Dashboard")}>
                            Dashboard
                        </button>

                        <button onClick={() => setPaginaAtual("Pastilhas")}>
                            Pastilhas
                        </button>

                        <button onClick={() => setPaginaAtual("Entrada/Saída")}>
                            Entrada/Saída
                        </button>

                        <button onClick={() => setPaginaAtual("Relatórios")}>
                            Relatórios
                        </button>

                    </nav>
                </>
            )}

            <main className="app-conteudo">
                {renderizarPagina()}
            </main>

        </div>
    );
}

export default App;

import { useEffect, useState } from "react";
import { buscarMovimentacoes } from "../../services/api";
import "./Relatorios.css";

function Relatorios() {
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [erro, setErro] = useState("");
    const [filtro, setFiltro] = useState("Todas");
    const [pesquisa, setPesquisa] = useState("");

    useEffect(() => {
        buscarMovimentacoes()
            .then((dados) => {
                setMovimentacoes(dados);
            })
            .catch(() => {
                setErro("Não foi possível carregar o histórico.");
            });
    }, []);

    const entradas = movimentacoes.filter(
        (mov) => mov.tipo?.toLowerCase() === "entrada"
    ).length;

    const saidas = movimentacoes.filter(
        (mov) => mov.tipo?.toLowerCase() === "saida" ||
                 mov.tipo?.toLowerCase() === "saída"
    ).length;

    const movimentacoesFiltradas = movimentacoes.filter((mov) => {
        const tipo = mov.tipo?.toLowerCase() || "";
        const termo = pesquisa.toLowerCase();

        const correspondeTipo =
            filtro === "Todas" ||
            tipo === filtro.toLowerCase() ||
            (filtro === "Saída" && tipo === "saida");

        const correspondePesquisa =
            mov.codigo?.toLowerCase().includes(termo) ||
            mov.modelo?.toLowerCase().includes(termo);

        return correspondeTipo && correspondePesquisa;
    });

    function formatarData(data) {
        if (!data) return "-";

        return new Date(data).toLocaleString("pt-BR");
    }

    function classeTipo(tipo) {
        return tipo?.toLowerCase() === "entrada"
            ? "relatorio-tipo entrada"
            : "relatorio-tipo saida";
    }

    return (
        <div className="relatorios">

            <div className="relatorios-cabecalho">
                <div>
                    <span className="relatorios-etiqueta">
                        CONTROLE DE ESTOQUE
                    </span>
                    <h1>Histórico de Movimentações</h1>
                    <p>
                        Consulte todas as entradas e saídas de pastilhas.
                    </p>
                </div>
            </div>

            <div className="relatorios-indicadores">
                <div className="relatorio-card">
                    <span>Total de movimentações</span>
                    <strong>{movimentacoes.length}</strong>
                </div>

                <div className="relatorio-card relatorio-card-entrada">
                    <span>Entradas</span>
                    <strong>{entradas}</strong>
                </div>

                <div className="relatorio-card relatorio-card-saida">
                    <span>Saídas</span>
                    <strong>{saidas}</strong>
                </div>
            </div>

            <div className="relatorios-conteudo">

                <div className="relatorios-filtros">
                    <div>
                        <label htmlFor="pesquisa-relatorio">
                            Pesquisar pastilha
                        </label>
                        <input
                            id="pesquisa-relatorio"
                            type="text"
                            placeholder="Digite o código ou modelo..."
                            value={pesquisa}
                            onChange={(e) => setPesquisa(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="filtro-relatorio">
                            Tipo de movimentação
                        </label>
                        <select
                            id="filtro-relatorio"
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                        >
                            <option value="Todas">Todas</option>
                            <option value="Entrada">Entradas</option>
                            <option value="Saída">Saídas</option>
                        </select>
                    </div>
                </div>

                {erro && (
                    <p className="relatorios-erro">{erro}</p>
                )}

                <div className="relatorios-tabela-container">
                    <table className="relatorios-tabela">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Modelo</th>
                                <th>Tipo</th>
                                <th>Quantidade</th>
                                <th>Data e Hora</th>
                                <th>Usuário</th>
                            </tr>
                        </thead>

                        <tbody>
                            {movimentacoesFiltradas.map((movimentacao) => (
                                <tr key={movimentacao.id_movimentacao}>
                                    <td className="relatorio-codigo">
                                        {movimentacao.codigo}
                                    </td>
                                    <td>{movimentacao.modelo}</td>
                                    <td>
                                        <span className={classeTipo(movimentacao.tipo)}>
                                            {movimentacao.tipo}
                                        </span>
                                    </td>
                                    <td>{movimentacao.quantidade}</td>
                                    <td>{formatarData(movimentacao.data_hora)}</td>
                                    <td>{movimentacao.usuario || "-"}</td>
                                </tr>
                            ))}

                            {movimentacoesFiltradas.length === 0 && !erro && (
                                <tr>
                                    <td colSpan="6" className="relatorios-vazio">
                                        Nenhuma movimentação encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="relatorios-rodape">
                    Exibindo {movimentacoesFiltradas.length} de {movimentacoes.length} movimentações
                </div>

            </div>
        </div>
    );
}

export default Relatorios;

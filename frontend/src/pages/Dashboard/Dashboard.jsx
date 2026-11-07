
import { useEffect, useState } from "react";

import {
    buscarDashboard,
    buscarPastilhas,
    buscarMovimentacoes
} from "../../services/api";

import "./Dashboard.css";

function Dashboard() {
    const [dados, setDados] = useState({
        total_pastilhas: 0,
        estoque_critico: 0,
        total_movimentacoes: 0
    });

    const [pastilhas, setPastilhas] = useState([]);
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        buscarDashboard()
            .then((resultado) => {
                setDados(resultado);
            })
            .catch(() => {
                setErro("Não foi possível carregar o dashboard.");
            });

        buscarPastilhas()
            .then((resultado) => {
                setPastilhas(resultado);
            })
            .catch(() => {
                setErro("Não foi possível carregar as pastilhas.");
            });

        buscarMovimentacoes()
            .then((resultado) => {
                setMovimentacoes(resultado);
            })
            .catch(() => {
                setErro("Não foi possível carregar as movimentações.");
            });
    }, []);

    const pastilhasSemEstoque = pastilhas.filter(
        (pastilha) => Number(pastilha.quantidade_atual) === 0
    ).length;

    const pastilhasCriticas = pastilhas.filter((pastilha) => {
        const quantidade = Number(pastilha.quantidade_atual);
        const minimo = Number(pastilha.estoque_minimo);

        return quantidade > 0 && quantidade <= minimo;
    }).length;

    function verificarSituacao(pastilha) {
        const quantidade = Number(pastilha.quantidade_atual);
        const minimo = Number(pastilha.estoque_minimo);

        if (quantidade === 0) {
            return {
                texto: "Sem estoque",
                classe: "status-sem-estoque"
            };
        }

        if (quantidade <= minimo) {
            return {
                texto: "Estoque crítico",
                classe: "status-critico"
            };
        }

        return {
            texto: "Normal",
            classe: "status-normal"
        };
    }

    const totalEntradas = movimentacoes
        .filter((movimentacao) => movimentacao.tipo === "ENTRADA")
        .reduce(
            (total, movimentacao) =>
                total + Number(movimentacao.quantidade),
            0
        );

    const totalSaidas = movimentacoes
        .filter((movimentacao) => movimentacao.tipo === "SAIDA")
        .reduce(
            (total, movimentacao) =>
                total + Number(movimentacao.quantidade),
            0
        );

    const maiorTotal = Math.max(totalEntradas, totalSaidas, 1);

    const porcentagemEntradas = (totalEntradas / maiorTotal) * 100;
    const porcentagemSaidas = (totalSaidas / maiorTotal) * 100;

    const ultimasMovimentacoes = movimentacoes.slice(0, 5);

    return (
        <div className="dashboard">

            <div className="dashboard-cabecalho">
                <div>
                    <span className="dashboard-identificacao">
                        CENTRO DE CONTROLE INDUSTRIAL
                    </span>

                    <h1 className="dashboard-titulo">
                        Dashboard
                    </h1>

                    <p className="dashboard-subtitulo">
                        Visão geral do estoque de pastilhas industriais
                    </p>
                </div>

                <div className="dashboard-etiqueta">
                    DDA METALÚRGICA
                </div>
            </div>

            {erro && (
                <p className="dashboard-erro">
                    {erro}
                </p>
            )}

            <div className="dashboard-secao-titulo">
                <h2>Indicadores gerais</h2>
                <span>RESUMO DO ESTOQUE</span>
            </div>

            <div className="dashboard-cards">

                <div className="dashboard-card card-azul">
                    <span className="dashboard-card-icone">▦</span>
                    <h3>Pastilhas cadastradas</h3>
                    <p>{dados.total_pastilhas}</p>
                    <small>Modelos registrados no sistema</small>
                </div>

                <div className="dashboard-card card-vermelho">
                    <span className="dashboard-card-icone">!</span>
                    <h3>Estoque crítico</h3>
                    <p>{pastilhasCriticas}</p>
                    <small>Pastilhas no limite mínimo ou abaixo</small>
                </div>

                <div className="dashboard-card card-vermelho">
                    <span className="dashboard-card-icone">0</span>
                    <h3>Sem estoque</h3>
                    <p>{pastilhasSemEstoque}</p>
                    <small>Pastilhas sem unidades disponíveis</small>
                </div>

                <div className="dashboard-card card-verde">
                    <span className="dashboard-card-icone">↔</span>
                    <h3>Movimentações</h3>
                    <p>{dados.total_movimentacoes}</p>
                    <small>Entradas e saídas registradas</small>
                </div>

            </div>

            <div className="dashboard-graficos">

                <div className="dashboard-grafico">
                    <span className="dashboard-identificacao">
                        MOVIMENTAÇÃO DE MATERIAIS
                    </span>

                    <h2>Entradas e saídas</h2>

                    <p className="dashboard-grafico-descricao">
                        Quantidade total de unidades movimentadas
                    </p>

                    <div className="grafico-item">
                        <div className="grafico-legenda">
                            <span>Entradas</span>
                            <strong>{totalEntradas} unidades</strong>
                        </div>

                        <div className="grafico-barra">
                            <div
                                className="grafico-preenchimento grafico-entrada"
                                style={{
                                    width: `${porcentagemEntradas}%`
                                }}
                            />
                        </div>
                    </div>

                    <div className="grafico-item">
                        <div className="grafico-legenda">
                            <span>Saídas</span>
                            <strong>{totalSaidas} unidades</strong>
                        </div>

                        <div className="grafico-barra">
                            <div
                                className="grafico-preenchimento grafico-saida"
                                style={{
                                    width: `${porcentagemSaidas}%`
                                }}
                            />
                        </div>
                    </div>

                    <p className="dashboard-grafico-total">
                        Total movimentado: {totalEntradas + totalSaidas} unidades
                    </p>
                </div>

            </div>

            <div className="dashboard-tabela-container">

                <div className="dashboard-tabela-cabecalho">
                    <div>
                        <span className="dashboard-identificacao">
                            CONTROLE DE MATERIAIS
                        </span>

                        <h2>Estoque de Pastilhas</h2>

                        <p>
                            Acompanhamento das quantidades disponíveis
                        </p>
                    </div>

                    <span className="dashboard-total-itens">
                        {pastilhas.length} itens
                    </span>
                </div>

                <table className="dashboard-tabela">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Modelo</th>
                            <th>Quantidade atual</th>
                            <th>Estoque mínimo</th>
                            <th>Situação</th>
                        </tr>
                    </thead>

                    <tbody>
                        {pastilhas.length > 0 ? (
                            pastilhas.map((pastilha) => {
                                const situacao = verificarSituacao(pastilha);

                                return (
                                    <tr key={pastilha.id_pastilha}>
                                        <td>{pastilha.codigo}</td>
                                        <td>{pastilha.modelo}</td>
                                        <td>
                                            <strong>
                                                {pastilha.quantidade_atual}
                                            </strong>
                                        </td>
                                        <td>{pastilha.estoque_minimo}</td>
                                        <td>
                                            <span className={situacao.classe}>
                                                {situacao.texto}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5">
                                    Nenhuma pastilha encontrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>

            <div className="dashboard-tabela-container dashboard-ultimas-movimentacoes">

                <div className="dashboard-tabela-cabecalho">
                    <div>
                        <span className="dashboard-identificacao">
                            HISTÓRICO OPERACIONAL
                        </span>

                        <h2>Últimas movimentações</h2>

                        <p>
                            As 5 movimentações mais recentes do estoque
                        </p>
                    </div>
                </div>

                <table className="dashboard-tabela">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Modelo</th>
                            <th>Operação</th>
                            <th>Quantidade</th>
                            <th>Data e horário</th>
                            <th>Usuário</th>
                        </tr>
                    </thead>

                    <tbody>
                        {ultimasMovimentacoes.length > 0 ? (
                            ultimasMovimentacoes.map((movimentacao) => (
                                <tr key={movimentacao.id_movimentacao}>
                                    <td>{movimentacao.codigo}</td>

                                    <td>{movimentacao.modelo}</td>

                                    <td>
                                        <span className={
                                            movimentacao.tipo === "ENTRADA"
                                                ? "status-normal"
                                                : "status-critico"
                                        }>
                                            {movimentacao.tipo}
                                        </span>
                                    </td>

                                    <td>
                                        <strong>
                                            {movimentacao.quantidade}
                                        </strong>
                                    </td>

                                    <td>
                                        {new Date(
                                            movimentacao.data_hora
                                        ).toLocaleString("pt-BR")}
                                    </td>

                                    <td>{movimentacao.usuario}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">
                                    Nenhuma movimentação registrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>

        </div>
    );
}

export default Dashboard;


import { useEffect, useState } from "react";

import {
    buscarPastilhas,
    cadastrarPastilha,
    excluirPastilha
} from "../../services/api";

import "./Pastilhas.css";

function Pastilhas() {
    const [pastilhas, setPastilhas] = useState([]);
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [excluindo, setExcluindo] = useState(null);

    const [formulario, setFormulario] = useState({
        codigo: "",
        modelo: "",
        codigo_barras: "",
        descricao: "",
        id_fabricante: "",
        id_fornecedor: "",
        estoque_minimo: "10",
        quantidade_inicial: "0",
        localizacao: "Almoxarifado"
    });

    async function carregarPastilhas() {
        try {
            const dados = await buscarPastilhas();
            setPastilhas(dados);
            setErro("");
        } catch {
            setErro("Não foi possível carregar as pastilhas.");
        }
    }

    useEffect(() => {
        carregarPastilhas();
    }, []);

    function atualizarCampo(event) {
        const { name, value } = event.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    }

    async function salvarPastilha(event) {
        event.preventDefault();

        if (
            !formulario.codigo.trim() ||
            !formulario.modelo.trim() ||
            !formulario.codigo_barras.trim() ||
            !formulario.id_fabricante ||
            !formulario.id_fornecedor
        ) {
            setMensagem("Preencha todos os campos obrigatórios.");
            return;
        }

        if (
            Number(formulario.estoque_minimo) < 0 ||
            Number(formulario.quantidade_inicial) < 0 ||
            !Number.isInteger(Number(formulario.estoque_minimo)) ||
            !Number.isInteger(Number(formulario.quantidade_inicial))
        ) {
            setMensagem("Informe quantidades inteiras iguais ou maiores que zero.");
            return;
        }

        try {
            setCarregando(true);
            setMensagem("");
            setErro("");

            await cadastrarPastilha({
                ...formulario,
                id_fabricante: Number(formulario.id_fabricante),
                id_fornecedor: Number(formulario.id_fornecedor),
                estoque_minimo: Number(formulario.estoque_minimo),
                quantidade_inicial: Number(formulario.quantidade_inicial)
            });

            setMensagem("Pastilha cadastrada com sucesso!");

            setFormulario({
                codigo: "",
                modelo: "",
                codigo_barras: "",
                descricao: "",
                id_fabricante: "",
                id_fornecedor: "",
                estoque_minimo: "10",
                quantidade_inicial: "0",
                localizacao: "Almoxarifado"
            });

            setMostrarFormulario(false);

            await carregarPastilhas();

        } catch (erro) {
            setMensagem(
                erro.message || "Não foi possível cadastrar a pastilha."
            );
        } finally {
            setCarregando(false);
        }
    }

    // EXCLUIR PASTILHA
    async function removerPastilha(pastilha) {
        const confirmar = window.confirm(
            `Deseja realmente excluir a pastilha ${pastilha.modelo} (${pastilha.codigo})?`
        );

        if (!confirmar) {
            return;
        }

        try {
            setExcluindo(pastilha.id_pastilha);
            setMensagem("");
            setErro("");

            const resultado = await excluirPastilha(
                pastilha.id_pastilha
            );

            setMensagem(
                resultado.mensagem || "Pastilha excluída com sucesso!"
            );

            await carregarPastilhas();

        } catch (erro) {
            setErro(
                erro.message || "Não foi possível excluir a pastilha."
            );
        } finally {
            setExcluindo(null);
        }
    }

    const totalPastilhas = pastilhas.length;

    const estoqueCritico = pastilhas.filter(
        (pastilha) =>
            Number(pastilha.quantidade_atual) <=
            Number(pastilha.estoque_minimo)
    ).length;

    const semEstoque = pastilhas.filter(
        (pastilha) => Number(pastilha.quantidade_atual) === 0
    ).length;

    function verificarSituacao(pastilha) {
        const quantidade = Number(pastilha.quantidade_atual);
        const minimo = Number(pastilha.estoque_minimo);

        if (quantidade === 0) {
            return {
                texto: "Sem estoque",
                classe: "pastilhas-status-sem-estoque"
            };
        }

        if (quantidade <= minimo) {
            return {
                texto: "Crítico",
                classe: "pastilhas-status-critico"
            };
        }

        return {
            texto: "Normal",
            classe: "pastilhas-status-normal"
        };
    }

    return (
        <div className="pastilhas-pagina">

            <div className="pastilhas-cabecalho">
                <span className="pastilhas-identificacao">
                    CONTROLE DE MATERIAIS
                </span>

                <h1>Pastilhas em Estoque</h1>

                <p>
                    Consulta e acompanhamento das pastilhas industriais cadastradas.
                </p>
            </div>

            <div className="pastilhas-acoes">
                <button
                    className="pastilhas-botao-adicionar"
                    onClick={() => {
                        setMostrarFormulario(!mostrarFormulario);
                        setMensagem("");
                        setErro("");
                    }}
                >
                    {mostrarFormulario
                        ? "Cancelar cadastro"
                        : "+ Adicionar Pastilha"}
                </button>
            </div>

            {mensagem && (
                <p className="pastilhas-mensagem">
                    {mensagem}
                </p>
            )}

            {mostrarFormulario && (
                <div className="pastilhas-formulario-container">

                    <h2>Cadastro de nova pastilha</h2>

                    <p>
                        Preencha os dados para adicionar uma pastilha ao estoque.
                    </p>

                    <form
                        className="pastilhas-formulario"
                        onSubmit={salvarPastilha}
                    >

                        <div className="pastilhas-campo">
                            <label>Código *</label>
                            <input type="text" name="codigo" value={formulario.codigo} onChange={atualizarCampo} placeholder="Ex.: P016" required />
                        </div>

                        <div className="pastilhas-campo">
                            <label>Modelo *</label>
                            <input type="text" name="modelo" value={formulario.modelo} onChange={atualizarCampo} placeholder="Ex.: CNMG 120412" required />
                        </div>

                        <div className="pastilhas-campo">
                            <label>Código de barras *</label>
                            <input type="text" name="codigo_barras" value={formulario.codigo_barras} onChange={atualizarCampo} placeholder="Digite o código de barras" required />
                        </div>

                        <div className="pastilhas-campo">
                            <label>Fabricante *</label>
                            <select name="id_fabricante" value={formulario.id_fabricante} onChange={atualizarCampo} required>
                                <option value="">Selecione o fabricante</option>
                                <option value="1">Sandvik</option>
                                <option value="2">Kennametal</option>
                                <option value="3">Mitsubishi</option>
                            </select>
                        </div>

                        <div className="pastilhas-campo">
                            <label>Fornecedor *</label>
                            <select name="id_fornecedor" value={formulario.id_fornecedor} onChange={atualizarCampo} required>
                                <option value="">Selecione o fornecedor</option>
                                <option value="1">Fornecedor Industrial A</option>
                                <option value="2">Fornecedor Industrial B</option>
                            </select>
                        </div>

                        <div className="pastilhas-campo">
                            <label>Estoque mínimo *</label>
                            <input type="number" name="estoque_minimo" min="0" step="1" value={formulario.estoque_minimo} onChange={atualizarCampo} required />
                        </div>

                        <div className="pastilhas-campo">
                            <label>Quantidade inicial *</label>
                            <input type="number" name="quantidade_inicial" min="0" step="1" value={formulario.quantidade_inicial} onChange={atualizarCampo} required />
                        </div>

                        <div className="pastilhas-campo">
                            <label>Localização</label>
                            <input type="text" name="localizacao" value={formulario.localizacao} onChange={atualizarCampo} />
                        </div>

                        <div className="pastilhas-campo pastilhas-campo-completo">
                            <label>Descrição</label>
                            <textarea name="descricao" value={formulario.descricao} onChange={atualizarCampo} placeholder="Informações adicionais sobre a pastilha" rows="3" />
                        </div>

                        <div className="pastilhas-formulario-acoes">
                            <button type="submit" disabled={carregando}>
                                {carregando ? "Cadastrando..." : "Salvar pastilha"}
                            </button>
                        </div>

                    </form>
                </div>
            )}

            {erro && (
                <p className="pastilhas-erro">{erro}</p>
            )}

            <div className="pastilhas-indicadores">

                <div className="pastilhas-indicador">
                    <span>Total de modelos</span>
                    <strong>{totalPastilhas}</strong>
                </div>

                <div className="pastilhas-indicador">
                    <span>Estoque normal</span>
                    <strong className="indicador-verde">
                        {totalPastilhas - estoqueCritico}
                    </strong>
                </div>

                <div className="pastilhas-indicador">
                    <span>Estoque crítico</span>
                    <strong className="indicador-vermelho">
                        {estoqueCritico}
                    </strong>
                </div>

                <div className="pastilhas-indicador">
                    <span>Sem estoque</span>
                    <strong className="indicador-vermelho">
                        {semEstoque}
                    </strong>
                </div>

            </div>

            <div className="pastilhas-tabela-container">

                <div className="pastilhas-tabela-cabecalho">
                    <div>
                        <span className="pastilhas-identificacao">
                            INVENTÁRIO
                        </span>

                        <h2>Lista de pastilhas</h2>

                        <p>Quantidade disponível por modelo</p>
                    </div>

                    <span className="pastilhas-total">
                        {totalPastilhas} itens
                    </span>
                </div>

                <table className="pastilhas-tabela">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Modelo</th>
                            <th>Código de barras</th>
                            <th>Estoque atual</th>
                            <th>Estoque mínimo</th>
                            <th>Situação</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {pastilhas.length > 0 ? (
                            pastilhas.map((pastilha) => {
                                const situacao = verificarSituacao(pastilha);

                                return (
                                    <tr key={pastilha.id_pastilha}>
                                        <td>
                                            <strong>{pastilha.codigo}</strong>
                                        </td>

                                        <td>{pastilha.modelo}</td>

                                        <td>{pastilha.codigo_barras}</td>

                                        <td>
                                            <strong>{pastilha.quantidade_atual}</strong>
                                        </td>

                                        <td>{pastilha.estoque_minimo}</td>

                                        <td>
                                            <span className={situacao.classe}>
                                                {situacao.texto}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className="pastilhas-botao-excluir"
                                                onClick={() => removerPastilha(pastilha)}
                                                disabled={excluindo !== null}
                                            >
                                                {excluindo === pastilha.id_pastilha
                                                    ? "Excluindo..."
                                                    : "Excluir"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7">
                                    Nenhuma pastilha encontrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>

        </div>
    );
}

export default Pastilhas;

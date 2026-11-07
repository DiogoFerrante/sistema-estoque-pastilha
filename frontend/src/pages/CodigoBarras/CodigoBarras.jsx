import { useRef, useState } from "react";

import {
    buscarPastilhas,
    registrarEntrada,
    registrarSaida
} from "../../services/api";

import "./CodigoBarras.css";

function CodigoBarras({ usuario }) {
    const campoCodigo = useRef(null);

    const [codigoBarras, setCodigoBarras] = useState("");
    const [pastilha, setPastilha] = useState(null);
    const [quantidade, setQuantidade] = useState("");
    const [operacao, setOperacao] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function consultarCodigo() {
        if (!codigoBarras.trim()) {
            setMensagem("Digite ou leia um código de barras.");
            setTipoMensagem("erro");
            setPastilha(null);
            return;
        }

        try {
            setCarregando(true);
            setMensagem("");
            setPastilha(null);
            setOperacao("");
            setQuantidade("");

            const pastilhas = await buscarPastilhas();

            const resultado = pastilhas.find(
                (item) => item.codigo_barras === codigoBarras.trim()
            );

            if (resultado) {
                setPastilha(resultado);
                setMensagem("Pastilha encontrada com sucesso!");
                setTipoMensagem("sucesso");
            } else {
                setMensagem("Nenhuma pastilha encontrada com esse código.");
                setTipoMensagem("erro");
            }
        } catch (erro) {
            setMensagem("Erro ao consultar o estoque.");
            setTipoMensagem("erro");
        } finally {
            setCarregando(false);
        }
    }

    async function registrarMovimentacao(event) {
        event.preventDefault();

        if (!operacao) {
            setMensagem("Selecione Entrada ou Saída.");
            setTipoMensagem("erro");
            return;
        }

        const quantidadeInformada = Number(quantidade);

        if (
            !Number.isInteger(quantidadeInformada) ||
            quantidadeInformada <= 0
        ) {
            setMensagem("Informe uma quantidade inteira maior que zero.");
            setTipoMensagem("erro");
            return;
        }

        const idUsuario =
            usuario?.id_usuario ??
            usuario?.id ??
            usuario?.usuario?.id_usuario ??
            usuario?.usuario?.id;

        if (!idUsuario) {
            setMensagem("Não foi possível identificar o usuário logado. Faça login novamente.");
            setTipoMensagem("erro");
            return;
        }

        try {
            setCarregando(true);
            setMensagem("");

            if (operacao === "ENTRADA") {
                await registrarEntrada(
                    pastilha.id_pastilha,
                    quantidadeInformada,
                    idUsuario
                );
            } else {
                await registrarSaida(
                    pastilha.id_pastilha,
                    quantidadeInformada,
                    idUsuario
                );
            }

            const pastilhasAtualizadas = await buscarPastilhas();

            const pastilhaAtualizada = pastilhasAtualizadas.find(
                (item) => item.id_pastilha === pastilha.id_pastilha
            );

            setPastilha(pastilhaAtualizada);
            setQuantidade("");
            setOperacao("");
            setCodigoBarras("");

            setMensagem(
                `${operacao === "ENTRADA" ? "Entrada" : "Saída"} registrada com sucesso!`
            );

            setTipoMensagem("sucesso");

            campoCodigo.current?.focus();

        } catch (erro) {
            setMensagem(
                erro.message || "Erro ao registrar movimentação."
            );
            setTipoMensagem("erro");
        } finally {
            setCarregando(false);
        }
    }

    function novaLeitura() {
        setCodigoBarras("");
        setPastilha(null);
        setQuantidade("");
        setOperacao("");
        setMensagem("");
        setTipoMensagem("");

        campoCodigo.current?.focus();
    }

    return (
        <div className="codigo-barras">

            <header className="cb-cabecalho">
                <div>
                    <span className="cb-identificacao">
                        CONTROLE DE ESTOQUE INDUSTRIAL
                    </span>

                    <h1>Entrada e Saída</h1>

                    <p>
                        Consulte pastilhas e registre movimentações
                        utilizando o código de barras.
                    </p>
                </div>

                <div className="cb-etiqueta">
                    DDA METALÚRGICA
                </div>
            </header>

            <section className="cb-leitura">
                <div className="cb-leitura-icone">
                    ▥
                </div>

                <div className="cb-leitura-titulo">
                    <span>LEITOR DE CÓDIGO DE BARRAS</span>
                    <h2>Localizar pastilha</h2>
                    <p>
                        Utilize um leitor ou digite o código manualmente.
                    </p>
                </div>

                <div className="cb-campo-leitura">
                    <input
                        ref={campoCodigo}
                        type="text"
                        placeholder="Digite ou leia o código de barras"
                        value={codigoBarras}
                        onChange={(e) => setCodigoBarras(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                consultarCodigo();
                            }
                        }}
                        autoFocus
                        disabled={carregando}
                    />

                    <button
                        type="button"
                        onClick={consultarCodigo}
                        disabled={carregando}
                    >
                        {carregando ? "Consultando..." : "Consultar código"}
                    </button>
                </div>
            </section>

            {mensagem && (
                <div className={`cb-mensagem ${tipoMensagem}`}>
                    <span>
                        {tipoMensagem === "sucesso" ? "✓" : "!"}
                    </span>
                    {mensagem}
                </div>
            )}

            {pastilha && (
                <section className="cb-resultado">

                    <div className="cb-resultado-cabecalho">
                        <div>
                            <span className="cb-identificacao">
                                IDENTIFICAÇÃO DO MATERIAL
                            </span>

                            <h2>Pastilha localizada</h2>
                        </div>

                        <span className="cb-localizada">
                            <span>●</span> Encontrada
                        </span>
                    </div>

                    <div className="cb-dados-pastilha">
                        <div className="cb-dado">
                            <span>CÓDIGO</span>
                            <strong>{pastilha.codigo}</strong>
                        </div>

                        <div className="cb-dado">
                            <span>MODELO</span>
                            <strong>{pastilha.modelo}</strong>
                        </div>

                        <div className="cb-dado cb-dado-codigo">
                            <span>CÓDIGO DE BARRAS</span>
                            <strong>{pastilha.codigo_barras}</strong>
                        </div>
                    </div>

                    <div className="cb-estoque">
                        <div className="cb-estoque-item">
                            <span>ESTOQUE ATUAL</span>
                            <strong>{pastilha.quantidade_atual}</strong>
                            <small>Unidades disponíveis</small>
                        </div>

                        <div className="cb-estoque-item">
                            <span>ESTOQUE MÍNIMO</span>
                            <strong>{pastilha.estoque_minimo}</strong>
                            <small>Limite de segurança</small>
                        </div>
                    </div>

                    <div className="cb-operacoes">
                        <div className="cb-operacoes-titulo">
                            <h3>Registrar movimentação</h3>
                            <p>Selecione o tipo de operação desejada.</p>
                        </div>

                        <div className="cb-botoes-operacao">
                            <button
                                type="button"
                                className={`cb-botao-operacao cb-botao-entrada ${operacao === "ENTRADA" ? "selecionado" : ""}`}
                                onClick={() => {
                                    setOperacao("ENTRADA");
                                    setMensagem("");
                                    setTipoMensagem("");
                                }}
                                disabled={carregando}
                            >
                                <span>↓</span>
                                <div>
                                    <strong>Entrada</strong>
                                    <small>Adicionar ao estoque</small>
                                </div>
                            </button>

                            <button
                                type="button"
                                className={`cb-botao-operacao cb-botao-saida ${operacao === "SAIDA" ? "selecionado" : ""}`}
                                onClick={() => {
                                    setOperacao("SAIDA");
                                    setMensagem("");
                                    setTipoMensagem("");
                                }}
                                disabled={carregando}
                            >
                                <span>↑</span>
                                <div>
                                    <strong>Saída</strong>
                                    <small>Retirar do estoque</small>
                                </div>
                            </button>
                        </div>

                        {operacao && (
                            <form
                                className="cb-formulario-movimentacao"
                                onSubmit={registrarMovimentacao}
                            >
                                <div>
                                    <label htmlFor="cb-quantidade">
                                        Quantidade da {operacao === "ENTRADA" ? "entrada" : "saída"}
                                    </label>

                                    <input
                                        id="cb-quantidade"
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={quantidade}
                                        onChange={(e) => setQuantidade(e.target.value)}
                                        placeholder="Informe a quantidade"
                                        disabled={carregando}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={carregando}
                                >
                                    {carregando
                                        ? "Registrando..."
                                        : "Confirmar movimentação"}
                                </button>
                            </form>
                        )}
                    </div>

                    <button
                        type="button"
                        className="cb-nova-leitura"
                        onClick={novaLeitura}
                        disabled={carregando}
                    >
                        + Realizar nova leitura
                    </button>

                </section>
            )}

            <div className="cb-informacao">
                <span>ℹ</span>
                <p>
                    Todas as movimentações são registradas no histórico
                    do sistema e atualizam automaticamente o estoque.
                </p>
            </div>

        </div>
    );
}

export default CodigoBarras;
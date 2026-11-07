import { useEffect, useState } from "react";

import {
    buscarPastilhas,
    registrarSaida
} from "../../services/api";

function Saida() {
    const [pastilhas, setPastilhas] = useState([]);
    const [pastilhaSelecionada, setPastilhaSelecionada] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function carregarPastilhas() {
        try {
            const dados = await buscarPastilhas();
            setPastilhas(dados);
        } catch (erro) {
            setMensagem("Erro ao carregar as pastilhas.");
            setTipoMensagem("erro");
        }
    }

    useEffect(() => {
        carregarPastilhas();
    }, []);

    async function registrarSaidaEstoque(event) {
        event.preventDefault();

        setMensagem("");
        setTipoMensagem("");

        if (!pastilhaSelecionada || !quantidade) {
            setMensagem("Selecione uma pastilha e informe a quantidade.");
            setTipoMensagem("erro");
            return;
        }

        const quantidadeInformada = Number(quantidade);

        if (!Number.isInteger(quantidadeInformada) || quantidadeInformada <= 0) {
            setMensagem("Informe uma quantidade inteira maior que zero.");
            setTipoMensagem("erro");
            return;
        }

        try {
            setCarregando(true);

            await registrarSaida(
                Number(pastilhaSelecionada),
                quantidadeInformada
            );

            setMensagem("Saída registrada com sucesso!");
            setTipoMensagem("sucesso");

            setQuantidade("");
            setPastilhaSelecionada("");

            await carregarPastilhas();

        } catch (erro) {
            setMensagem(erro.message);
            setTipoMensagem("erro");

        } finally {
            setCarregando(false);
        }
    }

    return (
        <div>
            <h1>Saída de Estoque</h1>

            {mensagem && (
                <p
                    style={{
                        color: tipoMensagem === "sucesso" ? "green" : "red",
                        fontWeight: "bold",
                        margin: "15px 0"
                    }}
                >
                    {mensagem}
                </p>
            )}

            <form onSubmit={registrarSaidaEstoque}>

                <label>Pastilha:</label>

                <br />

                <select
                    value={pastilhaSelecionada}
                    onChange={(event) =>
                        setPastilhaSelecionada(event.target.value)
                    }
                >
                    <option value="">
                        Selecione uma pastilha
                    </option>

                    {pastilhas.map((pastilha) => (
                        <option
                            key={pastilha.id_pastilha}
                            value={pastilha.id_pastilha}
                        >
                            {pastilha.codigo} - {pastilha.modelo}
                            {" | Estoque: "}
                            {pastilha.quantidade_atual}
                        </option>
                    ))}
                </select>

                <br />
                <br />

                <label>Quantidade:</label>

                <br />

                <input
                    type="number"
                    min="1"
                    step="1"
                    value={quantidade}
                    onChange={(event) =>
                        setQuantidade(event.target.value)
                    }
                />

                <br />
                <br />

                <button type="submit" disabled={carregando}>
                    {carregando ? "Registrando..." : "Registrar Saída"}
                </button>

            </form>
        </div>
    );
}

export default Saida;
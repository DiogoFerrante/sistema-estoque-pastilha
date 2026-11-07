import { useEffect, useState } from "react";
import {
    buscarPastilhas,
    registrarEntrada
} from "../../services/api";

function Entrada() {
    const [pastilhas, setPastilhas] = useState([]);
    const [pastilhaSelecionada, setPastilhaSelecionada] = useState("");
    const [quantidade, setQuantidade] = useState("");

    useEffect(() => {
        buscarPastilhas()
            .then((dados) => {
                setPastilhas(dados);
            })
            .catch(() => {
                console.log("Erro ao carregar as pastilhas.");
            });
    }, []);

    async function registrarEntradaEstoque(event) {
        event.preventDefault();

        if (!pastilhaSelecionada || !quantidade) {
            alert("Selecione uma pastilha e informe a quantidade.");
            return;
        }

        try {
            await registrarEntrada(
                Number(pastilhaSelecionada),
                Number(quantidade)
            );

            alert("Entrada registrada com sucesso!");

            setQuantidade("");
            setPastilhaSelecionada("");
        } catch (erro) {
            alert("Erro ao registrar entrada.");
        }
    }

    return (
        <div>
            <h1>Entrada de Estoque</h1>

            <form onSubmit={registrarEntradaEstoque}>

                <label>Pastilha:</label>

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
                        </option>
                    ))}
                </select>

                <br />
                <br />

                <label>Quantidade:</label>

                <input
                    type="number"
                    min="1"
                    value={quantidade}
                    onChange={(event) =>
                        setQuantidade(event.target.value)
                    }
                />

                <br />
                <br />

                <button type="submit">
                    Registrar Entrada
                </button>

            </form>
        </div>
    );
}

export default Entrada;
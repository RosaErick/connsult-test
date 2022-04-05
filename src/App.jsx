import { useState, useRef } from "react";
import api from "./service/api";

export default function App() {
  const [cep, setCep] = useState("");
  const inputRef = useRef(null);
  const [cepUser, setCepUser] = useState(null);

  async function searchCep() {
    if (cep == "") {
      alert("Digite um cep válido");
      setCep("");
      return;
    }
    try {
      const response = await api.get(`/${cep}/json`);
      console.log(response.data);
      setCepUser(response.data);
    } catch (error) {
      console.log("ERROR: " + error);
    }
  }

  function cleanData() {
    setCep("");
    setCepUser(null);
    inputRef.current.focus();
  }

  return (
    <>
      <h2>Digite o CEP Desejado</h2>
      <input
        type="text"
        placeholder="Ex: 20560-000"
        value={cep}
        onChange={(text) => setCep(text.target.value)}
        keyboardtype="numeric"
        ref={inputRef}
      />
      <button onClick={searchCep}>Pesquisar</button>
      <button onClick={cleanData}>Limpar</button>

      {cepUser && (
        <div>
          <p>
            {cepUser.logradouro}, {cepUser.bairro}, {cepUser.localidade},{" "}
            {cepUser.uf}, {cepUser.cep}
          </p>
        </div>
      )}

      <div className="container">
        <h2>Histórico de pesqusas</h2>
      </div>
    </>
  );
}

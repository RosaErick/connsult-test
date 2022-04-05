import { useState, useRef } from "react";
import api from "./service/api";

export default function App() {
  const [cep, setCep] = useState("");
  const inputRef = useRef(null);
  const [cepUser, setCepUser] = useState(null);
  const [cepHistory, setCepHistory] = useState([]);
  const [searchResponse, setSearchResponse] = useState(null);

  async function searchCep() {


    if (cep == "" || cep.length < 8) {
      setSearchResponse("Digite um CEP válido");
      setCep("");
      return;
    }
    try {
      const response = await api.get(`/${cep}/json`);
      console.log(response.data);
      const res = response.data;
      setCepUser(response.data);

      const searchData = [];

      searchData.push({
        Cep: res.cep,
        Logradouro: res.logradouro,
        Bairro: res.bairro,
        Localidade: res.localidade,
        UF: res.uf,
      });

      setCepHistory((prev) => searchData.concat(prev));

      localStorage.setItem("CepHistory", JSON.stringify(cepHistory));
      console.log(searchData);
      console.log(cepHistory);
      inputRef.current.focus();
    } catch (error) {
      console.log("ERROR: " + error);
    }
  }

  function cleanData() {
    setCep("");
    setCepUser(null);
    inputRef.current.focus();
  }

  function cleanHistory() {
    setCepHistory([]);
    localStorage.removeItem("searchData");
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
      {searchResponse ? <p>{searchResponse}</p> : null}
      {cepUser && (
        <div>
          <p>
            {cepUser.logradouro}, {cepUser.bairro}, {cepUser.localidade},{" "}
            {cepUser.uf}, {cepUser.cep}
          </p>
        </div>
      )}

      <div className="container">
        <h2>Histórico de pesquisas</h2>
        <ul>
          {" "}
          {cepHistory.map((cep) => (
            <li key={cep.Cep}>
              {cep.Cep} - {cep.Logradouro}, {cep.Bairro}, {cep.Localidade},{" "}
              {cep.UF}
            </li>
          ))}
        </ul>
        <button onClick={cleanHistory}>Limpar</button>
      </div>
    </>
  );
}

import { useState, useRef } from "react";
import api from "./service/api";
import "./App.css";

export default function App() {
  const [cep, setCep] = useState("");
  const inputRef = useRef(null);
  const [cepUser, setCepUser] = useState(null);
  const [cepHistory, setCepHistory] = useState([]);
  const [searchResponse, setSearchResponse] = useState(null);


    //Persistir historico no LocalStorage
  let cepHistoryLocalStorage = [];
  const cepHistoryRaw = localStorage.getItem("cepHistory");
  if (cepHistoryRaw) {
    cepHistoryLocalStorage = JSON.parse(cepHistoryRaw);
  }

  //Procurar o CEP via API
  async function searchCep() {
    if (cep == "" || cep.length < 8) {
      setSearchResponse("Digite um CEP válido");
      setCep("");
      return;
    }
    try {
      const response = await api.get(`/${cep}/json`);
      setSearchResponse(null);
      const res = response.data;
      setCepUser(response.data);
      
      
      
        //Criar um array de objetos para armazenar os dados do CEP
      localStorage.setItem("cepHistory", JSON.stringify(cepHistory));
      const searchData = [];
      searchData.push({
        Logradouro: res.logradouro,
        Bairro: res.bairro,
        Localidade: res.localidade,
        UF: res.uf,
        Cep: res.cep,
      });
        //Acumula os dados de CEP buscado no LocalStorage
      //setCepHistory((prev) => searchData.concat(prev));
      setCepHistory((prev = []) => [...prev, ...searchData]);
      

      console.log(searchData);
      console.log(cepHistory);
      inputRef.current.focus();
    } catch (error) {
      //Log de Erro
      console.log("ERROR: " + error);
    }
  }

    //Limpa Dados do campo de busca
  function cleanData() {
    setCep("");
    setCepUser(null);
    inputRef.current.focus();
  }

  //Limpa Dados do Historico
  function cleanHistory() {
    setCepHistory([]);
    localStorage.removeItem("cepHistory");
  }

  return (
    <>
      
      <div className="main-container">

        <h2>Digite o CEP Desejado</h2>
        <div className="input-container">
      <input
        type="text"
        placeholder="Ex: 20560-000"
        value={cep}
        onChange={(text) => setCep(text.target.value)}
        keyboardtype="numeric"
        ref={inputRef}
      />
        <div className="buttons-container">
      <button onClick={searchCep}>Pesquisar</button>
          <button onClick={cleanData}>Limpar</button>
          </div>
          </div>
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
          {/*map com persist(nao some quando da reload na pagina)*/}
          {/*cepHistoryLocalStorage.map((cep) => (
            <li key={cep.Cep}>
              {cep.Logradouro}, {cep.Bairro}, {cep.Localidade},{" "}
              {cep.UF}, {cep.Cep}
            </li>
          ))*/}

          {/*map sem persist(some quando da reload na pagina)*/}
          {cepHistory && cepHistory.map((cep) => (
            <li key={cep.Cep}>
              {cep.Logradouro}, {cep.Bairro}, {cep.Localidade},{" "}
              {cep.UF}, {cep.Cep}
            </li>
          ))}
        </ul>
        <button onClick={cleanHistory}>Limpar</button>
        </div>
        </div>
    </>
  );
}

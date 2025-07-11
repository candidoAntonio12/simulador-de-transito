import { Outlet } from "react-router-dom";
import "./configurar.css"
import "./RegisterForm.css";
import { routes } from "../../../main";
import { addCarros } from "../context/CarroContext";
import { useState } from "react";

export default function Configurar()
{

    return (
    <>
    <div className="container-config">
            <div className="vehicle-interface">
            <h1 className="title">Simulador De Trânsito Inteligente</h1>
            <div className="menu-options">
                <button onClick={onAdicionarVeiculo} className="menu-button">Adicionar Veículo</button>
                <button className="menu-button">Gerar Veículos Automaticamente</button>
                <button className="menu-button">Voltar</button>
            </div>
        </div>
        <Outlet/>
    </div>
         
    </>
    )
}
export  function RegisterForm() {

  const [faixa, setFaixa] = useState(0);
  const [direcao, setDirecao] = useState("");
  const [cor, setCor] = useState("");
  
const handleFaixa = (c : string) =>
{
    setFaixa(parseInt(c));
}
const handleDirecao = (d : string) =>
{
    setDirecao(d)
}

  return (
    <div className="form-container">
      <form className="register-form">
        <div className="form-header">
          <div className="city-lineart" />
        </div>
        <div className="form-row">
          <br />
            <label htmlFor="">Selecione uma Faixa:</label>
        </div>
        <select value={faixa} onChange={(e) =>handleFaixa(e.target.value)}>
          <optgroup>
                <option value="0">0</option>
                <option value="1">1</option>
          </optgroup>
         </select> 
         <div className="form-row">
          <br />
            <label htmlFor="">Selecione e Direcao:</label>
        </div>
         <select value={direcao} onChange={(e) => handleDirecao(e.target.value)} >
              <optgroup>
                <option value="H">H</option>
                <option value="V">V</option>
            </optgroup>
         </select>
        <div className="form-row">
            <label htmlFor="">Cor</label>
        </div>
        <input type="color" onChange={(ev) => setCor(ev.target.value)} title="Pick your favorite color" />
        <button onClick={() =>addCarros(direcao, faixa, cor)} type="button">Submit</button>
      </form>
    </div>
  );
}
const onAdicionarVeiculo = ()=>
{
    routes.navigate("form");
}

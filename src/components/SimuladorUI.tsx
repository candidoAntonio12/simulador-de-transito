import React, { useState } from "react";
import "./SimuladorTransito.css";
import Simulador from "./Simulador";
import { useNavigate } from "react-router-dom";

export default function SimuladorTransito() {
  
  const [simulacaoIniciada, setSimulacaoIniciada] = useState(false);
  const navigator = useNavigate();
  const iniciarSimulacao = () => setSimulacaoIniciada(true);
  const pausarSimulacao = () => setSimulacaoIniciada(false);
  const reiniciarSimulacao = () => {
    setSimulacaoIniciada(false);
    setTimeout(() => setSimulacaoIniciada(true), 500);
  };
  const pararSimulacao = () => setSimulacaoIniciada(false);
  const voltar = () => {
    // Lógica para voltar ao menu principal ou outra tela
  };
  const onVoltar = ()=>
  {
    navigator("../",{replace: true});  
  }

  return (
    <div className="container">
      <h1 className="titulo">Simulador De Trânsito Inteligente</h1>

      <div className="simulador">
        <div className="area-simulacao">
            <Simulador/>
        </div>

        {/* Botões de controle */}
        <div className="painel-controle">
          <button onClick={iniciarSimulacao}>Iniciar Simulação</button>
          <button onClick={pausarSimulacao}>Pausar Simulação</button>
          <button onClick={reiniciarSimulacao}>Reiniciar Simulação</button>
          <button onClick={pararSimulacao}>Parar Simulação</button>
          <button className="voltar" onClick={onVoltar}>Voltar</button>
        </div>
      </div>
    </div>
  );
}

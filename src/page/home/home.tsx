import { routes } from "../../main"
import "./home.css"

export default function Home()
{

    return(
    <>
        <div className="container-home">
            <div className="tela-inicial">
                <img src="/src/assets/simulador.png" alt="imagem" />
            </div>
            <div className="painel-controle">
                <button onClick={onSimulacao} >Iniciar Simulação</button>
                <button onClick={onConfigurar} >Configurar Simulação</button>
                <button >Historico de Simulação</button>
                <button >Sobre</button>
                <button >Voltar</button>
          </div>
        </div> 
    </>
)
}
const onSimulacao = ()=>
{
    routes.navigate("tela-simulacao");
}
const onConfigurar = ()=>
{
    routes.navigate("configurar-simulacao");
}
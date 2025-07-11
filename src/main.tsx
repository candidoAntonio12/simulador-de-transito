import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './page/home/home';
import SimuladorTransito from './components/SimuladorUI';
import Configurar, { RegisterForm } from './page/simulacao/Configurar/Configurar';
import { carroContext, carros } from './page/simulacao/context/CarroContext';

export const routes = createBrowserRouter([
  {path: "/" , element: <Home/>},
  {path : "/tela-simulacao", element: <SimuladorTransito/>},
  {path: "/configurar-simulacao" , element: <Configurar/>,
  children:[{
    path:"form",
    element:<RegisterForm/>
  }]}

]);
createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <carroContext.Provider value={carros}>
            <RouterProvider router={routes}/>
      </carroContext.Provider>
    </StrictMode>    
)

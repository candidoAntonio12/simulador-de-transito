import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './page/home/home';
import SimuladorTransito from './components/SimuladorUI';
import Configurar from './page/simulacao/configurar';

export const routes = createBrowserRouter([
  {path: "/" , element: <Home/>},
  {path : "/tela-simulacao", element: <SimuladorTransito/>},
  {path: "/configurar-simulacao" , element: <Configurar/>}

]);
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={routes}/>
    </StrictMode>    
)

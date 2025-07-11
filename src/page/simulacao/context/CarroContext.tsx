import { createContext } from "react";

export const carros = [{ x: -140, y: 240, vel: 6, cor: 'lightblue', dir: 'H', faixa: 0, ativo: false }];

/*{ x: -80, y: 240, vel: 6, cor: 'blue', dir: 'H', faixa: 0, ativo: true },
          { x: -140, y: 240, vel: 6, cor: 'lightblue', dir: 'H', faixa: 0, ativo: true },
          { x: -80, y: 520, vel: 6, cor: 'red', dir: 'H', faixa: 1, ativo: true },
          { x: -140, y: 520, vel: 6, cor: 'pink', dir: 'H', faixa: 1, ativo: true },
          { x: 440, y: -80, vel: 76, cor: 'green', dir: 'V', faixa: 0, ativo: true },
          { x: 440, y: -140, vel: 17, cor: 'lime', dir: 'V', faixa: 0, ativo: true },
          { x: 640, y: -80, vel: 11, cor: 'orange', dir: 'V', faixa: 1, ativo: true },
          { x: 640, y: -140, vel: 9, cor: 'yellow', dir: 'V', faixa: 1, ativo: true },
          { x: 640, y: -200, vel: 5, cor: 'gold', dir: 'V', faixa: 1, ativo: true }*/
export const carroContext = createContext(carros);

export function addCarros(dir = "V",faixa = 1, cor = "pink" )
{
    Math.random()
    console.log(faixa);
    if (dir == "H")
        {
            if(faixa == 1)
                carros.push({ x: -140 - Math.random() , y: 240, vel: 6, cor: cor, dir: dir, faixa: faixa, ativo: true })
            else
                carros.push({ x: -80 - Math.random(), y: 520, vel: 6, cor: cor, dir: dir, faixa: faixa, ativo: true })
        }
    else{
       if(faixa == 0)
                carros.push({x: 440 , y: -80 + Math.random(), vel: 6, cor: cor, dir: dir, faixa: faixa, ativo: true })
            else
                carros.push({x: 640, y: -80 + Math.random(), vel: 6, cor: cor, dir: dir, faixa: faixa, ativo: true })
        }    
        for (const carro of carros) {
                console.log(carro.dir);
        }       
}

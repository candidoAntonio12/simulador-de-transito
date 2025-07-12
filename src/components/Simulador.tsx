import React, { useContext, useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import * as tf from '@tensorflow/tfjs';
import { criarModelo, treinarModelo } from '../logic/ia';
import { carroContext} from './../page/simulacao/context/CarroContext';

const Simulador: React.FC = () => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const [modelo, setModelo] = useState<tf.LayersModel | null>(null);
  const carrosv = useContext(carroContext);
  
  useEffect(() => {
    const modelo = criarModelo();
    setModelo(modelo);
    treinarModelo(modelo);
    

    const sketch = (p: p5) => {
      type Carro = { x: number; y: number; vel: number; cor: string; dir: 'H' | 'V'; faixa: number; ativo: boolean };
      let carros: Carro[] = [];
      let semaforoEstado = 'H';
      let tempoAtual = 0;
      const fps = 190;
      let duracaoVerde = 5;
      const duracaoAmarelo = 0.5;
      let fase = 'verde';
      let tempoRestante = duracaoVerde;

      const gerarCarro = () => {
        carros = [];
        const tipos: Carro[] = carrosv;
        
        for (const tipo of tipos) {
          if (!carros.some(c => c.x === tipo.x && c.y === tipo.y)) {
            carros.push({ ...tipo });
          }
        }
      };
      const qtV = ()=>
      { 
        return carros.filter((c) => c.dir == "V").length;
      }
      
      const qtH = ()=>
      { 
        return carros.filter((c) => c.dir == "H").length;
      }
      const prioridade = ()=>
      {
        if (qtV > qtH && duracaoVerde < 6)
            duracaoVerde += 5;
          else if (qtH > qtV && duracaoVerde < 6)
                duracaoVerde+=5;
            duracaoVerde = 5;
      } 

      p.setup = () => {
        p.createCanvas(1000, 650);
        gerarCarro();
      };

      const desenharCarro = (x: number, y: number, dir: 'H' | 'V', cor: string) => {
        p.push();
        p.translate(x, y);
        if (dir === 'V') p.rotate(p.HALF_PI);
        p.fill(cor);
        p.rectMode(p.CENTER);
        p.rect(0, 0, 40, 20, 5);
        p.pop();
      };

      const carroPodeAndar = (carro: Carro, outros: Carro[]) => {
        const margem = 100;
        
        // Verifica se há carros à frente na mesma faixa
        const frente = outros.find(
          c => c !== carro && c.ativo && c.dir === carro.dir && c.faixa === carro.faixa &&
          ((carro.dir === 'H' && c.y === carro.y && c.x > carro.x && c.x - carro.x < margem) ||
           (carro.dir === 'V' && c.x === carro.x && c.y > carro.y && c.y - carro.y < margem))
        );
        if (frente) return false;

        if ((carro.dir === 'H' && semaforoEstado !== 'H') || 
            (carro.dir === 'V' && semaforoEstado !== 'V')) {
          return false;
        }

        return true;
      };

  p.draw = () => {
        p.background(220);
        p.fill('gray');
        p.rect(0, 200, 1000, 100);
        p.rect(0, 480, 1000, 100);
        p.rect(400, 0, 100, 1000);
        p.rect(600, 0, 100, 1000);

        p.stroke(255);
        p.strokeWeight(2);
        for (let i = 1; i < 10; i++) {
          p.line(i * 100, 250, i * 100 - 50, 250);
          p.line(i * 100, 530, i * 100 - 50, 530);
        }
        for (let i = 1; i < 10; i++) {
          p.line(450, i * 100, 450, i * 100 - 50);
          p.line(650, i * 100, 650, i * 100 - 50);
        }
        p.noStroke();

        tempoAtual++;
        if (tempoAtual >= fps) {
          tempoRestante--;
          tempoAtual = 0;
        }

        if (tempoRestante <= 0) {
          if (fase === 'verde') {
            fase = 'amarelo';
            tempoRestante = duracaoAmarelo;
          } else {
            fase = 'verde';
            tempoRestante = duracaoVerde;
            semaforoEstado = semaforoEstado === 'H' ? 'V' : 'H';
          }
          
        }

        for (let carro of carros) {
          if (!carro.ativo) continue;
          if (carroPodeAndar(carro, carros)) {
            if (carro.dir === 'H') carro.x += carro.vel;
            else carro.y += carro.vel;
          }
          desenharCarro(carro.x, carro.y, carro.dir, carro.cor);
            if (carro.x > 100 || carro.y > 100) {
             carro.ativo = false;
            setTimeout(() => gerarCarro(), 1000 * Math.round(0.1) * Math.round(60));
          }
        }

        let corH = 'red';
        let corV = 'red';
        if (semaforoEstado === 'H') 
          {
            corH = fase === 'verde' ? 'green' : 'yellow';
            //prioridade();
          }
        else corV = fase === 'verde' ? 'green' : 'yellow';

        p.fill(corH);
        p.ellipse(375, 225, 20, 20);

        p.fill(corV);
        p.ellipse(425, 500, 20, 20);
        p.ellipse(625, 500, 20, 20);

        p.fill(0);
        p.textAlign(p.CENTER);
        p.textSize(16);
        p.text(`Fase: ${fase} | ${semaforoEstado === 'H' ? 'Horizontal' : 'Vertical'} | ${tempoRestante}s`, 500, 50);
      };
    };

    const canvas = new p5(sketch, sketchRef.current!);
    return () => {
      canvas.remove();
      modelo.dispose();
    };
  }, []);

  return <div ref={sketchRef}></div>;
};
export default Simulador; 


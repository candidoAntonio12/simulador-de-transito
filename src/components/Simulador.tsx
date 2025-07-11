import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import * as tf from '@tensorflow/tfjs';
import { criarModelo, treinarModelo } from '../logic/ia';

const Simulador: React.FC = () => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const [modelo, setModelo] = useState<tf.LayersModel | null>(null);

  useEffect(() => {
    const modelo = criarModelo();
    setModelo(modelo);
    treinarModelo(modelo);
    

    const sketch = (p: p5) => {
      type Carro = { x: number; y: number; vel: number; cor: string; dir: 'H' | 'V'; faixa: number; ativo: boolean };
      const carros: Carro[] = [];
      let semaforoEstado = 'H';
      let tempoRestante = 5;
      let tempoAtual = 0;
      const fps = 170;
      const duracaoVerde = 5;
      const duracaoAmarelo = 0.5
      let fase = 'verde';

      const gerarCarro = () => {
        const tipos: Carro[] = [
          { x: -80, y: 240, vel: 2, cor: 'blue', dir: 'H', faixa: 0, ativo: true },
          { x: -140, y: 240, vel: 2, cor: 'lightblue', dir: 'H', faixa: 0, ativo: true },
          { x: -80, y: 520, vel: 2, cor: 'red', dir: 'H', faixa: 1, ativo: true },
          { x: -140, y: 520, vel: 2, cor: 'pink', dir: 'H', faixa: 1, ativo: true },
          { x: 440, y: -80, vel: 2, cor: 'green', dir: 'V', faixa: 0, ativo: true },
          { x: 440, y: -140, vel: 2, cor: 'lime', dir: 'V', faixa: 0, ativo: true },
          { x: 640, y: -80, vel: 2, cor: 'orange', dir: 'V', faixa: 1, ativo: true },
          { x: 640, y: -140, vel: 2, cor: 'yellow', dir: 'V', faixa: 1, ativo: true },
          { x: 640, y: -200, vel: 2, cor: 'gold', dir: 'V', faixa: 1, ativo: true }
        ];

        for (const tipo of tipos) {
          if (!carros.some(c => c.x === tipo.x && c.y === tipo.y)) {
            carros.push({ ...tipo });
          }
        }
      };

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

      const prioridadeCruzamento = (carro: Carro, outros: Carro[]) => {
        if (carro.dir === 'H') {
          return !outros.some(c => c !== carro && c.ativo && c.dir === 'V' &&
            c.x >= 200 && c.x <= 400 && c.y >= 480 && c.y <= 680);
        } else {
          return !outros.some(c => c !== carro && c.ativo && c.dir === 'H' &&
            c.x >= 480 && c.x <= 680 && c.y >= 200 && c.y <=  400);
        }
      };

      const carroPodeAndar = (carro: Carro, outros: Carro[]) => {
        const margem = 20;
        const cruzamentoInicioX = 0;
        const cruzamentoFimX = 480;
        const cruzamentoInicioY = 0;
        const cruzamentoFimY = 680;
        
        const frente = outros.find(
          c => c !== carro && c.ativo && c.dir === carro.dir && c.faixa === carro.faixa &&
          ((carro.dir === 'H' && c.y === carro.y && c.x > carro.x && c.x - carro.x < margem) ||
           (carro.dir === 'V' && c.x === carro.x && c.y > carro.y && c.y - carro.y < margem))
        );
        if (frente) return false;

        const entradaCruzamento = carro.dir === 'H'
          ? carro.x + carro.vel >= cruzamentoInicioX && carro.x < cruzamentoInicioX
          : carro.y + carro.vel >= cruzamentoInicioY && carro.y < cruzamentoInicioY;

        if (entradaCruzamento) {
          const bloqueado = outros.some(c => c !== carro && c.ativo &&
            ((carro.dir === 'H' && c.x >= cruzamentoInicioX && c.x <= cruzamentoFimX && c.y === carro.y) ||
             (carro.dir === 'V' && c.y >= cruzamentoInicioY && c.y <= cruzamentoFimY && c.x === carro.x)));
          if (bloqueado || !prioridadeCruzamento(carro, outros)) return false;
        }

        const estaNoCruzamento =
          (carro.dir === 'H' && carro.x >= cruzamentoInicioX && carro.x <= cruzamentoFimX) ||
          (carro.dir === 'V' && carro.y >= cruzamentoInicioY && carro.y <= cruzamentoFimY);

        if (fase === 'verde') return carro.dir === semaforoEstado;
        if (fase === 'amarelo') return carro.dir === semaforoEstado && estaNoCruzamento;

        return false;
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

          if (carro.x > 1100 || carro.y > 1100) {
            carro.ativo = false;
            setTimeout(() => gerarCarro(), 1000);
          }
        }

        let corH = 'red';
        let corV = 'red';
        if (semaforoEstado === 'H') corH = fase === 'verde' ? 'green' : 'yellow';
        else corV = fase === 'verde' ? 'green' : 'yellow';

        p.fill(corH);
        //p.ellipse(475, 375, 20, 20);
        //p.ellipse(475, 575, 20, 20);
        p.ellipse(375, 225, 20, 20);
        //p.ellipse(575, 225, 20, 20);
        //p.ellipse(375, 500, 20, 20);
        //p.ellipse(575, 500, 20, 20);

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

  return <div  ref={sketchRef}></div>;
};

export default Simulador;

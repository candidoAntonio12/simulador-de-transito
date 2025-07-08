import * as tf from '@tensorflow/tfjs';

export function criarModelo(): tf.Sequential {
  const modelo = tf.sequential();
  modelo.add(tf.layers.dense({ inputShape: [2], units: 8, activation: 'relu' }));
  modelo.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
  modelo.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
  return modelo;
}

export async function treinarModelo(modelo: tf.LayersModel) {
  const x = tf.tensor2d([
    [5, 0], [1, 4], [3, 3], [2, 6], [6, 1], [0, 7], [10, 2], [1, 9], [8, 3], [0, 10]
  ]);
  const y = tf.tensor2d([
    [1], [0], [0.5], [0], [1], [0], [1], [0], [1], [0]
  ]);
  await modelo.fit(x, y, {
    epochs: 200,
    shuffle: true,
    verbose: 0,
  });
}

export async function preverTroca(modelo: tf.LayersModel, faixaH: number, faixaV: number): Promise<number> {
  const input = tf.tensor2d([[faixaH, faixaV]]);
  const output = modelo.predict(input) as tf.Tensor;
  const resultado = await output.data();
  return resultado[0];
}

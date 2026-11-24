// @ts-check
// Testes do mod "descanso", rodados por `node packages/cli/cli.js test mods-dev/descanso` num servidor de verdade (docs/sdk-test.md).
/** @type {import('../../../packages/cli/types/mineclaude-mod').TestFileFn} */
export default function (test) {
  test('o saco de dormir é um bloco do mundo', async (t) => {
    const { x, y, z } = t.world.spawn;
    t.assert(t.world.set(x, y + 20, z, 'descanso:sleeping_bag'), 'o servidor recusou pôr o bloco');
    t.equal(t.world.get(x, y + 20, z), 'descanso:sleeping_bag');
    t.world.set(x, y + 20, z, 'air');
    t.equal(t.world.get(x, y + 20, z), 'mineclaude:air', 'tirar o bloco deixa ar');
  });

  test('clicar no saco de dormir marca o ponto de renascimento', async (t) => {
    const p = await t.player();
    await t.tick(5);
    const at = p.pos;
    t.assert(at, 'o jogador de teste não está no mundo');
    const bx = Math.floor(at.x), by = Math.floor(at.y), bz = Math.floor(at.z) + 1;
    t.assert(t.world.set(bx, by, bz, 'descanso:sleeping_bag'), 'não deu para pôr o saco ao lado do jogador');
    p.send({ t: 'interact', x: bx, y: by, z: bz });
    await t.tick(10);
    const s = p.server.acc?.spawn; // onde o jogo guarda o ponto de renascimento da conta
    t.assert(s, 'o jogador não ficou com ponto de renascimento');
    t.equal([Math.floor(s.x), Math.floor(s.y), Math.floor(s.z)], [bx, by, bz], 'o ponto é o do saco');
  });
}

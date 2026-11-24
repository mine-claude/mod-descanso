// @ts-check
import { BlockType, PlayerSystemType } from './mineclaude-sdk.js';

// A sleeping bag: right click saves the respawn point (player.setSpawnPoint), the night is NOT skipped (the game has no
// sleep: this mod does not touch the clock). It is the same hook the game's bed uses (onInteract), and a respawn rule of
// its own (respawnPoint) because the game's rule only honors beds.
export class SleepingBag extends BlockType {
  name = 'Saco de dormir';
  solid = false;
  noCollide = true;
  transparent = true;
  hardness = 0.2;
  /** @type {'slab'} */
  shape = 'slab';
  tiles = { top: 'wool_red', side: 'wool_red', bottom: 'wool_red' };
  // ground floor only: needs a full top face under it (declared, the engine checks it like the torch's)
  /** @type {{ support: 'floor', requireHit: boolean }} */
  placement = { support: 'floor', requireHit: false };

  /** @returns {'success'} */
  onInteract(e) {
    if (e.player.room !== 'mundo') return 'success'; // like the bed: outside the world nothing is saved
    e.player.setSpawnPoint({ x: e.pos.x + 0.5, y: e.pos.y, z: e.pos.z + 0.5 });
    e.player.message('Você marcou este saco de dormir como ponto de renascimento. A noite continua.');
    return 'success';
  }
}

// Decides the respawn point before the game's own rule (order < 0): the saved point wins while the bag is still there.
// Without it, nothing is answered and the game's rule runs (and forgets a point that is not a bed).
export class BagRespawn extends PlayerSystemType {
  order = -10;
  respawnPoint(e) {
    const s = e.player.spawnPoint;
    if (!s || s.dimension !== e.player.dimension) return;
    const here = { x: Math.floor(s.x), y: Math.floor(s.y), z: Math.floor(s.z) };
    if (e.world.getBlock(here, { load: true }) === 'descanso:sleeping_bag') return { x: s.x, y: s.y, z: s.z };
  }
}

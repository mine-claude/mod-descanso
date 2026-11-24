// @ts-check
import { BlockType } from './mineclaude-sdk.js';

const CLOSED = /** @type {const} */ ('descanso:trapdoor'), OPEN = 'descanso:trapdoor_open';

// A trapdoor made only of block hooks, the way the game's door and gate are:
//  - canPlaceAt: only over something solid, and only where the player may edit (the lobby is protected);
//  - onInteract: swaps closed and open; it does not close on someone (world.isOccupied) and, since the browser already
//    drew the swap, player.resyncBlock puts the real block back on that player's screen.
export class Trapdoor extends BlockType {
  name = 'Alçapão';
  solid = true;
  hardness = 1;
  tool = 'axe';
  /** @type {'slab'} */
  shape = 'slab';
  tiles = { top: 'planks', side: 'planks', bottom: 'planks' };

  canPlaceAt(e) {
    return e.world.isSolid({ x: e.pos.x, y: e.pos.y - 1, z: e.pos.z }) === true && e.player.canEdit(e.pos);
  }

  /** @returns {'success'} */
  onInteract(e) {
    const to = e.block === CLOSED ? OPEN : CLOSED;
    if (to === CLOSED && e.world.isOccupied(e.pos, to)) e.player.resyncBlock(e.pos);
    else e.world.setBlock(e.pos, to);
    return 'success';
  }
}

export class TrapdoorOpen extends Trapdoor {
  name = 'Alçapão aberto';
  solid = false;
  noCollide = true;
  transparent = true;
  /** @type {`${string}:${string}`} */
  drop = CLOSED; // breaking it open gives the same item
}

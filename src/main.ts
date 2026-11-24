// @ts-check
// Descanso: a sleeping bag and a trapdoor, made only with the public API (block hooks, player.setSpawnPoint, a respawn rule).
import { ModInitializer } from './mineclaude-sdk.js';
import { SleepingBag, BagRespawn } from './sleeping_bag.ts';
import { Trapdoor, TrapdoorOpen } from './trapdoor.ts';

export default class Descanso extends ModInitializer {
  /** @param {import('../../packages/cli/types/mineclaude-mod').ModContext} ctx */
  onInitialize(ctx) {
    ctx.blocks.register('sleeping_bag', new SleepingBag());
    ctx.blocks.register('trapdoor', new Trapdoor());
    ctx.blocks.register('trapdoor_open', new TrapdoorOpen());
    ctx.systems.register('bag_respawn', new BagRespawn());
  }
}

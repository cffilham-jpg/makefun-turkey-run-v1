export const CFG = Object.freeze({
  width: 1280, height: 720, ground: 552, heroX: 410,
  escapeDistance: 1500, pixelsPerMetre: 14,
  baseSpeed: 20, maxSpeed: 30, sprintBonus: 8,
  gravity: 1600, jumpVelocity: -625, flutterGravity: 820,
  lives: 3, initialGap: 8, maxGap: 12, hitGapLoss: 3,
  staminaDrain: 30, staminaRegen: 7, cornStamina: 24,
  cornBonus: 75, escapeBonus: 2500, hitInvulnerability: 1.5,
});
export const OBSTACLES = Object.freeze({
  oven: {width: 100, height: 94, cue: 'JUMP THE HEAT'},
  knife: {width: 100, height: 112, cue: 'DUCK THE BLADE'},
  fence: {width: 55, height: 66, cue: 'HOP THE FENCE'},
  hay: {width: 76, height: 64, cue: 'HOP THE HAY'},
});
export const STAGES = ['01 / FARMYARD', '02 / COOKHOUSE', '03 / THE LAST FENCE'];
export function scoreRun(world) {
  return Math.floor(world.distance) + world.corn * CFG.cornBonus + (world.escaped ? CFG.escapeBonus : 0);
}

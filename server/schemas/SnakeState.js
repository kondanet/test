const { Schema, type, MapSchema, ArraySchema } = require('@colyseus/schema');

class Position extends Schema {}
type(Position, {
  x: "number",
  y: "number"
});

class Food extends Schema {}
type(Food, {
  x: "number",
  y: "number",
  value: "number"
});

class Player extends Schema {}
type(Player, {
  id: "string",
  name: "string",
  score: "number",
  alive: "boolean",
  color: "string",
  body: [Position],
  direction: "string"
});

class SnakeState extends Schema {}
type(SnakeState, {
  players: { map: Player },
  foods: [Food],
  gameWidth: "number",
  gameHeight: "number",
  gameStarted: "boolean",
  gameTime: "number"
});

module.exports = { SnakeState, Player, Food, Position };
const EventEmitter = require("events");

const myEmitter = new EventEmitter();

myEmitter.on("sale", () => {
  console.log("There are items on sale");
});

myEmitter.on("sale", (stock) => {
  console.log(`There are ${stock} items on sale`);
});
myEmitter.emit("sale", 10);

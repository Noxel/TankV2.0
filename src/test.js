const app = new PIXI.Application();

// Add the view to the DOM
document.body.appendChild(app.view);

// ex, add display objects
app.stage.addChild(PIXI.Sprite.fromImage('./picture.Tank_Corp.png'));
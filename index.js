/*global
alert, confirm, console, prompt, window
*/

var componentMaker;
var entityMaker;
var graphicsComponentMaker;
var graphicsSystemMaker;
var heroMaker;
var locationComponentMaker;


entityMaker = function () {
    "use strict";

    var components = {};

    return Object.freeze({});
};

graphicsComponentMaker = function (spec) {
    "use strict";

    var entity = spec.entityOfComponent;
    var component = {};
    var spriteSheet = new Image();
    spriteSheet.src = spec.spriteSheet;

    component.draw = function (context) {
        context.drawImage(spriteSheet, entity.getXLocation(), entity.getYLocation());
    };

    return Object.freeze(component);

};

locationComponentMaker = function (spec) {
    "use strict";

    var currentLocation = {
        x: spec.initialX,
        y: spec.initialY
    };
    var location = {};

    location.getXLocation = function () {
        return currentLocation.x;
    };

    location.getYLocation = function () {
        return currentLocation.y;
    };

    return Object.freeze(location);
};

heroMaker = function () {
    "use strict";

    var hero = {};
    var entity = entityMaker();
    var graphics = graphicsComponentMaker({
        entityOfComponent: hero,
        spriteSheet: "hero.png"
    });
    var location = locationComponentMaker({
        initialX: 0.5,
        initialY: 0
    });
    var components = {
        graphics: graphics,
        location: location
    };


    hero.getXLocation = function () {
        return components.location.getXLocation();
    };

    hero.getYLocation = function () {
        return components.location.getYLocation();
    };

    hero.getComponents = function () {
        return Object.keys(components);
    };

    hero.draw = function (context) {
        components.graphics.draw(context);
    };


    return Object.freeze(hero);
};

graphicsSystemMaker = function (initialEntities, gameCanvas) {
    "use strict";

    var entities = initialEntities;
    var graphicsSystem = {};
    var canvas = gameCanvas;
    var context = canvas.getContext("2d");

    graphicsSystem.run = function () {
        window.requestAnimationFrame(graphicsSystem.tick);
    };


    graphicsSystem.tick = function () {

        if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.save();
        context.translate(canvas.width / 2, canvas.height / 2);
        //context.scale(canvas.height, -canvas.height);

        entities.forEach(function (entity) {
            if (entity.getComponents().includes("graphics")) {
                entity.draw(context);
            }
        });

        context.restore();

        window.requestAnimationFrame(graphicsSystem.tick);
    };
    return Object.freeze(graphicsSystem);
};

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    var canvas = document.getElementById("canvas");
    var graphics = graphicsSystemMaker([heroMaker()], canvas);
    graphics.run();
});
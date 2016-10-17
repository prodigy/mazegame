/**
 * Copyright (c) 2016 by Sebastian Grunow <sebastian@grunow-it.de>
 *
 * MazeGameHTML
 * - 014_ExitDoor
 */

// Exit Door
(function(){
    MazeGame.Entities.ExitDoor = function (game, entityContainer, x, y, doorState) {
        MazeGame.Entities.Entity.call(this, game, entityContainer, x, y);

        this.texture = (new MazeGame.Textures.AnimatedTexture('door-', 'closed', 'open'));

        this._doorState = doorState || false;
    };

    MazeGame.Entities.ExitDoor.prototype = Object.create(MazeGame.Entities.Entity.prototype);
    MazeGame.Entities.ExitDoor.prototype.constructor = MazeGame.Entities.ExitDoor;

    MazeGame.Entities.ExitDoor.prototype.getTexture = function () {
        return this._doorState ? this.texture.getFrame(1) : this.texture.getFrame(0);
    }
})();
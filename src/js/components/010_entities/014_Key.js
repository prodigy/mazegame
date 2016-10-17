/**
 * Copyright (c) 2016 by Sebastian Grunow <sebastian@grunow-it.de>
 *
 * MazeGameHTML
 * - 014_Lever
 */

// Key
(function () {
    MazeGame.Entities.Key = function (game, entityContainer, x, y, onCollect) {
        MazeGame.Entities.Entity.call(this, game, entityContainer, x, y);

        this.texture = new MazeGame.Textures.Texture('entity-key');

        if(isFunction(onCollect))
            this._collectFunction = onCollect;
    };

    MazeGame.Entities.Key.prototype = Object.create(MazeGame.Entities.Entity.prototype);
    MazeGame.Entities.Key.prototype.constructor = MazeGame.Entities.Key;

    MazeGame.Entities.Key.prototype.onEntityCollide = function (entities) {
        for(var eK in entities){
            if (!entities.hasOwnProperty(eK))
                continue;
            var e = entities[eK];
            if (e === this.game.player && isFunction(this._collectFunction))
                this._collectFunction(this);
        }
    }
})();
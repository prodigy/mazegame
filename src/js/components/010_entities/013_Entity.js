/**
 * Copyright (c) 2016 by Sebastian Grunow <sebastian@grunow-it.de>
 *
 * MazeGameHTML
 * - 013_Player
 */

MazeGame.Entities = MazeGame.Entities || {};

// Player
(function(){
    MazeGame.Entities.Entity = function (game, entityContainer, x, y) {
        this.game = game;
        this.container = entityContainer;
        this.position = new MazeGame.Position(x, y);
        this.texture = null;
        this.entityId = MazeGame.Entities.Entity.lastEntityId++;

        this.domElement = null;

        this._textures = [];

        this.isMoving = false;
        this._movementDirection = null;
        this._textureFrame = 0;
        this._lastFrameUpdate = new Date().getTime();

        this._walkingTimeout = null;

        this.game.setEntityPosition(this);
    };

    MazeGame.Entities.Entity.lastEntityId = 0;

    MazeGame.Entities.Entity.prototype = {
        create: function () { },
        update: function () {
            // If there is not static texture set, and there is a texture for the current movement direction, update the texture frame.
            if (!this.texture && this.isMoving && isArray(this._textures)
                && this._textures[this._movementDirection]
                && this._textures[this._movementDirection].length) {

                var currentTime = new Date().getTime();
                if (currentTime - this._lastFrameUpdate > 250) {
                    if (++this._textureFrame > this._textures[this._movementDirection].length)
                        this._textureFrame = 0;
                    this._lastFrameUpdate = currentTime;
                }
            } else
                this._textureFrame = 0;
        },
        remove: function () { },
        render: function () {
            if (this.domElement == null) {
                this.domElement = document.createElement('div');
                this.container.appendChild(this.domElement);
                this.domElement.id = '_entity_'+this.entityId;
            }
            var cssClass = this.getTextureClass();
            if (this.domElement.className !== cssClass)
                this.domElement.className = cssClass;
            var posX = this.position.x * 32;
            var posY = this.position.y * 32;
            this.domElement.setAttribute('style', 'transform: translate('+posX+'px,'+posY+'px)');
        },
        onEntityCollide: function (entities) { },

        move: function (direction) {
            direction = MazeGame.Direction[MazeGame.Direction[direction]];
            var newPos = new MazeGame.Position(this.position.x, this.position.y);
            newPos.translate(direction);
            if(this.game.isPositionValid(newPos)){
                this._movementDirection = direction;
                this.position = newPos;
                var _this = this;
                setTimeout(function(){
                    _this.game.maze.getTile(newPos.x, newPos.y).onTileEnter(_this);
                }, 175);
                this.isMoving = true;
                if(this._walkingTimeout)
                    clearTimeout(this._walkingTimeout);

                var _this = this;
                this._walkingTimeout = setTimeout(function () {
                    _this.isMoving = false;
                }, 250);
                return true;
            }
            return false;
        },

        getTexture: function () {
            if(this.texture)
                return this.texture.textureClass;
            var texture;
            if (isArray(this._textures) && this._textures[this._movementDirection]) {
                texture = this._textures[this._movementDirection].getFrame(this._textureFrame);
                if (typeof texture !== 'undefined')
                    this._lastTexture = texture;
            }
            return this._lastTexture;
        },

        getTextureClass: function () {
            return 'entity ' + this.getTexture();
        }
    };
    MazeGame.Entities.Entity.prototype.constructor = MazeGame.Entities.Entity;
})();
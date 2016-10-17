/**
 * Copyright (c) 2016 by Sebastian Grunow <sebastian@grunow-it.de>
 *
 * MazeGameHTML
 * - 013_Player
 */

// Player
(function(){
    MazeGame.Entities.Player = function (game, entityContainer, x, y) {
        MazeGame.Entities.Entity.call(this, game, entityContainer, x, y);
        this._textures[MazeGame.Direction.Up] = new MazeGame.Textures.AnimatedTexture('player player-', ['u1', 'u2', 'u0']);
        this._textures[MazeGame.Direction.Left] = new MazeGame.Textures.AnimatedTexture('player player-', ['l1', 'l2', 'l0']);
        this._textures[MazeGame.Direction.Right] = new MazeGame.Textures.AnimatedTexture('player player-', ['r1', 'r2', 'r0']);
        this._textures[MazeGame.Direction.Down] = new MazeGame.Textures.AnimatedTexture('player player-', ['d1', 'd2', 'd0']);

        this._lastTexture = this._textures[MazeGame.Direction.Down].getFrame(0);

        // Bind arrow keys.
        this._lastMovement = new Date().getTime();

        this._pressedKeys = {};

        var _this = this;
        this._keyEventListenerDown = function (e) {
            _this._pressedKeys[e.which] = true;
        };
        this._keyEventListenerUp = function (e) {
            if(_this._pressedKeys[e.which]) {
                setTimeout(function () {
                    _this._pressedKeys[e.which] = false;
                }, 50);
            }
        };
        this._touchMoveEventListener = function (e) {
            if(e.type !== 'touchstart'){
                console.log(e.type);
            }
            var playerX = _this.position.x * 32 + 16 + getOffset(_this.game.playersWrapper).left;
            var playerY = _this.position.y * 32 + 16 + getOffset(_this.game.playersWrapper).top;
            var xDiff = e.touches[0].pageX - playerX;
            var yDiff = e.touches[0].pageY - playerY;
            if(xDiff < 0) {
                _this._pressedKeys[37] = true; // left
                _this._pressedKeys[39] = false;
            }
            if(yDiff < 0) {
                _this._pressedKeys[38] = true; // up
                _this._pressedKeys[40] = false;
            }
            if(xDiff > 0) {
                _this._pressedKeys[39] = true; // right
                _this._pressedKeys[37] = false;
            }
            if(yDiff > 0) {
                _this._pressedKeys[40] = true; // down
                _this._pressedKeys[38] = false;
            }
            return true;
        };
        this._touchEndEventListener = function (e) {
            setTimeout(function () {
                for (var key in _this._pressedKeys) {
                    if (!_this._pressedKeys.hasOwnProperty(key) || !_this._pressedKeys[key])
                        continue;
                    _this._pressedKeys[key] = false;
                }
            }, 50);
            return true;
        };

        document.addEventListener('keydown', this._keyEventListenerDown, false);
        document.addEventListener('keyup', this._keyEventListenerUp, false);
        document.addEventListener('touchstart', this._touchMoveEventListener, false);
        document.addEventListener('touchmove', this._touchMoveEventListener, false);
        document.addEventListener('touchend', this._touchEndEventListener, false);
    };

    MazeGame.Entities.Player.prototype = Object.create(MazeGame.Entities.Entity.prototype);

    MazeGame.Entities.Player.prototype.remove = function () {
        document.removeEventListener('keydown', this._keyEventListenerDown, false);
        document.removeEventListener('keyup', this._keyEventListenerUp, false);
        document.removeEventListener('touchstart', this._touchMoveEventListener, false);
        document.removeEventListener('touchmove', this._touchMoveEventListener, false);
        document.removeEventListener('touchend', this._touchEndEventListener, false);
    };

    MazeGame.Entities.Player.prototype.update = function () {
        // Handle key press events.
        var now = new Date().getTime();
        if(now - this._lastMovement > 200) {
            for (var key in this._pressedKeys) {
                if (!this._pressedKeys.hasOwnProperty(key) || !this._pressedKeys[key])
                    continue;
                this.move(key - 37);
                this._lastMovement = now;
                //break;
            }
        }

        // Handle default entity update routines.
        MazeGame.Entities.Entity.prototype.update.call(this);
    };

    MazeGame.Entities.Player.prototype.render = function () {
        MazeGame.Entities.Entity.prototype.render.call(this);
    };

    MazeGame.Entities.Player.prototype.constructor = MazeGame.Entities.Player;
})();
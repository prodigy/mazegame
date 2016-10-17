/**
 * Copyright (c) 2016 by Sebastian Grunow <sebastian@grunow-it.de>
 *
 * MazeGameHTML
 * - 001_Position
 */

var MazeGame = window.MazeGame || {};

//Position
(function () {
    MazeGame.Position = function (x, y) {
        this.x = x;
        this.y = y;
    };

    MazeGame.Position.prototype = {
        /**
         * Translates the position in the given direction.
         * @param direction
         */
        translate: function (direction) {
            if(typeof direction === 'undefined')
                return;

            // Fix value.
            direction = MazeGame.Direction[MazeGame.Direction[direction]];

            switch(direction){
                case MazeGame.Direction.Up:
                    this.y -= 1;
                    break;
                case MazeGame.Direction.Left:
                    this.x -= 1;
                    break;
                case MazeGame.Direction.Right:
                    this.x += 1;
                    break;
                case MazeGame.Direction.Down:
                    this.y += 1;
                    break;
            }
        }
    };
    MazeGame.Position.prototype.constructor = MazeGame.Position;
})();
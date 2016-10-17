/**
 * Copyright (c) 2016 by Sebastian Grunow <sebastian@grunow-it.de>
 *
 * MazeGameHTML
 * - Maze
 */

var MazeGame = window.MazeGame || {};

(function(){
    MazeGame.Maze = function (width, height) {
        // Make sure width and height are usable values.
        width = width%2 == 0 ? width+1 : width;
        height = height%2 == 0 ? height+1 : height;

        this.width = width;
        this.height = height;

        this._movementMap = [[]];
        this._tileMap = [[]];

        this._entryPoint = null;
        this._exitPoint = null;

        for(var i = 0; i < this.width; i++) {
            if (!this._movementMap[i])
                this._movementMap[i] = [];
            if (!this._tileMap[i])
                this._tileMap[i] = [];

            for (var j = 0; j < this.height; j++) {
                this._movementMap[i][j] = false;
                this._tileMap[i][j] = new MazeGame.Tiles.WallTile(this, i, j);
            }
        }
    };

    MazeGame.Maze.prototype = {
        setTile: function (tile, x, y) {
            if (typeof x === 'undefined' || typeof y === 'undefined') {
                x = tile.posX;
                y = tile.posY;
            }
            if (x < 0 || x > this.width-1 || y < 0 || y > this.height-1)
                throw new Error('Index out of bounds.');
            tile.maze = this;
            this._tileMap[x][y] = tile;
        },
        getTile: function (x, y) {
            if (x >= 0 && x < this.width && y >= 0 && y < this.height)
                return this._tileMap[x][y];
            return undefined;
        },
        isTileWalkable: function (x, y) {
            return this._movementMap[x][y];
        },
        getEntryPoint: function () {
            return this._entryPoint;
        },
        getExitPoint: function () {
            return this._exitPoint;
        }
    };
    MazeGame.Maze.prototype.constructor = MazeGame.Maze;
})();
/**
 * Copyright (c) 2016 by Sebastian Grunow <sebastian@grunow-it.de>
 *
 * MazeGameHTML
 * - MazeTile
 */

MazeGame.Tiles = MazeGame.Tiles || {};

// MazeTile
(function(){
    MazeGame.Tiles.MazeTile = function(maze, posX, posY){
        this.isWalkable = false;
        this.maze = maze;
        this.posX = posX;
        this.posY = posY;
        this._className = 'tile';
        this.type = undefined;
        this.tileName = '';
    };

    MazeGame.Tiles.MazeTile.Types = createEnum(['single', 'd', 'l', 'ld', 'lr', 'lrd', 'r', 'rd', 'u', 'ud', 'ul',
        'uld', 'ulr', 'ulrd', 'ur', 'urd']);

    MazeGame.Tiles.MazeTile.prototype = {
        getPosition: function () {
            return [this.posX, this.posY];
        },
        getNeighbour: function (direction) {
            if (!this.maze || typeof direction === 'undefined')
                return undefined;
            var neighbour;
            direction = MazeGame.Direction[MazeGame.Direction[direction]];
            switch(direction){
                case MazeGame.Direction.Down:
                    neighbour = this.maze.getTile(this.posX, this.posY + 1);
                    break;
                case MazeGame.Direction.Left:
                    neighbour = this.maze.getTile(this.posX - 1, this.posY);
                    break;
                case MazeGame.Direction.Right:
                    neighbour = this.maze.getTile(this.posX + 1, this.posY);
                    break;
                case MazeGame.Direction.Up:
                    neighbour = this.maze.getTile(this.posX, this.posY - 1);
                    break;
            }
            return neighbour;
        },
        getNeighbours: function (nameFilter) {
            var neighbours = {};
            var values = MazeGame.Direction.getValues();
            for(var dir in values){
                if (!values.hasOwnProperty(dir))
                    continue;
                var nb = this.getNeighbour(dir);
                if (nb && (!nameFilter || nb.tileName === nameFilter))
                    neighbours[dir] = nb;
            }
            return neighbours;
        },
        hasNeighbour: function (direction) {
            if (!this.maze || !direction)
                return false;
            return !!this.getNeighbour(direction);
        },
        getClassName: function(){
            return this._className;
        },
        setType: function (type) {
            if(typeof type !== 'undefined' || type !== '')
                this.type = type;
        },
        onTileEnter: function (entity) { }
    };
    MazeGame.Tiles.MazeTile.prototype.constructor = MazeGame.Tiles.MazeTile;
})();
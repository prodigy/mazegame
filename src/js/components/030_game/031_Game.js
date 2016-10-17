/**
 * Copyright (c) 2016 by Sebastian Grunow <sebastian@grunow-it.de>
 *
 * MazeGameHTML
 * - Game
 */

(function(){
    var game;

    MazeGame.Game = function (width, height) {
        this.width = width;
        this.height = height;

        this.maze = null;
        this.entities = [];
        this.player = null;

        this.tilesWrapper = document.getElementById('tiles-wrapper');
        this.entitiesWrapper = document.getElementById('entities-wrapper');
        this.playersWrapper = document.getElementById('player-wrapper');

        game = this;

        this.maze = new MazeGame.Maze(this.width, this.height);
        MazeGame.Generators.RecursiveBackTracker.generateMaze(this, this.width, this.height, null, null, this.createSuccess);

        MazeGame.Game.instance = this;
    };
    MazeGame.Game.prototype = {
        createSuccess: function () {
            var entry = this.maze.getEntryPoint();
            this.player = new MazeGame.Entities.Player(this, this.playersWrapper, entry.x, entry.y);
            this.entities.push(this.player);
            var _this = this;
            this._updateInterval = setInterval(function(){
                _this.update.call(_this);
            }, 50);
        },
        update: function(){
            // Update field rendering.
            for(var i = 0; i < game.maze.width; i++){
                for(var j = 0; j < game.maze.height; j++) {
                    var tile = game.maze.getTile(j,i);
                    var domTileId = '_mazetile_' + i + '_' + j;
                    var domTile = document.getElementById(domTileId);
                    if (!domTile){
                        game.tilesWrapper.appendChild(domTile = document.createElement('div'));
                        domTile.id = domTileId;
                    }
                    var className = tile.getClassName();
                    if (domTile.className != className)
                        domTile.className = tile.getClassName();
                }
            }
            // Update entities.
            for(var entityKey in this.entities){
                var entity = this.entities[entityKey];
                entity.update();
                entity.render();
            }
        },
        isPositionValid: function (position) {
            if (position && typeof position.x !== 'undefined' && typeof position.y !== 'undefined'
                && position.x >= 0 && position.x < this.maze.width
                && position.y >= 0 && position.y < this.maze.height)
                return this.maze.getTile(position.x, position.y).isWalkable;
            return false;
        },
        remove: function () {
            clearInterval(this._updateInterval);
            // Remove entities
            for(var entityKey in this.entities){
                this.entities[entityKey].remove();
                delete this.entities[entityKey];
            }
            delete this.maze;
            delete this;
            game = null;
        }
    };
    MazeGame.Game.prototype.constructor = MazeGame.Game;
})();

new MazeGame.Game(9, 9);
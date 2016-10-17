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
        this.entityPositions = [];
        this.player = null;

        this.tilesWrapper = document.getElementById('tiles-wrapper');
        this.entitiesWrapper = document.getElementById('entities-wrapper');
        this.playersWrapper = document.getElementById('player-wrapper');

        this.inventoryWrapper = document.getElementById('inventory');

        game = this;

        this.maze = new MazeGame.Maze(this.width, this.height);

        var exitDoorCreated = false;

        var deadEnds = [];
        var onDeadEnd = function (x, y) {
            deadEnds.push(new MazeGame.Position(x, y));
        };

        MazeGame.Generators.RecursiveBackTracker.generateMaze(this, this.width, this.height, null, onDeadEnd, this.createSuccess);

        for(var deK in deadEnds)
        {
            if (!deadEnds.hasOwnProperty(deK))
                continue;

            var pos = deadEnds[deK];

            var tile = this.maze.getTile(pos.x, pos.y);
            if (!tile.isWalkable)
                continue;

            if (Object.getOwnPropertyNames(tile.getNeighbours('floor')).length != 1)
                continue;

            if (!exitDoorCreated) {
                exitDoorCreated = true;
                var exitDoor = new MazeGame.Entities.ExitDoor(this, this.entitiesWrapper, this.maze._exitPoint.x, this.maze._exitPoint.y);
                this.entities.push(exitDoor);
                var key = new MazeGame.Entities.Key(this, this.entitiesWrapper, pos.x, pos.y, function () {
                    game.maze.getTile(game.maze._exitPoint.x, game.maze._exitPoint.y).isWalkable = true;
                    exitDoor.openDoor();
                    game.inventoryWrapper.appendChild(key.domElement);
                    key.domElement.setAttribute('style', '');
                    key.position = new MazeGame.Position(0,0);
                    delete game.entities[game.entities.indexOf(key)];
                });
                this.entities.push(key);
            }
        }
        // Set the exit door to not being walkable.
        if (exitDoorCreated)
            game.maze.getTile(width-2, height-1).isWalkable = false;

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
                var oldPosition = entity.position;
                entity.update();
                if (entity.position !== oldPosition)
                    this.setEntityPosition(entity, oldPosition);
                entity.render();
            }
            // Handle collisions.
            var collisions = this.getCollidingEntities();
            for(var p in collisions) {
                if (!collisions.hasOwnProperty(p))
                    continue;
                var pos = collisions[p];
                if (pos.length < 2)
                    continue;

                for(var eK in pos){
                    if (!pos.hasOwnProperty(eK))
                        continue;
                    var e = pos[eK];
                    if (isFunction(e.onEntityCollide))
                        e.onEntityCollide.call(e, pos);
                }
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
            // Remove DOM elements.
            while(this.playersWrapper.firstChild) {
                this.playersWrapper.removeChild(this.playersWrapper.firstChild);
            }
            while(this.entitiesWrapper.firstChild) {
                this.entitiesWrapper.removeChild(game.entitiesWrapper.firstChild);
            }
            while(this.tilesWrapper.firstChild) {
                this.tilesWrapper.removeChild(this.tilesWrapper.firstChild);
            }
            while(this.inventoryWrapper.firstChild) {
                this.inventoryWrapper.removeChild(this.inventoryWrapper.firstChild);
            }
            // Remove entities
            for(var entityKey in this.entities){
                this.entities[entityKey].remove();
                delete this.entities[entityKey];
            }
            delete this.maze;
            delete this;
            game = null;
        },
        setEntityPosition: function (entity, oldPosition) {
            if(!isArray(this.entityPositions[entity.position.x]))
                this.entityPositions[entity.position.x] = [];
            if (!isArray(this.entityPositions[entity.position.x][entity.position.y]))
                this.entityPositions[entity.position.x][entity.position.y] = [];
            this.entityPositions[entity.position.x][entity.position.y][entity.entityId] = entity;

            if (oldPosition && this.entityPositions[oldPosition.x] && this.entityPositions[oldPosition.x][oldPosition.y]
                && this.entityPositions[oldPosition.x][oldPosition.y][entity.entityId])
                delete this.entityPositions[oldPosition.x][oldPosition.y][entity.entityId];
        },
        getCollidingEntities: function () {
            var entities = [];
            for(var xK in this.entityPositions) {
                if (!this.entityPositions.hasOwnProperty(xK))
                    continue;
                for(var yK in this.entityPositions[xK]){
                    if (!this.entityPositions[xK].hasOwnProperty(yK))
                        continue;
                    var posKey = xK+','+yK;
                    if (!isArray(entities[posKey]))
                        entities[posKey] = [];
                    for (var e in this.entityPositions[xK][yK]){
                        if (!this.entityPositions[xK][yK].hasOwnProperty(e))
                            continue;
                        entities[posKey].push(this.entityPositions[xK][yK][e]);
                    }
                }
            }
            return entities;
        }
    };
    MazeGame.Game.prototype.constructor = MazeGame.Game;
})();

new MazeGame.Game(15, 15);
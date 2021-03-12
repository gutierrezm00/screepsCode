var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleWorker = require('role.worker');

module.exports.loop = function () {

    // var tower = Game.getObjectById('TOWER_ID');
    // if(tower) {
    //     var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    //         filter: (structure) => structure.hits < structure.hitsMax
    //     });
    //     if(closestDamagedStructure) {
    //         tower.repair(closestDamagedStructure);
    //     }

    //     var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //     if(closestHostile) {
    //         tower.attack(closestHostile);
    //     }
    // }

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');

    var workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker');

    if(Game.time % 10 == 0){
        console.log('miners: ' + miners.length);
        console.log('workers: ' + workers.length);
    }
    if(miners.length < 1) {
        console.log('Spawning new miner: miner1');
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,MOVE], 'miner1',
            {memory: {role: 'miner'}});
    }
    
    if(workers.length < 3) {
        console.log('Spawning new harvester: worker');
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], 'worker',
            {memory: {role: 'worker'}});
    }

    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }

        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        
        if(creep.memory.role == 'worker') {
            roleWorker.run(creep);
        }
    }
}
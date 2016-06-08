function findIndex(value, array){
    for (var i = 0; i < array.length; i++) {
        if(array[i] == value){
            return i;
        }
    }
    return false;
}
var Pubsub = {

    events: {},

    fire: function(type, eventInfo){
        var eventList = this.events[type];
        for (var i = 0; i < eventList.length; i++) {
            eventList[i].call(this, eventInfo);
        }
    },

    on: function(type, callback){
        if(!this.events[type]){
            this.events[type] = [];
        }
        this.events[type].push(callback);
    },

    off: function(type, name){

        var eventList = this.events[type],
            index = findIndex(name, eventList);

        if(!name){
            eventList = [];
        }else if(name && name instanceof Function){
            eventList.splice(index, 1);
        }
    },

    installTo: function(whom){
        var args = [].slice.call(arguments);
        var that = this;

        args.forEach(function(v, i, arr){
            v.fire = that.fire;
            v.on = that.on;
            v.off = that.off;
            v.events = {};
        });
    },
}
/*
var cyni = {name: 'cyni'};

Pubsub.installTo(cyni);

cyni.on('hit', function(e){
    console.log('cyni been hit by' + e.source);
});

cyni.off('hit');

cyni.fire('hit', {source: 'zq'});
*/
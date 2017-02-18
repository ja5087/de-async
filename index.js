var Queue = function(maxProcesses, finishedcb) {
    var max = maxProcesses;
    var current = 0;
    var q = [];

    var outer = {
        push: push,
        begin: begin
    }

    //expose only push,begin
    return outer;

    function begin()
    {   
        while(current<max)
        {
            callNext();
        }
    }

    function push(fn, cb)
    {
        if(typeof fn != 'function')
        {
            throw new Error("ERROR: fn not a function");
        } 
        q.push({fn:fn,cb:cb||null});
        
    }

    function attempt()
    {
        
        while(current<max&&q.length>0)
        {
            callNext();
        }
    }

    function finished(fncb)
    {

        //pass any callbacks with same args
        if(fncb)
        {
            //slice out 0 since it's the callback itself
            fncb.apply(null, Array.prototype.slice.call(arguments,1));
        }

        current--;
        
        if(current==0 && q.length == 0)
        {
            
            finishedcb();
        }
        attempt();
    }

    //call the next item
    function callNext()
    {
        var next = q.shift();
        if(next)
        {
            current++;
            
            next.fn.call(null,finished.bind(null,next.cb));
        }
    }
}

module.exports = Queue;

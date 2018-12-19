var Queue = function(maxProcesses, finalCallback) {
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
        while(current < max)
        {
            callNext();
        }
    }

    function push(fn, cb)
    {
        if(typeof fn != 'function')
        {
            throw new Error("Argument not a function");
        } 
        q.push({fn:fn, cb:cb || null});
        
    }

    function attempt()
    {
        
        while(current<max && q.length>0)
        {
            callNext();
        }
    }

    function finished(fncb)
    {

        //call any callbacks with same args
        if(fncb)
        {
            //slice out 0 since it's the callback itself
            fncb.apply(null, Array.prototype.slice.call(arguments,1));
        }

        current--;
        
        if(current==0 && q.length == 0)
        {
            
            finalCallback();
        }
        attempt();
    }

    function callNext()
    {
        var next = q.shift();
        if(next)
        {
            current++;
            
            next.fn.call(null, finished.bind(null, next.cb));
        }
    }
}

module.exports = Queue;

function SIRModel(beta, gamma) {
    /*
    Class: SIRModel
    Stores parameters and runs the ODE solver
    Inputs:
    beta  - 
    gamma -
    Parameters:
    N     - Population size
    beta  - infection rate
    gamma - recovery rate
    T     - how long to run the model for
    delta - size of time step
    */

    this.N     = 100
    this.beta  = beta
    this.gamma = gamma
    this.T     = 10
    this.delta = 0.001

    // ODE definition
    this.dx_dt = function(x) {
        return [-this.beta*x[0]*x[1], this.beta*x[0]*x[1] - this.gamma*x[1],this.gamma*x[1]]
    }

    // ODE solver
    this.solve = function() {
        var t = [0]
        var x = [[this.N - 1, 1, 0]]

        while(t[t.length - 1] < this.T) {
            t.push(t[t.length-1]+this.delta)
            var x_old = x[x.length-1]
            var fx = this.dx_dt(x_old)
            var x_new = []
            for(var i = 0; i < x_old.length; i++) {
                x_new.push(x_old[i] + this.delta*fx[i])
            }
            x.push(x_new)
        }

        var output = []
        for(var i = 0; i < t.length; i++) {
        	output.push({t: t[i], S: x[i][0], I: x[i][1], R: x[i][2]})
        }

        return output
    }
}

// Example code to run the model
// var m = new SIRModel(0.06,1);
// var output = m.solve();
// throw 'Error'
function MarkovModel(beta, gamma) {
    /*
    Class: MarkovModel
    Stores parameters and runs the individual based model
    Inputs:
    beta  -
    gamma -
    Parameters:
    Parameters:
    N     - Population size
    beta  - infection rate
    gamma - recovery rate
    T     - how long to run the model for
    */

    this.N     = 100;
    this.beta  = beta;
    this.gamma = gamma;
    this.T     = 10;
    this.delta = 0.001;

    this.gillespie = function() {
        // Set initial conditions

        var I = 1;
        var S = this.N - I;
        var R = 0;
        var t = 0;

        var rates = [];

        var r1, r2;

        var output = [];

        output.push({t:t, S:S, I:I, R:R});

        while (I > 0) {
            // clear rates
            rates = []

            // Calculate infection rate
            rates.push(I*S*this.beta);

            // Calculate recovery rate
            rates.push(I*this.gamma + rates[rates.length-1]);

            // generate random numbers
            r1 = Math.random();
            r2 = Math.random();

            // increment time
            t += - Math.log(r1)/rates[rates.length-1];

            // normalise rates
            for (var i = 0; i < rates.length; i++) {
                rates[i] = rates[i]/rates[rates.length-1];
            }

            // choose event
            // infection
            if (r2 < rates[0]) {
                S -= 1;
                I += 1;
            // recovery
            } else {
                I -= 1;
                R += 1;
            }

            output.push({t:t,S:S,I:I,R:R});
        }

        return output
    }

    this.average_output = function(runs) {
        var outputs = [];
        for (var i = 0; i < runs; i++) {
            outputs.push(this.gillespie());
        }

        var t = [0], S = [99], I = [1], R = [0];

        for (var i = this.delta; i <= this.T; i += this.delta) {
            t.push(i);
            S.push(0);
            I.push(0);
            R.push(0);

            for (var j = 0; j < outputs.length; j++) {
                var output = outputs[j];
                
                // Find if i is in range of time values
                if (i < output[output.length-1].t) {
                	// argmax(t<i)
                	var index = output.findIndex(function(data_point) {
                		return data_point.t > i;
                	}) - 1;
                	S[S.length-1] += output[index].S;
                	I[I.length-1] += output[index].I;
                	R[R.length-1] += output[index].R;
                } else {
                	S[S.length-1] += output[output.length-1].S;
                	I[I.length-1] += output[output.length-1].I;
                	R[R.length-1] += output[output.length-1].R;
                }
            }

            S[S.length-1] = S[S.length-1] / outputs.length;
            I[I.length-1] = I[I.length-1] / outputs.length;
            R[R.length-1] = R[R.length-1] / outputs.length;
        }

        var data = [];
        for (var i = 0; i < t.length; i++) {
            data.push({t:t[i],S:S[i],I:I[i],R:R[i]});
        }

        return data;
    }

}

// Example code to run the model
// var m = new SIRModel(0.06,1);
// var output = m.average_output(10);
// throw 'Error'
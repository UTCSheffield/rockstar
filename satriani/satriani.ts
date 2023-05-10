import parser from './satriani.parser.js';
import interpreter from './satriani.interpreter.js';
//import { saveRockENV } from 'src/lib/rockUtils.js';
import { saveRockENV } from './../../src/lib/rockUtils.js';
import logger from '#main/lib/logger';

class Interpreter {
    public run(program: any, input: any, output: any, id: number) {
        if (typeof(program) == 'string') program = this.parse(program);
            //let env = new interpreter.Environment();
            let env = new Environment();
            env.output = output || console.log;
            env.input = input || (() => "");
            const ranProgram =  env.run(program);
            logger.debug("full env.log", JSON.stringify(env.log));
            saveRockENV(env, id);
            return ranProgram;
    }
    public parse(program: any) {
        return parser.parse(program);
    }
}
// @ts-expect-error
class Environment extends interpreter.Environment {
    public log: [][]; 
    constructor() {
        super();
        // @ts-expect-error
        this.log = {};
    }
    // @ts-expect-error
    public assign(name: any, value: any, index: any, local: any) {
        if (this.log[name] == undefined) {
            this.log[name]=[]    
        }
        if (typeof (index) == 'undefined' || index == null){
            //@ts-expect-error
            this.log[name].push(value);
        }
        else 
        {
            let newVar;
            //TODO: needs to handle indexed names and apend the whole variable to the log
            if (this.log[name].length == 0) {
                //check the kind of index and create a blank array or dictonairy
                newVar = {}
            } else {
                logger.debug("this.log["+name+"]", JSON.stringify(this.log[name]))
                newVar = structuredClone(this.log[name][this.log[name].length -1]);
            }
            if (typeof(newVar) == "undefined") {
                throw new Error("newVar is undefined")
            }
            //@ts-expect-error
            newVar[index] = value;
            //@ts-expect-error 
            this.log[name].push(newVar);
        }
        logger.debug("this.log", JSON.stringify(this.log))
        super.assign(name, value, index, local);
    }
}
export {
    Interpreter
};

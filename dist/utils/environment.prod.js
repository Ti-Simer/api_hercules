"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviroment = void 0;
const path = require("path");
const path_1 = require("path");
class enviroment {
}
exports.enviroment = enviroment;
enviroment.pythonPath = '/usr/bin/python3.8';
enviroment.srcDir = path.join(__dirname, '..', '..', 'backend');
enviroment.pythonScriptPath = (0, path_1.join)(process.cwd(), 'graphs', 'scripts', 'cumulative-purchase.py');
//# sourceMappingURL=environment.prod.js.map
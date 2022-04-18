import * as fs from "fs";
import {VentuzDiagnosticsParserV0608} from "./diagnosticsParsers/V0608";

console.log(VentuzDiagnosticsParserV0608.parse(fs.readFileSync(__dirname + '/../data.json', "utf-8")));


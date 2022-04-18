export class VentuzDiagnosticsParserV0608 {

    public static parse(input: string): any {
        let data: any = {};

        let split = input.split("\n");

        for (let [index, line] of split.entries()) {
            try {
                if (line.startsWith("[!Clock]")) {
                    let clockData = line.split(":")[1].trim().split("-");
                    data.frameCount = parseInt(clockData[0].trim());
                    data.runTime = clockData[1].trim();
                } else if (line.startsWith("[!Framerate]")) {
                    let framerateData = line.split(":")[1].trim().split("[!]fps,");

                    let framerateInfo = framerateData[0].trim().replace(",", ".").split("/");
                    data.requestedFramerate = parseFloat(framerateInfo[1].trim());
                    data.framerate = parseFloat(framerateInfo[0].trim().replace(/(\[\!)*(\]*)/g, "").trim());

                    let frameTimeInfo = framerateData[1].trim().split(" ")[0].replace(",", ".").split("/");
                    data.frameTime = parseFloat(frameTimeInfo[0]);
                    data.allowedFrameTime = parseFloat(frameTimeInfo[1]);
                } else if (line.startsWith("[!Cpu Load]")) {
                    let cpuLoadData = line.split(":")[1].trim();
                } else {
                    //console.log(line);
                }
            } catch (e) {
                console.error(e, line);
            }
        }
        return data;
    }
}

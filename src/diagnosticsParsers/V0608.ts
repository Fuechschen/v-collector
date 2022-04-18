export class VentuzDiagnosticsParserV0608 {

    public static parse(input: string): any {
        let data: any = {};

        let split = input.split("\n");

        let firstLine = split[0];

        let clockSplit = firstLine.split('-');

//cluster information
        let clusterLine = clockSplit[2].trim();
        let clusterSplit = clusterLine.split(',');

//clusterId
        let idSplit = clusterSplit[0].split(' ');
        data.cluster_id = idSplit[2];

//clock source
        let clockLineSplitFrm = clusterSplit[1].trim().split(' ')[3];
        data.cluster_clockFrom = clockLineSplitFrm.substr(0, clockLineSplitFrm.length - 1);

//skip frames
        data.frames_skipped = clusterSplit[2].trim().split(':')[1].trim();


        let secondLine = split[1];

        let secondLineSplit = secondLine.split(', ');

//framerate
        let framerateString = secondLineSplit[0];
        framerateString = framerateString.replace(/\[/g, '').replace(/]/g, '').replace(/!/g, '');
        framerateString = framerateString.split(' ')[2];

        let frSplit = framerateString.split('/');

        data.frames_rate = frSplit[0];
        data.frames_rateShould = frSplit[1];


//frametime
        let frametimeString = secondLineSplit[1];
        let frametimeSplit = frametimeString.split(' ')[0].split('/');

        data.frames_time = frametimeSplit[0];
        data.frames_timeShould = frametimeSplit[1];


//cpu
        let cpuString = split[3].trim();

        let cpuSplit = cpuString.split(' ');

//cpu load
        let cpuLoadString = cpuSplit[5].replace('[lb:', '').replace(']', '');
        let cpuLoadSplit = cpuLoadString.split('/');

        data.cpu_load = cpuLoadSplit[0];
        data.cpu_loadOf = cpuLoadSplit[1];


//cpu threads
        let cpuThreadsString = cpuSplit[7].replace('[!', '').replace(']', '');
        let cpuThreadsSplit = cpuThreadsString.split('/');

        data.cpu_threads = cpuThreadsSplit[0];
        data.cpu_threadsOf = cpuThreadsSplit[1];


//cpu numa
        let cpuNumaString = cpuSplit[11].replace('[!', '').replace(']', '');
        let cpuNumaSplit = cpuNumaString.split('/');

        data.cpu_numa = cpuNumaSplit[0];
        data.cpu_numaOf = cpuNumaSplit[1];


//cpu memory
        let cpuMemoryLine = split[4].replace(/\[!?(lb:)?/g, '').replace(/]/g, '');
        let cpuMemorySplit = cpuMemoryLine.split(' ');

        data.cpu_physicalMemory = cpuMemorySplit[6];

        let cpuMemoryUsedSplit = cpuMemorySplit[3].split('/');

        data.cpu_usedMemory = cpuMemoryUsedSplit[0];
        data.cpu_totalMemory = cpuMemoryUsedSplit[1];


//gpu memory
        let gpuMemoryLine = split[5].replace(/\[!?(lb:)?(mb:)?/g, '').replace(/]/g, '');
        let gpuMemorySplit = gpuMemoryLine.split(' ');

        let gpuMemoryUsedSplit = gpuMemorySplit[3].split('/');

        data.gpu_usedMemory = gpuMemoryUsedSplit[0];
        data.gpu_totalMemory = gpuMemoryUsedSplit[1];

        let gpuClockSplit = gpuMemorySplit[6].split('/');

        data.gpu_clock = gpuClockSplit[0];
        data.gpu_clockNominal = gpuClockSplit[1];

        return data;
    }
}

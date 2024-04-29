function test_memory(memory, value, start, end, step) {
    for (let i = start; i < end; i += step) {
        if (memory[i] !== value) {
            return false;
        }
    }
    return true;
}

function check(result, msg) {
    if (!result) {
        console.log("[+] succeded: " + msg);
    } else {
        console.log("[-] failed: " + msg);
    }
}

function print_registers(cpu) {
    let result;
    
    result = `A:  ${cpu.A.toString(16).toUpperCase()}\n`;
    result += `X:  ${cpu.X.toString(16).toUpperCase()}\n`;
    result += `Y:  ${cpu.Y.toString(16).toUpperCase()}\n`;
    result += `PC: ${cpu.PC.toString(16).toUpperCase()}\n`;
    result += `SP: ${cpu.SP.toString(16).toUpperCase()}\n`;
    result += `----------------------\n`;
    result += `C: ${cpu.P.C}  Z: ${cpu.P.Z}  I: ${cpu.P.I}  D: ${cpu.P.D}\n`;
    result += `B: ${cpu.P.B}  -: ${cpu.P.UNUSED}  V: ${cpu.P.V}  N: ${cpu.P.N}\n`;

    console.log(result);
}

class Test {
    constructor() {
        this.mem = new MEMORY(MEMORYSIZE);
        this.cpu = new PROCESSOR();
    }

    test() {
        // memory tests
        this.InitializeMem();
        this.ReadWriteMem();

        // processor tests
        this.ResetCPU();
        this.CPUFetchByte();
        this.CPUFetchWord();
        this.CPU_LDA();
    }

    InitializeMem() {
        this.mem.Initialize();
        let result = false;
        for (let i = 0; i < this.mem.MEMORYSIZE; i++) {
            if (this.mem.DATA[i] !== 0) {
                result = true;
            }
        }

        check(result, "InitializeMem");
    }

    ReadWriteMem() {
        let result = this.mem.DATA[0xFFFC] === 0;
        this.mem.Write(0xFFFC, 0x41);
        result &= this.mem.Read(0xFFFC) === 0x41;

        check(result, "ReadWriteMem");
    }

    ResetCPU() {
        this.cpu.Reset(this.mem);
        let result = ((this.cpu.A === 0) &&
                      (this.cpu.X === 0) &&
                      (this.cpu.Y === 0) &&
                      (this.cpu.PC === 0xFFFC) &&
                      (this.cpu.SP === 0xFF) &&
                      (this.cpu.P.DATA() === 0x20) &&
                      test_memory(this.mem, 0, 0, 0x10000, 1));
        
        check(result, "ResetCPU");
    }

    CPUFetchByte() {
        this.mem.DATA[0xFFFC] = 0x41;
        let cycles = 10;
        let result = (this.cpu.FetchByte(cycles, this.mem) === 0x41 &&
                      cycles === 9);

        check(result, "CPUFetchByte");
    }

    CPUFetchWord() {

    }

    CPU_LDA() {
        this.mem.DATA[0xFFFC] = 0xA9;
        this.mem.DATA[0xFFFD] = 0x69;

        this.cpu.Execute(2, this.mem);

        check((this.cpu.A === 0x69 &&
               this.cpu.PC === 0xFFFE), "CPU_LDA");
    }
}
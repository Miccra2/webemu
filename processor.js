const MEMORYSIZE    = 0x10000;
const STACKTOP      =    0xFF;

const RESET_VECTOR  =  0xFFFC;

class MEMORY {
    constructor(size) {
        this.MEMORYSIZE = size;
        this.DATA = [];
    }

    Initialize() {
        for (let i = 0; i < this.MEMORYSIZE; i++) {
            this.DATA[i] = 0;
        }
    }

    Read(address) {
        return this.DATA[address];
    }

    Write(address, data) {
        this.DATA[address] = data;
    }
}

class STATUS {
    constructor() {
        this.C = 0;     // carry flag
        this.Z = 0;     // zero flag
        this.I = 0;     // interrupt disable flag
        this.D = 0;     // decimal mode enable flag
        this.B = 0;     // break flag
        this.UNUSED = 0;
        this.V = 0;     // overflow flag
        this.N = 0;     // negative flag
    }

    DATA(data = undefined) {
        if (!data) {
            return (
                this.C |
                (this.Z << 1) |
                (this.I << 2) |
                (this.D << 3) |
                (this.B << 4) |
                (this.UNUSED << 5) |
                (this.V << 6) |
                (this.N << 7)
            )
        }
        this.C = data & 1;
        this.Z = (data >> 1) & 1;
        this.I = (data >> 2) & 1;
        this.D = (data >> 3) & 1;
        this.B = (data >> 4) & 1;
        this.UNUSED = (data >> 5) & 1;
        this.V = (data >> 6) & 1;
        this.N = (data >> 7) & 1;
    }
}

class PROCESSOR {
    constructor() {
        this.A;     // accumulator
        this.X;     // index x
        this.Y;     // index y
        this.PC;    // program counter
        this.SP;    // stack pointer
        this.P = new STATUS();     // processor status
    }

    Reset(memory) {
        this.A = 0;
        this.X = 0;
        this.Y = 0;
        this.PC = RESET_VECTOR;
        this.SP = STACKTOP;
        this.P.DATA(0);
        this.P.UNUSED = 1;

        memory.Initialize();
    }

    FetchByte(cycles, memory, address) {
        let result;
        
        result = memory.DATA[address];
        cycles--;
        this.PC++;
        return result;
    }

    FetchWord(cycles, memory, address) {
        let result;
        
        result = (memory.DATA[address] << 8);
        this.PC++;
        result += memory.DATA[address + 1];
        this.PC++;
        cycles--;
        cycles--;
        return result;
    }

    Execute(cycles, memory) {
        let INSTRUCTION;
        
        while (cycles > 0) {
            INSTRUCTION = this.FetchByte(cycles, memory, this.PC);

            switch (INSTRUCTION) {
            // LDA
            case IMM_LDA:   // IMM LDA
                this.A = this.FetchByte(cycles, memory, this.PC); 
                break;
            case ZPG_LDA:   // ZPG LDA
                this.A = this.FetchByte(cycles, memory, this.FetchByte(cycles, memory, this.PC)); 
                break;
            case ZPGX_LDA:  // ZPG X LDA
                this.A = this.FetchByte(cycles, memory, this.FetchByte(cycles, memory, this.PC) + this.X); 
                cycles--;
                break;
            case ABS_LDA:   // ABS LDA
                this.A = this.FetchByte(cycles, memory, this.FetchWord(cycles, memory, this.PC));
                cycles--;
                break;
            case ABSX_LDA:  // ABS X LDA
                this.A = this.FetchByte(cycles, memory, this.FetchWord(cycles, memory, this.PC) + this.A);
                if ((this.PC & 0xFF) === 0xFF) { cycles++; }
                break;
            default:
                cycles--; break;
            }
        }
    }
}
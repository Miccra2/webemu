/* --- ADDRESSING MODES ---

VAL == value
MEM == memory address
PC  == Value of Program Counter
A   == Value of Accumulator

Implicit:
    - for bit manipulation
    - value in instruction itself
    - address calculation:
        PC
    - example operation:
        CLC
        RTS
Immediate:
    - value directly after instruction
    - indicated with `#`
    - address calculation:
        VAL = MEM[PC + 1]
    - example operation:
        LDA #10
Accumulator:
    - example operation:
        LSR A
        ROR A
Zero Page:
    - Hi byte of PC alwarys 00h
    Absolute:
    - indicated with `$`
    - address calculation:
        VAL = MEM[MEM[PC + 1]]
    - example:
        LDA $00
Zero Page, X:
    - address calculation:
        VAL = MEM[MEM[PC + 1] + X]
    - example operation:
        STY $10, X
Zero Page, Y:
    - address calculation:
        VAL = MEM[MEM[PC + 1] + Y]
    - example operation:
        LDX $10, Y
Relative:
    - signed relative offset for -128 to +127
    - address calculation:
        VAL = PC + MEM[PC + 1]
    - example operation:
        BEQ LABLE
        BNE *+4
    - address calculation:
        VAL = (MEM[PC + 1] << 8) + MEM[PC + 2]
    - example operation:
        JMP $1234
Absolute, X:
    - address calculation:
        VAL = (MEM[PC + 1] << 8) + MEM[PC + 2] + X
    -example operation:
        STA $3000, X
Absolute, Y:
    - address calculation:
        VAL = (MEM[PC + 1] << 8) + MEM[PC + 2] + Y
    - example operation:
        AND $4000, Y
Indirect:
    - address calculation:
        VAL = MEM[(MEM[PC + 1] << 8) + MEM[PC + 2]]
    - example operation:
        JMP ($FFFC)
Indexed Indirect:
    - address calculation:
        VAL = MEM[(MEM[PC + 1] << 8) + X]
    - example operation:
        LDA ($40, X)
Indirect Indexed:
    - address calculation:
        VAL = MEM[(X << 8) + MEM[PC + 1]]
*/

/* === INSTRUCTIONS === */
// --- load register ---
// LDA
const IMM_LDA  = 0xA9;
const ZPG_LDA  = 0xA5;
const ZPGX_LDA = 0xB5;
const ABS_LDA  = 0xAD;

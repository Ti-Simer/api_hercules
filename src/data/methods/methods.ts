export class Methods {

    constructor() {}

    parseTrama(trama: string) {
        const regex = /<STX>(\d+)NL([\d.]+)TA([\d.]+)PN([\d.]+)VN([\d.]+)MA([\d.]+)DD([\d.]+)RI(\d{2})SVIN(\d{2})SVOUT(\d{2})<ETX>/;
        const match = trama.match(regex);
        if (!match) {
            throw new Error('Trama no válida');
        }
        return {
            imei: match[1],
            level: parseFloat(match[2]),
            temperature: parseFloat(match[3]),
            pressure: parseFloat(match[4]),
            volume: parseFloat(match[5]),
            mass: parseFloat(match[6]),
            density: parseFloat(match[7]),
            volume_lt: 0,
            volume_gl: 0,
            percent: 0,
            RCI: match[8],
            NVIN: match[9],
            NVOUT: match[10],
        };
    }
}
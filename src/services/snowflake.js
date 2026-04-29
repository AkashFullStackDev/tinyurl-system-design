class Snowflake {
    constructor(serverId){
        this.serverId = BigInt(serverId);
        this.sequence = 0n;
        this.lastTimestamp = 0n;

        this.serverBits = 10n;
        this.sequenceBits = 12n;

        this.maxSequence = (1n << this.sequenceBits) - 1n;

        this.serverIdShift = this.sequenceBits;
        this.timestampShift = this.sequenceBits + this.serverBits;

        this.epoch = 1700000000000n;
    }

    _currentTime(){
        return BigInt(Date.now());
    }

    nextId(){
        let timestamp = this._currentTime();

        if(timestamp < this.lastTimestamp){
            throw new Error("Clock moved backwards");
        }

        if(timestamp === this.lastTimestamp){
            this.sequence = (this.sequence + 1n) & this.maxSequence;

            if(this.sequence === 0n){
                while(timestamp <= this.lastTimestamp){
                    timestamp = this._currentTime();
                }
            }
        } else {
            this.sequence = 0n;
        }

        this.lastTimestamp = timestamp;

        return (
            ((timestamp - this.epoch) << this.timestampShift) |
            (this.serverId << this.serverIdShift) |
            this.sequence
        ).toString();
    }
}

module.exports = Snowflake;
module.exports = (mongoose)=>{
    const timeSch = new mongoose.Schema({
        timestamp: {
            type: String,
            required: true,
        }
    })

    const Time = new mongoose.model('times', timeSch);
    return Time;
}
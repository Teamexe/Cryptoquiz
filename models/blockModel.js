module.exports = (mongoose)=>{
    const blockChainSchema = new mongoose.Schema({
        index: {
            required: true,
            type:Number
        },
        timestamp: {
            required: true,
            type:Date,
            default: Date,
        },
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        points:{
            type:Number,
            required:true,
        }

        // prevHash: {
        //     required: false,
        //     type: String
        // },
        // hash: {
        //     required: true,
        //     type:String
        // }
    })

    const blockchain = new mongoose.model('blockchain',blockChainSchema);

    return blockchain;
}
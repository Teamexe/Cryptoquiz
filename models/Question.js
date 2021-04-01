module.exports = (mongoose)=>{
    const questionSchema = new mongoose.Schema({
        quesNo: {
            type: Number,
            required: true,
        },
        ques:{
            type: String,
            required: true,
        },
        title:{
            type: String,
        },
        ans:{
            type:Number,
            required: true,
        },
        reason:{
            type:String
        }
    })
    const Question = new mongoose.model('question',questionSchema);
    return Question;
}
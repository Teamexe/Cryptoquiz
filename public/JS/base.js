// Parallax Code
var scene = document.getElementById('scene');
var parallax = new Parallax(scene);

document.getElementById("openQuiz").onclick = function (){
    console.log("Clicked")
    var dat = new Date();
    var tim = dat.getTime();
    console.log(tim)
    // location.href = "/quiz";

}
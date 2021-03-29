// Parallax Code
var scene = document.getElementById('scene');
var parallax = new Parallax(scene);

document.getElementById("openQuiz").onclick = function (){
    console.log("Clicked")
    location.href = "/quiz";
}
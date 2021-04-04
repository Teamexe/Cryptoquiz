document.getElementById("outer3").addEventListener("click", toggleState3);
    
function toggleState3() {
  let galleryView = document.getElementById("galleryView")
  let tilesView = document.getElementById("tilesView")
  let outer = document.getElementById("outer3");
  let slider = document.getElementById("slider3");
  let tilesContainer = document.getElementById("tilesContainer");
  if (slider.classList.contains("active")) {
    slider.classList.remove("active");
    outer.classList.remove("outerActive");
    galleryView.style.display = "flex";
    tilesView.style.display = "none";
    
    while (tilesContainer.hasChildNodes()) {
      tilesContainer.removeChild(tilesContainer.firstChild)
      }  
  } else {
    slider.classList.add("active");
    outer.classList.add("outerActive");
    galleryView.style.display = "none";
    tilesView.style.display = "flex";
     
    for (let i = 0; i < imgObject.length - 1; i++) {
      let tileItem = document.createElement("div");
      tileItem.classList.add("tileItem");
      tileItem.style.background =  "url(" + imgObject[i] + ")";
      tileItem.style.backgroundSize = "contain";  
      tilesContainer.appendChild(tileItem);      
    }
  };
}

let imgObject = [
    {
        img : "https://i.imgur.com/xVlgZ2B.jpg",
        name : "Deeksha Sharma",
        link : "https://www.linkedin.com/in/deekshasharma325"
    },
    {
        img : "https://i.imgur.com/1nLfYak.jpg",
        name : "Dhruv Panwar",
        link : "https://www.linkedin.com/in/dhruv-panwar-7884a11ab"
    },
    {
        img : "https://i.imgur.com/Vj80fzQ.png",
        name : "Vasvi Sood",
        link: "https://www.linkedin.com/in/vasvi-sood-091aa319b"
    },
    {
      img:  "https://res.cloudinary.com/dvauvcikd/image/upload/v1614941598/WhatsApp_Image_2021-03-05_at_4.19.29_PM_ahptzv.jpg",
      name : "Mrigank Anand",
      link : "https://www.linkedin.com/in/mrigankanand/"
    },
    {
        img:  "https://i.imgur.com/7sEHXUQ.jpeg",
        name : "Manav Doda",
        link : "https://www.linkedin.com/in/manav-doda/"
    },
    {
        img : "https://avatars.githubusercontent.com/u/57187745?s=460&u=7749a941e865f376453045df84322b56f049f600&v=4",
        name : "Shwetal Soni",
        link : "https://www.linkedin.com/in/shwetal-soni-329753199"
    }
];

let mainImg = 0;
let prevImg = imgObject.length - 1;
let nextImg = 1;

function loadGallery() {

  let mainView = document.getElementById("mainView");
  mainView.style.background = "url(" + imgObject[mainImg].img + ")";
  let nm = document.getElementsByClassName("name");
  console.log(nm)
  nm[0].innerHTML = imgObject[mainImg].name;

  let leftView = document.getElementById("leftView");
  leftView.style.background = "url(" + imgObject[prevImg].img + ")";
  
  let rightView = document.getElementById("rightView");
  rightView.style.background = "url(" + imgObject[nextImg].img + ")";
  
  let linkTag = document.getElementById("linkTag")
  linkTag.href = imgObject[mainImg].link;
  console.log(imgObject[mainImg].link)

};

function scrollRight() {
  
  prevImg = mainImg;
  mainImg = nextImg;
  if (nextImg >= (imgObject.length -1)) {
    nextImg = 0;
  } else {
    nextImg++;
  }; 
  loadGallery();
};

function scrollLeft() {
  nextImg = mainImg
  mainImg = prevImg;
   
  if (prevImg === 0) {
    prevImg = imgObject.length - 1;
  } else {
    prevImg--;
  };
  loadGallery();
};

document.getElementById("navRight").addEventListener("click", scrollRight);
document.getElementById("navLeft").addEventListener("click", scrollLeft);
document.getElementById("rightView").addEventListener("click", scrollRight);
document.getElementById("leftView").addEventListener("click", scrollLeft);
document.addEventListener('keyup',function(e){
    if (e.keyCode === 37) {
    scrollLeft();
  } else if(e.keyCode === 39) {
    scrollRight();
  }
});

loadGallery();



setInterval(function(){ scrollRight() }, 5000);
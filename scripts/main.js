let myImage = document.querySelector('img');

myImage.onclick = function() {
  let mySrc = myImage.getAttribute('src');
  if(mySrc === 'images/sam-cartoon.JPG') {
    myImage.setAttribute ('src','images/synthwave.JPG');
    } else {
    myImage.setAttribute ('src', 'images/sam-cartoon.JPG');

  }
}



//My Button
let myButton = document.querySelector('button');
let myHeading = document.querySelector('h1');

function setUserName() {
  let myName = prompt('Please enter your name.');
  localStorage.setItem('name', myName);
  myHeading.textContent = 'Welcome , ' + myName;
}

if(!localStorage.getItem('name')) {
  setUserName();
} else {
  let storedName = localStorage.getItem('name');
  myHeading.textContent = 'Welcome , ' + storedName;
}

myButton.onclick = function() {
  setUserName();
}

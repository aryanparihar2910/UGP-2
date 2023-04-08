
// console.log('Hello World');
var nav=document.getElementById('navbar');
const tesxt=document.getElementsByClassName('text-to-be-w');

// onscoll some distace from top navbar will be fixed and background will be white and text color will be black before that it will be transparent covering background image

window.onscroll=function(){
    if(window.pageYOffset>100){
        nav.classList.add('fixed-top');
        nav.classList.add('bg-white');
        nav.classList.add('navbar-light');
        nav.classList.remove('navbar-dark');
    }
    else{
        nav.classList.remove('fixed-top');
        nav.classList.remove('bg-white');
        nav.classList.remove('navbar-light');
        nav.classList.add('navbar-dark');
        tesxt.style.color='white';
    }
}












// Path: js\main.js




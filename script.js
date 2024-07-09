const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const arrowBtns = document.querySelectorAll(".wrapper i");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const carouselChildrens = [...carousel.children];

let isDragging = false, startX, startScrollLeft, timeoutId;

//get num of cards that can fit in carousel
let cardPerView = Math.round(carousel.offset / firstCardWidth);

//insert copied of for infinite scrolling 
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

//insert 
carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

//event listener clicking the buttons
arrowBtns.forEach(btn => {
    btn.addEventListener("click", ()=> {
        carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth
    })
});

const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging")
    // initial pos of carousel
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    if(!isDragging)return; // isnt dragging return here
    //updates the position
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging")

}

const autoPlay = () => {
    if(window.innerWidth < 800) return; // if window smaller than 800
    // move left every 2500ms
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 8000);
}
autoPlay();

const infiniteScroll = () => {
    // if on left then go to the end
    if(carousel.scrollLeft === 0 ) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    //if on the right go to the beginning s
    } else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) { 
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }

    // autoplay if mouse not hovering
    clearTimeout(timeoutId);
    if(!wrapper.matches(":hover")) autoPlay();
}

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", infiniteScroll);
document.addEventListener("mouseup", autoPlay)

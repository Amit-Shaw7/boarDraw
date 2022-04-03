let toolsCont = document.querySelector(".tools-cont");
let optionCont = document.querySelector(".options-cont");
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let sticky = document.querySelector(".stickyNotes");
let upload = document.querySelector(".upload");

let optionsFlag = true;
let pencilFlag = false;
let eraseFlag = false;
let noteContFlag = false;


optionCont.addEventListener("click", (e) => {
    optionsFlag = !optionsFlag;

    if (optionsFlag) openTools();
    else closeTools();

});

function openTools() {
    let iconElem = optionCont.children[0];
    iconElem.classList.remove("fa-times");
    iconElem.classList.add("fa-bars");
    toolsCont.style.display = "flex";
}
function closeTools() {
    let iconElem = optionCont.children[0];
    iconElem.classList.remove("fa-bars");
    iconElem.classList.add("fa-times");
    toolsCont.style.display = "none";
}

pencil.addEventListener("click", (e) => {
    pencilFlag = !pencilFlag;
    if (pencilFlag) {
        pencilToolCont.style.display = "block";
    } else {
        pencilToolCont.style.display = "none";
    }
});

eraser.addEventListener("click", (e) => {
    eraseFlag = !eraseFlag;
    if (eraseFlag) {
        eraserToolCont.style.display = "flex";
    } else {
        eraserToolCont.style.display = "none";
    }
});

sticky.addEventListener("click", (e) => {
    let stickyContTemplate = `
    <div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
    <div class="note-cont">
        <textarea spellcheck="false"></textarea>
    </div>
    `;

    createStickyCont(stickyContTemplate)
});

upload.addEventListener('click' , (e) => {
    // Open File Explorer
    let input = document.createElement("input");
    input.setAttribute("type" , "file");
    input.click();

    input.addEventListener("change" , (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);
        let stickyContTemplate = `
            <div class="header-cont">
                <div class="minimize"></div>
                <div class="remove"></div>
            </div>
            <div class="note-cont">
                <img src = ${url} />
            </div>
            `;
            createStickyCont(stickyContTemplate)
    })
});

function createStickyCont(templateHTML) {
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont");
    stickyCont.innerHTML = templateHTML;
    document.body.appendChild(stickyCont);

    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");
    

    noteActions(minimize, remove, stickyCont);

    // let remove = stickyCont.querySelector(".remove");

    stickyCont.onmousedown = function (event) {
        dragNDrop(stickyCont, event);
    };
    stickyCont.ondragstart = function () {
        return false;
    };

}

function dragNDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;
    // document.body.append(element);

    moveAt(event.pageX, event.pageY);

    // moves the element at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the element on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the element, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}

function noteActions(minimize, remove, stickyCont) {
    // let noteContFlag = false;
    remove.addEventListener("click", (e) => {
        stickyCont.remove();
    })

    minimize.addEventListener("click", () => {
        let noteCont = stickyCont.querySelector(".note-cont");
        let display = getComputedStyle(noteCont).getPropertyValue("display");
        noteContFlag = !noteContFlag;
        if(display === "none") noteCont.style.display = "flex";
        else noteCont.style.display = "none";
    })
}




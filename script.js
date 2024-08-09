const fileInput = document.querySelector(".file-input"),
filterOptions = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterValue = document.querySelector(".filter-info .Value"),
previewImg = document.querySelector(".preview-img img"),
rotateOption = document.querySelectorAll(".rotate button"),
filterSlider= document.querySelector(".slider input"),
resetButton = document.querySelector(".controls .reset-filter"),
chooseImgBtn = document.querySelector(".choose-img"),
saveImgButton = document.querySelector(".save-img");

let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;


const applyFilter = () =>{
    previewImg.style.transform =`rotate(${rotate}deg)  scale(${ flipHorizontal }, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

const loadImage = () => {
    let file = fileInput.files[0];  // Getting user selected file
    if(!file) return;  // return if user hasn't selected file
    previewImg.src = URL.createObjectURL(file); // passing file url as preview img src
    previewImg.addEventListener("load", () => {
        resetButton.click(); // clicking reset btn, so the filter value reset if the user select the new img
        document.querySelector(".container").classList.remove("disable"); // Enable when img is load
    })
}

filterOptions.forEach(option =>{
    option.addEventListener("click",() =>{  // adding clicking event to all filter buttons
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if(option.id == "brightness"){
            filterSlider.max = "200" ;
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        }else if(option.id == "saturation"){
            filterSlider.max = "200" ;
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        }  else if(option.id == "inversion"){
            filterSlider.max = "100" ;
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else{
            filterSlider.max = "100" ;
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    })
})

const updateFilter = ()=>{
    filterValue.innerText =` ${filterSlider.value}% `;
    const selectedFilter = document.querySelector(".filter .active"); //getting selected filter btn
    if(selectedFilter.id === "brightness"){
        brightness = filterSlider.value;
    }else if(selectedFilter.id === "saturation"){
        saturation = filterSlider.value;
    }else if(selectedFilter.id === "inversion"){
        inversion = filterSlider.value;
    } else{
    grayscale = filterSlider.value;
    }
    applyFilter();
}

rotateOption.forEach(option => {
    option.addEventListener("click",() =>{   // adding clicking event to all rotate/flip buttons
        if(option.id === "left"){
            rotate -= 90;                   //clicking left btn Decrement rotate value to -90
        }else if(option.id === "right"){
            rotate +=90;                   //clicking left btn Increment rotate value to -90
        }else if(option.id === "horizontal"){
            //if flipHorizontal value is 1,set this value to -1 or else 1
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        }else{
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
            applyFilter();
    });

});

const resetFilter = ()=>{
    //reset all it's default value
        brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
        rotate = 0, flipHorizontal = 1, flipVertical = 1;
        filterOptions[0].click(); //clicking brightness btn , so the brightness selected by default
        applyFilter();
}

const saveImage = () => {
    const canvas = document.createElement("canvas"); //creating canvas element
    const ctx = canvas.getContext("2d"); // canvas.getContext return a drawing context on the canvas
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;

    // Applying user selected filter to canvas filter
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;

    if(rotate != 0){  // If rotate isn't 0, rotate the canvas
        ctx.rotate(rotate * Math.PI / 180);
    }

    //Flip canvas, horizontally / vertically
    ctx.scale(flipHorizontal,flipVertical);

    //Translating canvas from center
    ctx.translate(canvas.width / 2 , canvas.height / 2 );

    //DrawImage(image to draw , dx , dy , dWidth , dHeight)
    ctx.drawImage(previewImg , -canvas.width / 2 , -canvas.height / 2 , canvas.width ,canvas.height);
    // document.appendChild(canvas);

    const link = document.createElement("a"); //creating <a> element
    link.download = "image.jpg" // Passing <a> tag download value to "image-jpg"
    link.href = canvas.toDataURL(); // Passing <a> tag href value to canvas data url
    link.click(); // clicking <a> tag so the image is download
}

fileInput.addEventListener("change", loadImage);
resetButton.addEventListener("click", resetFilter);
saveImgButton.addEventListener("click", saveImage);
filterSlider.addEventListener("input",updateFilter);
chooseImgBtn.addEventListener("click", () => fileInput.click());
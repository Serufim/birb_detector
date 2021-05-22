base64_image = ""
preload_image = document.getElementById('preload')
file_input = document.getElementById('file_input')
load_button = document.getElementById('load_button')
detector_type = document.getElementById('detector_type')
result_section = document.getElementById('result_section')
result_image = document.getElementById('result_image')
detector_confidence = document.getElementById('detector_confidence')
file_input.addEventListener('change', function () {
    const file = this.files[0]
    if (file) {
        const reader = new FileReader()
        reader.addEventListener('load', function () {
            base64_image = this.result;
            preload_image.style['background'] = `url(${base64_image})`
            load_button.removeAttribute("disabled")
        })
        reader.readAsDataURL(file)
    }
})

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/jpeg");
    return dataURL;
}

document.querySelectorAll('.birbs img').forEach(item => item.addEventListener('click', (e) => {
    birb = e.target
    console.log(birb.width)
    console.log(birb.height)
    base64_image = getBase64Image(birb)
    console.log(base64_image)
    preload_image.style['background'] = `url(${base64_image})`
    load_button.removeAttribute("disabled")
}))
load_button.addEventListener('click', () => {
    data = {
        "img_data": base64_image,
        "detector_type": detector_type.value,
        "detector_confidence": detector_confidence.value
    }
    result_image.innerHTML = ''
    axios.post('/send_birb', data).then(
        responce => {
            const new_image = document.createElement('img')
            new_image.setAttribute('src', 'data:image/png;base64,' + responce.data)
            result_section.classList.remove('is-hidden')
            result_image.appendChild(new_image)
        }
    )


})
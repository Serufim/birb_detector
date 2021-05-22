from flask import Flask, render_template, url_for, request
from io import BytesIO
import torch
from PIL import Image
import re
import base64

app = Flask(__name__, static_url_path='/static')


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/send_birb', methods=['POST'])
def get_birb():
    image_data = re.sub('^data:image/.+;base64,', '', request.json['img_data'])
    detector_type = request.json['detector_type']
    conf = float(request.json['detector_confidence'])
    if detector_type == 'multi':
        weights = 'weights/multiclass.pt'
    else:
        weights = 'weights/single_class.pt'
    im = Image.open(BytesIO(base64.b64decode(image_data)))

    model = torch.hub.load('ultralytics/yolov5', 'custom', path=weights)
    model.conf = conf
    output = model(im)
    output.render()
    for img in output.imgs:
        buffered = BytesIO()
        img_base64 = Image.fromarray(img)
        img_base64.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')


if __name__ == '__main__':
    app.run()

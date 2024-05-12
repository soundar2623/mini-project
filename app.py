from flask import Flask, render_template, request
import os

app = Flask(__name__)

# Specify the template folder explicitly
template_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ''))
app.template_folder = template_dir

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/qrcode.html')
def qrcode_html():
    qr_data = request.args.get('qrdata')
    return render_template('qrcode.html', qrdata=qr_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

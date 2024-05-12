from flask import Flask, render_template, request, redirect, url_for
import os

app = Flask(__name__)

# Specify the template folder explicitly
template_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ''))
app.template_folder = template_dir

authenticated = False

@app.route('/')
def index():
    if authenticated:
        return redirect(url_for('welcome'))
    else:
        return render_template('index.html')

@app.route('/qrcode.html')
def qrcode_html():
    qr_data = request.args.get('qrdata')
    return render_template('qrcode.html', qrdata=qr_data)

@app.route('/authenticate', methods=['POST'])
def authenticate():
    # Replace this with your authentication logic
    global authenticated
    authenticated = True
    return redirect(url_for('welcome'))

@app.route('/welcome')
def welcome():
    # Clear the authentication flag to allow subsequent authentications
    global authenticated
    authenticated = False
    print("Redirecting to welcome.html")  # Add this line for debugging
    return render_template('welcome.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Wohhooo!!!"

@app.route('/storeInCass/<username>', methods=['GET', 'POST'])
def storeInCass(username):
    if request.method == 'POST':
	console.log('Data is:'+request.data)


if __name__ == "__main__":
    app.run(debug=True)
    app.run()


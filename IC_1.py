from flask import Flask, render_template

app = Flask(__name__)
#route -> SIMV.com (exemplo)

@app.route("/")
def homepage():
    return render_template("Homepage.html")
@app.route("/TelaConfiguracao")
def TelaConfiguracao():
    return render_template("TelaConfiguracao.html")
@app.route("/TelaDeCriacao")
def TelaDeCriacao():
    return render_template("TelaDeCriacao.html")
@app.route ("/TelaDeSimulacao")
def TelaDeSimulacao():
    return render_template("TelaDeSimulacao.html")

#colocar o site no ar
if __name__ == "__main__":
    app.run(debug=True)
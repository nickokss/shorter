# app.py
from flask import Flask, request, redirect, render_template, jsonify
from models import db, URL
import hashlib

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///urls.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

@app.before_request
def create_tables():
    db.create_all()

def generar_short_url(long_url):
    return hashlib.sha256(long_url.encode()).hexdigest()[:8]

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        url_original = request.form['url']
        url_existente = URL.query.filter_by(long_url=url_original).first()

        if url_existente:
            # Si la URL ya existe, envía un mensaje con la URL corta existente
            mensaje = f"URL corta: {request.host_url}{url_existente.short_url}"
        else:
            # Si no existe, crea una nueva
            url_corta = generar_short_url(url_original)
            nueva_url = URL(long_url=url_original, short_url=url_corta)
            
            db.session.add(nueva_url)
            db.session.commit()

            mensaje = f"URL corta: {request.host_url}{url_corta}"

        return render_template('index.html', mensaje=mensaje)

    return render_template('index.html')

@app.route('/<short_url>')
def redirect_to_long_url(short_url):
    link = URL.query.filter_by(short_url=short_url).first_or_404()
    return redirect(link.long_url)

@app.route('/latest_urls')
def latest_urls():
    # Obtén las últimas 5 URLs acortadas de la base de datos
    latest_urls = URL.query.order_by(URL.id.desc()).limit(5).all()
    urls = [url.short_url for url in latest_urls]
    full_urls = [url.long_url for url in latest_urls]

    # Combina las URLs acortadas y completas en un diccionario
    url_data = [{'short_url': short_url, 'full_url': full_url} for short_url, full_url in zip(urls, full_urls)]

    # Retorna la respuesta JSON con ambas URLs
    return jsonify({'urls': url_data})

if __name__ == '__main__':
    app.run(debug=True)

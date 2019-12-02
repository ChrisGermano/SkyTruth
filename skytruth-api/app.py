from chalice import Chalice

app = Chalice(app_name='skytruth-api')


@app.route('/')
def index():
    return {'hello': 'world'}


@app.route('/test')
def test():
    return {"latitude": 36.1699, "longitude": 115.1398}

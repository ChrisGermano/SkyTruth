from uuid import uuid4
import boto3
import requests
from chalice import Chalice
import envsettings

app = Chalice(app_name='skytruth-api')

BUCKET_NAME = 'skytruthdata'

# Contains Oil_Slick_Database.csv
BUCKET_CSV_PREFIX = 'Training_Sample/'

# Put image objects inside this folder
BUCKET_OUTPUT_PREFIX = 'Training_Images/'


@app.route('/', methods=['GET'])
def index():
    return {'hello': 'world'}


# TODO: Returns a list of most likely lat/long objects
@app.route('/candidates', methods=['GET'])
def candidates():
    return {
        "latitude": 36.1699,
        "longitude": 115.1398,
        "id": uuid4()
    }


@app.route('/reform-img-urls', methods=['GET'])
def reform_img_urls():
    s3 = boto3.resource('s3')
    bucket = s3.Bucket(BUCKET_NAME)

    for objs in bucket.objects.filter(Prefix=BUCKET_CSV_PREFIX):
        print(objs)







# The view function above will return {"hello": "world"}
# whenever you make an HTTP GET request to '/'.
#
# Here are a few more examples:
#
# @app.route('/hello/{name}')
# def hello_name(name):
#    # '/hello/james' -> {"hello": "james"}
#    return {'hello': name}
#
# @app.route('/users', methods=['POST'])
# def create_user():
#     # This is the JSON body the user sent in their POST request.
#     user_as_json = app.current_request.json_body
#     # We'll echo the json body back to the user in a 'user' key.
#     return {'user': user_as_json}
#
# See the README documentation for more examples.
#

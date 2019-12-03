import boto3
import json
from chalice import Chalice


app = Chalice(app_name='skytruth-api')

BUCKET_NAME = 'skytruthdata'

# Contains Oil_Slick_Database.csv
BUCKET_CSV_PREFIX = 'Training_Sample/'

# Put image objects inside this folder
BUCKET_OUTPUT_PREFIX = 'Training_Images/'

TABLE_NAME = "candidate_ships"


# TODO
@app.route('/candidates', methods=['GET'])
def candidates():
    client = boto3.client('dynamodb')

    table = client.Table(TABLE_NAME)

    data = table.query( KeyConditionExpression=Key('image_id'))

    return json.dumps(data['Items'])


@app.route('/', methods=['GET'])
def index():
    return {'hello': 'world'}

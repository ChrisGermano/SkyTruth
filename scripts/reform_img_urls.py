from uuid import uuid4
import json
import io
import boto3
import requests
import envsettings

BUCKET_NAME = 'skytruthdata'

# Contains Oil_Slick_Database.csv
BUCKET_CSV = 'Training_Sample/Oil_Slick_Database.csv'

# Put image objects inside this folder
BUCKET_OUTPUT_PREFIX = 'Training_Images/'


def reform_img_urls():
    # s3 = boto3.resource(
    #     's3',
    #     aws_access_key_id=envsettings.AWS_ACCESS_KEY_ID,
    #     aws_secret_access_key=envsettings.AWS_SECRET_ACCESS_KEY
    # )

    s3 = boto3.client('s3')

    obj = s3.get_object(Bucket=BUCKET_NAME, Key=BUCKET_CSV)
    data = obj['Body'].read().decode('utf-8')

    file = io.StringIO(data)
    for line in file.readlines()[1:2]:
        line = line.strip().split(',')
        print(line)


    # file = obj.get()['Body'].read().decode('utf-8')
    #
    # for line in file.readlines()[:100]:
    #     print(line)


if __name__ == '__main__':

    reform_img_urls()

import io
import boto3

BUCKET_NAME = 'skytruthdata'

# Contains Oil_Slick_Database.csv
BUCKET_CSV = 'Training_Sample/Oil_Slick_Database.csv'

# Put image objects inside this folder
BUCKET_OUTPUT_PREFIX = 'Training_Images/'

FILE_PREFIX = ''


def reform_img_urls():
    s3 = boto3.client('s3')

    obj = s3.get_object(Bucket=BUCKET_NAME, Key=BUCKET_CSV)
    data = obj['Body'].read().decode('utf-8')

    file = io.StringIO(data)
    for line in file.readlines()[1:2]:
        line = line.strip().split(',')
        img = line[0]


if __name__ == '__main__':
    reform_img_urls()

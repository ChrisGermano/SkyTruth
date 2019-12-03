import boto3
import csv
import sys


def convertAISToRDS():
    region = 'us-east-1'
    recList = []
    try:
        s3=boto3.client('s3')
        # s3 = boto3.resource('s3')
        print "Connected S3"
        dyndb = boto3.client('dynamodb', region_name=region)
        print "Connected Dynamo!"
        # bucket = s3.Bucket('skytruthdata')
        # print "Got Bucket!"
        # confile = bucket.Object('ais/2019000000000000.csv')
        # confile = bucket.Object('ais/ais_small.csv')
        confile = s3.get_object(Bucket='skytruthdata', Key='ais/2019000000000000.csv')
        # theContents = confile.get()
        # print "Confile:", theContents

        recList = confile[u'Body'].read().split('\n')
        # print "reclist!", recList
        firstrecord = True
        csv_reader = csv.reader(recList, delimiter=',', quotechar='"')
        # print "start"
        for row in csv_reader:
            #print "Processing", row
            if (firstrecord):
                firstrecord = False
                continue
            if (row):
                mmsi = row[0]
                timestamp = row[1]
                lat = row[2]
                lon = row[3]
                course = row[4]
                heading = row[5]
                speed = row[6]
                status = row[9]
                if mmsi and timestamp and lat and lon and course and heading and speed and status: 
                    response = dyndb.put_item(
                        TableName='AIS_Ship_Location',
                        Item={
                            'mmsi': {'N': str(mmsi)},
                            'timestamp': {'S': timestamp},
                            'lat': {'N': lat},
                            'lon': {'N': lon},
                            'course': {'N': course},
                            'heading': {'N': heading},
                            'speed': {'N': speed},
                            'status': {'N': status},
                        }
                    )

        print('Put succeeded:')
    except Exception, e:
        print(str(e))


def main():
    convertAISToRDS()

main()
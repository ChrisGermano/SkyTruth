# download image from s3
# send the image to SageMaker
# if the result is true, retrieve location from the image and find a ship around the spill via DynamoDB
# Save combined result to the DynamoDB

require 'aws-sdk-s3'
require 'aws-sdk-dynamodb'
require 'faraday'
require 'faraday_middleware'
require 'geoutm'

SAGEMAKER_ENDPOINT = 'https://example.com'

s3 = Aws::S3::Client.new(region: 'us-east-1')
sagemaker_client = Faraday.new SAGEMAKER_ENDPOINT do |conn|
  #conn.request :json
  conn.response :json, :content_type => /\bjson$/
end

new_objects = s3.list_objects(bucket: 'skytruthdata', prefix: 'Training_Images/S')
new_objects.contents.each do |new_object|
  p new_object.key
  p image_id = new_object.key.sub(/Training_Images\//, '').sub(/\.tif/, '')
  p new_object.key
  real_object = s3.get_object(bucket: 'skytruthdata', key: new_object.key)
  tmp_filename = "./tmp/#{new_object.key}"
  open(tmp_filename, 'w') {|f| f.print real_object.body.read }
  gdal = `gdalinfo #{tmp_filename}`
  p latlons = gdal.split("\n").select{|l| l=~/(Upper|Lower)/}.map {|line|
    res = line.match(/\(\s*([\d\.]+),\s*([\d\.]+)\)/)
    latlon = GeoUtm::UTM.new('32S', res[2].to_f, res[1].to_f).to_lat_lon
  }

  # for Demo, use random number for probability instead of requesting to SageMaker
  p probability = rand
  #response = sagemaker_client.post('/', file: new_object.body)
  #if response.success?
  #  probability = response.body['probability']
  #else
  #  p response
  #end

  # Finding ship location here
  # dynamoDB = Aws::DynamoDB::Resource.new(region: 'us-east-1')
  # table = dynamoDB.table('AIS_Ship_Location')
  # ship = table.query(...)
  dynamoDB = Aws::DynamoDB::Resource.new(region: 'us-east-1')
  table = dynamoDB.table('candidate_ships')

  image_url = "https://skytruth-aws-hackathon.s3-us-west-2.amazonaws.com/8_bit_png/#{image_id}.png"
  table.put_item(
    {
      item: {
        "image_id" => image_id,
        "image_url" => image_url,
        "image_coordinates" => latlons.map {|ll| { lat: ll.lat, lon: ll.lon } },
        "probability": probability,
        "ship": {
        },
      }
    }
  )

end

# Costs for s3/glue/athena datalake

- prices are current US East region

## [s3](https://aws.amazon.com/s3/pricing/)

- First 50 TB / Month	$0.023 per GB
- Next 450 TB / Month	$0.022 per GB
- Over 500 TB / Month	$0.021 per GB

- All data transfer in	$0.00 per GB

## [glue](https://aws.amazon.com/athena/pricing/)

- $0.44 per DPU-Hour, billed per second, with a 10-minute minimum per crawler run

## [athena](https://aws.amazon.com/athena/pricing/)

- $5 per TB scanned

## Back of the envelope usage calc

- 7018 kb per request (largest provider)
- 12 runs per day (every 2hrs)
- 100 listing services


- 803.14 MB

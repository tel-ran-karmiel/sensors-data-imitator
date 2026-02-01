# Densors Data Imitator Definition
## Create manually from AWS console topic "sensors-data-ingest"
## Write JS script for data imitation and publishing to the topic "sensors-data-ingest"
### Introduce constant containing number generated values
### Introduce three configuration JS objects
1. Key - string with Sensor Id from ("123", "124", "125", "126"), thus 4 fields, value - array with two integer numbers with minimal and maximal values as the normal ranges<br>
2. The same keys as for #1 and values-arrays but values less than minimal<br>
3. The same keys as for #2 and values-arrays but values greater than maximal
### Introduce two probability values in percents
1. Probability of incorrect value of a sensor, for example 10<br>
2. Probability of incorrect value that is less than minimal, for example 50
### Algorithm
#### Receiving value
1. Generate random sensor Id (array of id's and generating random index of the array)
2. Generating chance value (0 - 100); If the chance less #1 probability value, generate chance value (0-100); If the chance less than #2 probability value, generate number from range of #2 configuration object<br>
2.1 Else for first "if" from #1, generate number from range of #1 configuration object
2.2 Else for second "if" from #1, generate number from range of #3 configuration object
3. Repeat #1 - #2 according to number generated value
#### Publish received random value to the created SNS topic "sensors-data-ingest"
publish JSON containing sensor Id and value generated in the item for receiving value
Repeat according to number generated value


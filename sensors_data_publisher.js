import "dotenv/config"


import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const REGION = "us-east-1";
const TOPIC_ARN = "<topic ARN>";

const SENSOR_IDS = ["123", "124", "125", "126"];

const SENSORS_NORMAL_VALUES = {
  [SENSOR_IDS[0]]: [30, 60],
  [SENSOR_IDS[1]]: [10, 80],
  [SENSOR_IDS[2]]: [20, 30],
  [SENSOR_IDS[3]]: [60, 120],
};

const SENSORS_LOW_VALUES = {
  [SENSOR_IDS[0]]: [10, 29],
  [SENSOR_IDS[1]]: [0, 9],
  [SENSOR_IDS[2]]: [3, 19],
  [SENSOR_IDS[3]]: [20, 59],
};

const SENSORS_HIGH_VALUES = {
  [SENSOR_IDS[0]]: [61, 100],
  [SENSOR_IDS[1]]: [81, 100],
  [SENSOR_IDS[2]]: [31, 50],
  [SENSOR_IDS[3]]: [121, 200],
};

const PROBABILITY_ABNORMAL_VALUES = 10; 
const PROBABILITY_LOW_VALUES = 60; 
const N_PROBES = 200;

const sns = new SNSClient({ region: REGION });

function randInt(min, max) {
  // inclusive min/max like Python random.randint
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomChance(probability) {
  return Math.random() < probability / 100
}

async function publish(sensorId, value) {
  const dataJson = JSON.stringify({
    sensorId,
    value,
    timestamp: Date.now()
  });

  const cmd = new PublishCommand({
    TopicArn: TOPIC_ARN,
    Message: dataJson,
  });

  const resp = await sns.send(cmd);
  console.log(resp);
}

function getAbnormalValue(id) {
  const pickLow = randomChance(PROBABILITY_LOW_VALUES);
  if (pickLow) {
    const [min, max] = SENSORS_LOW_VALUES[id];
    return randInt(min, max);
  } else {
    const [min, max] = SENSORS_HIGH_VALUES[id];
    return randInt(min, max);
  }
}

function getNormalValue(id) {
  const [min, max] = SENSORS_NORMAL_VALUES[id];
  return randInt(min, max);
}

function getIdValue() {
  const id = randomChoice(SENSOR_IDS);
  const isAbnormal = randomChance(PROBABILITY_ABNORMAL_VALUES);
  const value = isAbnormal ? getAbnormalValue(id) : getNormalValue(id);
  return { id, value };
}

async function main() {
  for (let i = 0; i < N_PROBES; i++) {
    const { id, value } = getIdValue();
    await publish(id, value);
  }
}

main().catch((err) => {
  console.error("ERROR:", err);
});

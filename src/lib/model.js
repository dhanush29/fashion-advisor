const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
require('dotenv').config(); 

const PAT = process.env.PAT;
const USER_ID = process.env.USER_ID;
const APP_ID = process.env.APP_ID;
const MODEL_ID = process.env.MODEL_ID;
const MODEL_VERSION_ID = process.env.MODEL_VERSION_ID;
const RAW_TEXT = 'Give a advice to improve the fashion within 50 words? Output as a single paragraph without points.';

async function getRawTextFromImage(imageBytes) {
    return new Promise((resolve, reject) => {
        const stub = ClarifaiStub.grpc();
        const metadata = new grpc.Metadata();
        metadata.set("authorization", "Key " + PAT);

        stub.PostModelOutputs(
            {
                user_app_id: {
                    "user_id": USER_ID,
                    "app_id": APP_ID
                },
                model_id: MODEL_ID,
                version_id: MODEL_VERSION_ID,
                inputs: [
                    {
                        "data": {
                            "text": {
                                "raw": RAW_TEXT,
                            },
                            "image": {
                                "base64": imageBytes
                            }
                        }
                    }
                ]
            },
            metadata,
            (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    if (response.status.code !== 10000) {
                        reject("Post model outputs failed, status: " + response.status.description);
                    } else {
                        const output = response.outputs[0];
                        resolve(output.data.text.raw);
                    }
                }
            }
        );
    });
}

export { getRawTextFromImage };

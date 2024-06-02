const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");


const PAT = 'a9cc81a85a7d41c097514c393dade2e3';
const USER_ID = 'liuhaotian';
const APP_ID = 'llava';
const MODEL_ID = 'llava-v1_6-mistral-7b';
const MODEL_VERSION_ID =  '763595a061834b12adb55c929716145e';
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

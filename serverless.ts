import type { AWS } from "@serverless/typescript";

import notifier from "@functions/notifier";

const serverlessConfiguration: AWS = {
  service: "lambdasns",
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  plugins: ["serverless-webpack"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "us-east-2",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      SNS_TOPIC_ARN: "${cf:lambdasns-dev.SNSCursoTopicoArn}",
    },
    lambdaHashingVersion: "20201221",
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: "SNS:Publish",
            Resource: "${cf:lambdasns-dev.SNSCursoTopicoArn}",
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { notifier },
  resources: {
    Resources: {
      SNSCursoTopico: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "SNSCursoTopico",
        },
      },
    },
    Outputs: {
      SNSCursoTopicoArn: {
        Value: {
          Ref: "SNSCursoTopico",
        },
      },
      SNSCursoTopicoName: {
        Value: { "Fn::GetAtt": ["SNSCursoTopico", "TopicName"] },
      },
    },
  },
};

module.exports = serverlessConfiguration;

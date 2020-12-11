import type { Serverless } from 'serverless/aws';
import { ALLOWED_IMAGES } from './src/config/config';

// TODO: Setup TEST API
// TODO: Deal with DB Connection issues
// TODO: If lambda fails
// TODO: Deal with 'network error' error type 
const sharedEnv = {
  jwt: "${env:jwt}",
  dburl: "${ssm:hdva.image.service.db}",
  dbname: "${ssm:hdva.image.db.name}",
  dbauth: "${ssm:hdva.image.db.auth}",
  dbreplica: "${ssm:hdva.image.db.replica}",
};
const serverlessConfiguration: Serverless = {
  org: "jeromednelson",
  app: "hdva-api-app",
  service: "${env:SLS_SERVICE}",
  frameworkVersion: '2',
  custom: {
    customDomain: {
      basePath: "v1",
      certificateArn: "${ssm:hdva.image.domain.arn}",
      domainName: "${ssm:hdva.image.domain}",
      apiType: 'rest',
      createRoute53Record: true
    },
    apigwBinary: {
      types: ALLOWED_IMAGES
    },
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  plugins: ['serverless-webpack', 'serverless-domain-manager', 'serverless-apigw-binary', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    iamRoleStatements: [
      {
        Action: ['s3:PutObject'],
        // TODO: Change this IAM to user with specific rights
        // Otherwise application will have temporary rights to do anything on AWS account
        Resource: ["${ssm:hdva.image.iam}"],
        Effect: "Allow",
      }
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
  },
  functions: {
    auth: {
      environment: sharedEnv,
      handler: 'handler.login',
      events: [
        {
          http: {
            cors: true,
            method: 'post',
            path: 'login',
          }
        }
      ]
    },
    groups: {
      handler: 'handler.groups',
      environment: sharedEnv,
      events: [
        {
          http: {
            authorizer: {
              name: "jwtAuth",
              resultTtlInSeconds: 0,
              identitySource: "method.request.header.Authorization"
            },
            cors: true,
            method: 'get',
            path: 'groups',
          }
        }
      ]
    },
    groupCRUD: {
      handler: 'handler.groupCRUD',
      environment: sharedEnv,
      events: [
        {
          http: {
            authorizer: {
              name: "jwtAuth",
              resultTtlInSeconds: 0,
              identitySource: "method.request.header.Authorization"
            },
            cors: true,
            method: 'post',
            path: 'groups/{action}',
          },
        },
      ]
    },
    propertyCRUD: {
      handler: 'handler.propertyCRUD',
      environment: sharedEnv,
      events: [
        {
          http: {
            authorizer: {
              name: "jwtAuth",
              resultTtlInSeconds: 0,
              identitySource: "method.request.header.Authorization"
            },
            cors: true,
            method: 'post',
            path: 'properties/{action}',
          },
        },
      ]
    },
    property: {
      handler: 'handler.properties',
      environment: sharedEnv,
      events: [
        {
          http: {
            authorizer: {
              name: "jwtAuth",
              resultTtlInSeconds: 0,
              identitySource: "method.request.header.Authorization"
            },
            cors: true,
            method: 'get',
            path: 'properties',
          },
        },
        {
          http: {
            authorizer: {
              name: "jwtAuth",
              resultTtlInSeconds: 0,
              identitySource: "method.request.header.Authorization"
            },
            cors: true,
            method: 'get',
            path: 'properties',
          }
        },
        {
          http: {
            authorizer: {
              name: "jwtAuth",
              resultTtlInSeconds: 0,
              identitySource: "method.request.header.Authorization"
            },
            cors: true,
            method: 'post',
            path: 'properties',
          }
        }

      ]
    },
    register: {
      handler: 'handler.register',
      environment: sharedEnv,
      events: [
        {
          http: {
            authorizer: {
              name: "jwtAuth",
              resultTtlInSeconds: 0,
              identitySource: "method.request.header.Authorization"
            },
            method: 'post',
            path: 'register',
          }
        }
      ]
    },
    roles: {
      handler: 'handler.roles',
      environment: sharedEnv,
      events: [
        {
          http: {
            authorizer: {
              name: "jwtAuth",
              resultTtlInSeconds: 0,
              identitySource: "method.request.header.Authorization"
            },
            cors: true,
            method: 'get',
            path: 'roles',
          }
        }
      ]
    },
    users: {
      handler: 'handler.users',
      environment: sharedEnv,
      events: [
        {
          http: {
            authorizer: {
              name: "jwtAuth",
              resultTtlInSeconds: 0,
              identitySource: "method.request.header.Authorization"
            },
            cors: true,
            method: 'get',
            path: 'users',
          }
        }
      ]
    },
    images: {
      handler: 'handler.signedURL',
      environment: {
        ...sharedEnv,
        bucketname: "${ssm:hdva.image.bucket}"
      },
      events: [
        {
          http: {
            // authorizer: {
            //   name: "jwtAuth",
            //   resultTtlInSeconds: 0,
            //   identitySource: "method.request.header.Authorization"
            // }, 
            cors: true,
            method: 'post',
            path: 'images/{eventId}',
          }
        }
      ]
    },
    jwtAuth: {
      handler: "handler.jwtVerify",
      environment: sharedEnv
    }
  }
}

module.exports = serverlessConfiguration;

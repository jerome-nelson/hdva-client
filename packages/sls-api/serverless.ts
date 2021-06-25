import type { Serverless } from 'serverless/aws';
import { ALLOWED_IMAGES } from './src/config/config';

// TODO: Split bundles using Webpack (lambda packages too big)
// TODO: Setup TEST API
// TODO: Deal with DB Connection issues
// TODO: If lambda fails
// TODO: Deal with 'network error' error type 
// TODO: Create Buckets for S3
const sharedEnv = {
  jwt: "${env:JWT}",
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
    customDomains: [
      {
        createRoute53Record: true,
        endpointType: "edge",
        securityPolicy: "tls_1_2",
        apiType: "rest",
        basePath: "v1",
        certificateArn: "${ssm:hdva.image.domain.arn}",
        domainName: "${ssm:hdva.image.domain}",
        stage: "production"
      },
      {
        basePath: "v1",
        certificateArn: "${ssm:hdva.image.dev.domain.arn}",
        createRoute53Record: true,
        domainName: "${ssm:hdva.image.dev.domain}",
        stage: "dev"
      },
    ],
    apigwBinary: {
      types: ALLOWED_IMAGES
    },
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  plugins: ['serverless-webpack', 'serverless-domain-manager', 'serverless-apigw-binary'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    iamRoleStatements: [
      {
        Action: ['s3:getObject'],
        Resource: ["${ssm:hdva.image.iam}"],
        Effect: "Allow",
      },
      {
        Action: ['s3:PutObject'],
        Resource: ["${ssm:hdva.image.iam}"],
        Effect: "Allow",
      }
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
  },
  functions: {
    deleteFromWebBucket: {
      handler: "handler.deleteFromPublicBucket",
      role: "${ssm:hdva.image.bucket.lambda.role}",
      description: "Lambda Delete function (triggered by s3 bucket event)",
      environment: {
        web_bucket: "${ssm:hdva.image.bucket.web}"
      },
    },
    pushToWebBucket: {
      handler: 'handler.sendToPublicBucket',
      role: "${ssm:hdva.image.bucket.lambda.role}",
      description: "Lambda Resize function (triggered by s3 bucket event)",
      environment: {
        web_bucket: "${ssm:hdva.image.bucket.web}",
        bucket_region: "${ssm:hdva.image.bucket.region}"
      },
    },
    auth: {
      handler: 'handler.login',
      environment: sharedEnv,
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
    getImage: {
      handler: 'handler.signedUrlGetObject',
      environment: {
        ...sharedEnv,
        highres_bucket_name: "${ssm:hdva.image.bucket}",
        zip_bucket_name: "${ssm:hdva.zip.bucket}",
        bucket_region: "${ssm:hdva.image.bucket.region}"
      },
      events: [{
        http: {
          authorizer: {
            name: "jwtAuth",
            resultTtlInSeconds: 0,
            identitySource: "method.request.header.Authorization"
          },
          cors: true,
          method: 'post',
          path: 'image/download',
        },
      }]

    },
    getZip: {
      handler: 'handler.getZip',
      timeout: 180,
      environment: {
        ...sharedEnv,
        highres_bucket_name: "${ssm:hdva.image.bucket}",
        zip_bucket_name: "${ssm:hdva.zip.bucket}",
        bucket_region: "${ssm:hdva.image.bucket.region}"
      },
      events: [{
        http: {
          authorizer: {
            name: "jwtAuth",
            resultTtlInSeconds: 0,
            identitySource: "method.request.header.Authorization"
          },
          cors: true,
          method: 'post',
          path: 'generate-download',
        },
      }]
    },
    getPropertyMedia: {
      handler: 'handler.getPropertyMedia',
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
            path: 'get-media',
          }
        }
      ]
    },
    propertyCount: {
      handler: 'handler.propertiesCount',
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
            path: 'properties-count',
          }
        }

      ]
    },
    groupCount: {
      handler: 'handler.groupCount',
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
            path: 'group-count',
          }
        }

      ]
    },
    userCount: {
      handler: 'handler.usersCount',
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
            path: 'users-count',
          }
        }

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
            cors: true,
            method: 'post',
            path: 'register',
          }
        }
      ]
    },
    CRUDMedia: {
      handler: 'handler.CRUDMedia',
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
            path: 'media/{action}',
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
            method: 'post',
            path: 'users',
          }
        }
      ]
    },
    getUser: {
      handler: 'handler.getUser',
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
            path: 'get-user',
          }
        }
      ]
    },
    images: {
      handler: 'handler.signedUrlPutObject',
      environment: {
        ...sharedEnv,
        highres_bucket_name: "${ssm:hdva.image.bucket}",
        web_bucket: "${ssm:hdva.image.bucket.web}",
        bucket_region: "${ssm:hdva.image.bucket.region}"
      },
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
            path: 'images/upload',
          }
        }
      ]
    },
    jwtAuth: {
      environment: sharedEnv,
      handler: "handler.jwtVerify",
    }
  },
  resources: {
      Resources: {
        ExpiredTokenResponse: {
          Type: 'AWS::ApiGateway::GatewayResponse',
          Properties: {
            ResponseParameters: {
              "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
              "gatewayresponse.header.Access-Control-Allow-Headers": "'*'"
            },
            ResponseType: "ACCESS_DENIED",
            RestApiId: {
              Ref: 'ApiGatewayRestApi'
            },
            StatusCode: '401'
          },
        },
      },
  },
};

module.exports = serverlessConfiguration;

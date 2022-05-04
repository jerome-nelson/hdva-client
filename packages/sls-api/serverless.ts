import type { Serverless } from 'serverless/aws';
import { ALLOWED_IMAGES } from './src/config/config';

const sharedEnv = {
  jwt: "${ssm:hdva.jwt}",
  dburl: "${ssm:hdva.image.service.db}",
  dbname: "${ssm:hdva.image.db.name}",
  dbauth: "${ssm:hdva.image.db.auth}",
  dbreplica: "${ssm:hdva.image.db.replica}",
};
const serverlessConfiguration: Serverless = {
  org: "jeromednelson",
  app: "hdva-api-app",
  service: "hdva",
  frameworkVersion: '3',
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
  package: {
    individually: true,
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
      handler: "src/bucket-operations/deleteFromPublicBucket.deleteFromPublicBucket",
      role: "${ssm:hdva.image.bucket.lambda.role}",
      description: "Lambda Delete function (triggered by s3 bucket event)",
      environment: {
        web_bucket: "${ssm:hdva.image.bucket.web}"
      },
    },
    pushToWebBucket: {
      handler: 'src/bucket-operations/cleanAndGenerateFiles.cleanAndGenerateFiles',
      role: "${ssm:hdva.image.bucket.lambda.role}",
      description: "Cleans input given and generates the web resized files in web-bucket.",
      environment: {
        web_bucket: "${ssm:hdva.image.bucket.web}",
        bucket_region: "${ssm:hdva.image.bucket.region}"
      },
    },
    auth: {
      handler: 'src/functions/auth/login.login',
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
      handler: 'src/functions/roles/groups.groups',
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
      handler: 'src/functions/roles/groupCRUD.groupCRUD',
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
      handler: 'src/functions/property/uploads.signedUrlGetObject',
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
      handler: 'src/functions/property/createZip.getZip',
      timeout: 30,
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
      handler: 'src/functions/property/getPropertyMedia.getPropertyMedia',
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
      handler: 'src/functions/property/propertiesCount.propertiesCount',
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
      handler: 'src/functions/roles/groupCount.groupCount',
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
      handler: 'src/functions/user/usersCount.usersCount',
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
      handler: 'src/functions/property/propertyCRUD.propertyCRUD',
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
      handler: 'src/functions/property/properties.properties',
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
      handler: 'src/functions/auth/register.register',
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
      handler: 'src/functions/property/CRUDMedia.CRUDMedia',
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
      handler: 'src/functions/roles/roles.roles',
      environment: sharedEnv,
      events: [
        {
          http: {
            authorizer: {
              name: "goAuth",
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
      handler: 'src/functions/user/users.users',
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
      handler: 'src/functions/user/getUser.getUser',
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
      handler: 'src/functions/property/uploads.signedUrlPutObject',
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
      handler: "src/functions/auth/jwtVerify.jwtVerify",
    },
    goAuth: {
      environment: sharedEnv,
      runtime: "go1.x",
      memorySize: 128,
      package: {     	
        exclude: ["**"],
        include: ["lib/bin/**"]
      },
      handler: "lib/bin/auth",
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

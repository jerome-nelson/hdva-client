import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'hdva',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    customDomain: {
      certificateArn: "arn:aws:acm:us-east-1:954356549748:certificate/b753674e-6305-4995-b941-80752f6bc4ab",
      domainName: 'api.hdvirtualart.com',
      basePath: '',
      apiType: 'rest',
      createRoute53Record: true
    },
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  plugins: ['serverless-webpack', 'serverless-domain-manager'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
  },
  functions: {
    auth: {
      handler: 'handler.login',
      events: [
        {
          http: {
            method: 'post',
            async: true,
            path: 'login',
          }
        }
      ]
    },
    property: {
      handler: 'handler.properties',
      events: [
        {
          http: {
            method: 'get',
            async: true,
            path: 'properties',
          }
        }
      ]
    },
    register: {
      handler: 'handler.register',
      events: [
        {
          http: {
            method: 'post',
            async: true,
            path: 'register',
          }
        }
      ]
    },
    roles: {
      handler: 'handler.roles',
      events: [
        {
          http: {
            method: 'get',
            async: true,
            path: 'roles',
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;

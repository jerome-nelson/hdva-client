
// export interface LambdaEvent {
//     success: boolean;
//     data: {
//         event: {
//             resource:;
//             path:;
//             httpMethod:;
//             headers:;
//             multi
//         }
//     }
// }

// TODO: Add Type for lambda event using the exasmple below
// {
//     "success": true,
//     "data": {
//         "event": {
//             "resource": "/images",
//             "path": "/v1/images",
//             "httpMethod": "POST",
//             "headers": {
//                 "Accept": "*/*",
//                 "Accept-Encoding": "gzip, deflate, br",
//                 "CloudFront-Forwarded-Proto": "https",
//                 "CloudFront-Is-Desktop-Viewer": "true",
//                 "CloudFront-Is-Mobile-Viewer": "false",
//                 "CloudFront-Is-SmartTV-Viewer": "false",
//                 "CloudFront-Is-Tablet-Viewer": "false",
//                 "CloudFront-Viewer-Country": "PL",
//                 "Content-Type": "multipart/form-data; boundary=--------------------------086279947420897792483169",
//                 "Host": "api.hdvirtualart.com",
//                 "User-Agent": "PostmanRuntime/7.26.8",
//                 "Via": "1.1 5d40d4ac7c3a1e18748166636540091f.cloudfront.net (CloudFront)",
//                 "X-Amz-Cf-Id": "YwFSYrpUOnmnzse4bOjcD1fPq7KKznH2IyqdsDJopCqwZkMI1BLmyg==",
//                 "X-Amzn-Trace-Id": "Root=1-5fd2709d-0981bda0463cc7417a970466",
//                 "X-Forwarded-For": "89.64.48.198, 54.239.171.101",
//                 "X-Forwarded-Port": "443",
//                 "X-Forwarded-Proto": "https"
//             },
//             "multiValueHeaders": {
//                 "Accept": [
//                     "*/*"
//                 ],
//                 "Accept-Encoding": [
//                     "gzip, deflate, br"
//                 ],
//                 "CloudFront-Forwarded-Proto": [
//                     "https"
//                 ],
//                 "CloudFront-Is-Desktop-Viewer": [
//                     "true"
//                 ],
//                 "CloudFront-Is-Mobile-Viewer": [
//                     "false"
//                 ],
//                 "CloudFront-Is-SmartTV-Viewer": [
//                     "false"
//                 ],
//                 "CloudFront-Is-Tablet-Viewer": [
//                     "false"
//                 ],
//                 "CloudFront-Viewer-Country": [
//                     "PL"
//                 ],
//                 "Content-Type": [
//                     "multipart/form-data; boundary=--------------------------086279947420897792483169"
//                 ],
//                 "Host": [
//                     "api.hdvirtualart.com"
//                 ],
//                 "User-Agent": [
//                     "PostmanRuntime/7.26.8"
//                 ],
//                 "Via": [
//                     "1.1 5d40d4ac7c3a1e18748166636540091f.cloudfront.net (CloudFront)"
//                 ],
//                 "X-Amz-Cf-Id": [
//                     "YwFSYrpUOnmnzse4bOjcD1fPq7KKznH2IyqdsDJopCqwZkMI1BLmyg=="
//                 ],
//                 "X-Amzn-Trace-Id": [
//                     "Root=1-5fd2709d-0981bda0463cc7417a970466"
//                 ],
//                 "X-Forwarded-For": [
//                     "89.64.48.198, 54.239.171.101"
//                 ],
//                 "X-Forwarded-Port": [
//                     "443"
//                 ],
//                 "X-Forwarded-Proto": [
//                     "https"
//                 ]
//             },
//             "queryStringParameters": null,
//             "multiValueQueryStringParameters": null,
//             "pathParameters": null,
//             "stageVariables": null,
//             "requestContext": {
//                 "resourceId": "j5azno",
//                 "resourcePath": "/images",
//                 "httpMethod": "POST",
//                 "extendedRequestId": "XWaImELcoAMF9vQ=",
//                 "requestTime": "10/Dec/2020:19:01:49 +0000",
//                 "path": "/v1/images",
//                 "accountId": "954356549748",
//                 "protocol": "HTTP/1.1",
//                 "stage": "dev",
//                 "domainPrefix": "api",
//                 "requestTimeEpoch": 1607626909352,
//                 "requestId": "44292916-8244-43ed-a916-db99f33f577e",
//                 "identity": {
//                     "cognitoIdentityPoolId": null,
//                     "accountId": null,
//                     "cognitoIdentityId": null,
//                     "caller": null,
//                     "sourceIp": "89.64.48.198",
//                     "principalOrgId": null,
//                     "accessKey": null,
//                     "cognitoAuthenticationType": null,
//                     "cognitoAuthenticationProvider": null,
//                     "userArn": null,
//                     "userAgent": "PostmanRuntime/7.26.8",
//                     "user": null
//                 },
//                 "domainName": "api.hdvirtualart.com",
//                 "apiId": "sq8wq59ln3"
//             },
//             "body": "----------------------------086279947420897792483169\r\nContent-Disposition: form-data; name=\"\"; filename=\"127592806_111385307463615_5953451314347740539_n.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n����
# Connect for Commerce Bridge Commons Module

This module contains the common parts required by a Connect for Commerce bridge.
All that needs to be provided in addition is the shop-specific implementation in the so called services.

Full examples of how to use this module can be found [here](https://github.com/topics/connect-for-commerce-bridge).

Further information about how to implement and use a bridge can be found in the official [documentation](https://docs.e-spirit.com/ecom/fsconnect-com/FirstSpirit_Connect_for_Commerce_Documentation_EN.html).

For more information about FirstSpirit or Connect for Commerce please use [this contact form](https://www.crownpeak.com/contact-us) to get in touch.

## How to use

1. Install the module using `npm i fcecom-bridge-commons --save`.
2. Use the module within your bridge's start file, e.g.:

```js
const bridge = BridgeCore({
  username: 'johndoe',
  password: 'password123',
  servicesDir: path.join(process.cwd(), './src/service'),
  port: 3000,
  logLevel: 'INFO',
  features: {
    contentPages: true,
    categoryTree: true
  },
  useSsl: true,
  sslCert: path.join(process.cwd(), './ssl/cert.pem'),
  sslKey: path.join(process.cwd(), './ssl/cert.key')
});
```
3. Add your shop-specific code to the services directory. Make sure to follow the required structure (see below).
4. Run your bridge's start file. The server will be listening on the configured port. The Swagger UI can be accessed under http://localhost:3000/docs.

You may receive the underlying Express app instance by calling
```js
const app = bridge.getAppInstance();
```

## Configuration
|Property|Description|Required|Default|
|-------|-------|-------|-------|
|username|The username to use for Basic authentication against the bridge.|Yes||
|password|The password to use for Basic authenticaiton against the bridge.|Yes||
|servicesDir|The directory that contains the service implementations (absolute).|Yes||
|port|The port to start the bridge on.|No|3000|
|logLevel|The Log Level for request logging (for possible values see Logging chapter)|No|INFO|
|features|List of optional features that the bridge supports. See below.|No| All disabled
|useSsl|Whether to start the server using the HTTPS protocol.|No|false
|sslCert|Path to the certificate file to use when SSL is active.|If `useSsl` is `true`||
|sslKey|Path to the private key file to use when SSL is active.|If `useSsl` is `true`||


## Features
The bridges may or may not support the following features. If the feature is supported, the corresponding HEAD request will return a success. Otherwise it will return an error.

By default, all optional features are assumed to be not supported.

|Feature name|Description|
|--------|--------|
|contentPages|The bridge can display content pages and may be able to create, update and delete them.|
|categoryTree|The bridge is able to provide the categories as a nested tree.|

## Services
The file names of the services need to match the pattern `<Controller>Service` and provide the methods mentioned below.

If a method returns an object, the property containing an array (`[]`) will be writted to the response. If it contains `total` and `hasNext`, these properties are returned in the response header (`X-Total` and `X-HasNext`).

If a method is noted to return `{ }`, the return value will be written as is.

### CategoriesService
- `async categoriesGet(parentId, lang, page)`
    - -> `{ categories: [], total: number, hasNext: boolean }`
- `async categoriesCategoryIdsGet(categoryIds, lang)`
    - -> `{ categories: [] }`
- `async categoryTreeGet(parentId, lang)` (optional)
    - -> `{ categorytree: [] }`

### ContentPagesService
- `async contentPagesContentIdDelete(contentId, lang)`
    - -> `{ }`
- `async contentPagesContentIdPut(body, lang, contentId)`
    - -> `{ }`
- `async contentPagesContentIdsGet(contentIds, lang)`
    - -> `{ contentPages: [] }`
- `async contentPagesGet(q, lang, page)`
    - -> `{ contentPages: [], total: number, hasNext: boolean }`
- `async contentPagesPost(body, lang)`
    - -> `{ }`

### MappingService
- `async lookupUrlGet(url)`
    - -> `{ }`
- `async storefrontUrlGet(type, id, lang)`
    - -> `{ }`

### ProductsService
- `async productsGet(categoryId, q, lang, page)`
    - -> `{ products: [], total: number, hasNext: boolean }`
- `async productsProductIdsGet(productIds, lang)`
    - -> `{ products: [] }`

## Logging
For logging a `createLogger(logLevel)` function is provided.
The Logger in turn provides several methods corresponding with the log levels, 
such that it will only Log the input when an appropriate LogLevel is used.

Please note that the LogLevel can also be passed to the config when creating the Express server.
This log level determines which http status codes are logged by the express server.

The possible Loglevels, their corresponding methods and the status codes that are logged are listed below.

|Value|Description|method|status code|
|-------|-------|-------|-------|
|DEBUG|enables all logging outputs |logDebug()|all|
|INFO|enables logging outputs of level Info and below|logInfo()| <=100
|WARNING|enables logging outputs of level Warning and below|logWarning()|<=300
|ERROR|enables logging outputs of level Error and below|logError()|<=400
|NONE|disables all Logging Outputs| |none

## Error Handling
This library handles errors by catching the errors thrown by the services and returning them to the user inside of the response.
An error should ideally include some sort of detailed message and a status code to convey the problem that caused this error more clearly.
A thrown error should look like the following:
```js
// the error object
const error = {
  data: 'Details about the error (could also be an object i.E the Error response of the Server',
  status: 404 // the error code to be returned by the commons 
} 

// throwing of error
// as a simple error throw
throw error;
// as promise rejection
Promise.reject(error);
```

## Parameter validation
### Required parameters
Some API endpoints require that certain parameters are existent (e.g. at least one ID when using the /ids/ endpoints).
If one if these required parameters is missing, the server will respond with a `HTTP 400` error and a message describing what is missing.

### Manually validating specific parameters
Because not all shop systems are the same, we cannot determine the required type of certain parameters (e.g. the IDs of categories).
Therefore the validation of these parameters has to happen inside the service implementations.
To allow a unified behavior in case of an invalid parameter, this module offers functions to parse the values and automatically respond with an `HTTP 400` error in case of an invalid input.

```js
const { getNumber } = require('fcecom-bridge-commons');

const categoriesGet = async (parentId, lang, page = 1) => {
    // Will throw a ParameterValidationError that is handled inside this module if "parentId" is not a numeric string
    parentId = parentId && getNumber(parentId, 'parentId');
}
```

## Error handling POST/PUT
As every shop system provides different error messages for invalid request bodies when creating or updating a page, the errors must be unified in a way the First Spirit Connect for Commerce Module can understand.
### Unified Error Object
The First Spirit Connect for Commerce Module can understand the following response body:

```json
{
  "error": [
    {
      "field": "<field-name>",
      "cause": "<error-cause>",
      "code": "<error-code>"
    }
  ]
}
```

### Error Codes
This module provides error codes which the FirstSpirit Module can understand.
Please determine which code is suitable for the error and pass it as described in the following example.
The error codes can be imported as follows:
```js
const { ErrorCode } = require('fcecom-bridge-commons');
```

### BodyValidationError
This module provides the BodyValidationError which accepts an array of errors as error cause. The handler of this error makes the bridge respond with a `HTTP 400` error and a response body as described above.

Example to use:
```js
throw new BodyValidationError('Invalid field in body', {
            cause: [
                {
                    field: '<field-name>',
                    cause: '<error-cause>',
                    code: "<error-code>"
                }
            ]
        });
```

### ShopError
In case the shop returns an error or shows unexpected behavior, the bridge should throw a `ShopError` in order to properly handle the error within the module.

## Legal Notices
The Connect for Commerce Bridge Commons module is a product of [Crownpeak Technology GmbH](https://www.crownpeak.com), Dortmund, Germany. The Connect for Commerce Bridge Commons module is subject to the Apache-2.0 license.

Details regarding any third-party software products in use but not created by Crownpeak Technology GmbH, as well as the third-party licenses and, if applicable, update information can be found in the file THIRD-PARTY.txt.

## Disclaimer
This document is provided for information purposes only. Crownpeak may change the contents hereof without notice. This document is not warranted to be error-free, nor subject to any other warranties or conditions, whether expressed orally or implied in law, including implied warranties and conditions of merchantability or fitness for a particular purpose. Crownpeak specifically disclaims any liability with respect to this document and no contractual obligations are formed either directly or indirectly by this document. The technologies, functionality, services, and processes described herein are subject to change without notice.

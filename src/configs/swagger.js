import swaggerJSDoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Claim Request API',
      version: '1.0.0',
      description: 'Swagger doc for Claim Request project 🚀'
    },
    servers: [
      {
        url: 'http://localhost:3333'
      }
    ]
  },
  apis: ['./src/routes/*.js'] // nơi chứa comment API
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec

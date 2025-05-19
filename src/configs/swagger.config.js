import swaggerJSDoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Medical Management System API',
      version: '1.0.0',
      description: 'Swagger documentation for School Medical Management System 📚🩺'
    },
    servers: [
      {
        url: 'http://localhost:3333'
      }
    ],
    tags: [
      // thứ tự tags hiển thị
      { name: 'Test', description: 'Test server' },
      { name: 'Auth', description: 'Authentication endpoints' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/**/*.js']
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec

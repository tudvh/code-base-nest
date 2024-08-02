import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { useContainer } from 'class-validator'

import { AllExceptionsFilter } from './common/filters'
import { LoggingInterceptor } from './common/interceptors'
import { TrimPipe } from './common/pipes'
import { AppModule } from './app.module'

async function bootstrap() {
  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule)

  // Obtain the configuration service instance
  const configService = app.get(ConfigService)

  // Enable Cross-Origin Resource Sharing (CORS) for the application
  app.enableCors({ origin: configService.get('frontendUrl') })

  // Apply custom trim pipe globally to trim all string inputs
  app.useGlobalPipes(new TrimPipe())

  // Apply global validation pipe to transform payloads and validate DTOs
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  // Apply global exception filter to handle all exceptions
  app.useGlobalFilters(new AllExceptionsFilter())

  // Apply global logging interceptor to log responses
  app.useGlobalInterceptors(new LoggingInterceptor())

  // Set up dependency injection container with fallback on errors
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  // Start the application, listening on the specified port
  const PORT = configService.get('port')
  await app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}

bootstrap()

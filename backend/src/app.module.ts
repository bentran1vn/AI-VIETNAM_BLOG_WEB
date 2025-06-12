import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PostModule } from "./posts/post.module";
import { FilesModule } from "./files/files.module";
import { UserModule } from "./users/user.module";
import { Request, Response } from "express";

interface GraphQLContext {
  req: Request;
  res: Response;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), "src/schema.gql"),
        sortSchema: true,
        playground: configService.get<boolean>("GRAPHQL_PLAYGROUND"),
        introspection: configService.get<boolean>("GRAPHQL_INTROSPECTION"),
        context: ({ req, res }: { req: Request; res: Response }): GraphQLContext => ({ req, res }),
      }),
      inject: [ConfigService],
    }),
    PostModule,
    FilesModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

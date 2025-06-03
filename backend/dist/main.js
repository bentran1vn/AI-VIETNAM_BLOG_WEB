"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new http_exception_filter_1.GlobalExceptionFilter());
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
    console.error("Application failed to start:", error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("Testing endpoint")
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}
    
    @ApiOkResponse({
        description: "Example endpoint"
    })
    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}

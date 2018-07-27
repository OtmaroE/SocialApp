import { Get, Controller } from '@nestjs/common';
import { AppService } from 'app.service';
import { ApiUseTags } from '@nestjs/swagger';

@Controller()
@ApiUseTags('Hello World')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // root(): string {
  //   return this.appService.root();
  // }

}

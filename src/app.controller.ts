import { Get, Controller, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(): string {
    return this.appService.root();
  }
  @Get('user/:id/debt')
  async findOne(@Param('id') id){
    return await `Showing debt from user #${id}`;
  }
}

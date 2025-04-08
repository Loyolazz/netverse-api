import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt/jwt.guard';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private userService: UserService) {}

    @Get('me')
    async getMe(@Req() req: RequestWithUser) {
        return this.userService.findById(req.user.sub);
    }
}

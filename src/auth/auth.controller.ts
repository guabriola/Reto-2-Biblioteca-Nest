import { Body, Controller, Post, UseGuards, Request, Req } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from 'src/common/decorators/public-auth.decorator';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/loginDto.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private userService: UsersService, private authService: AuthService) { }
  /**
   * SignUp
   * */
  @ApiOperation({
    summary: 'SignUp new user - Public Access',
  })
  @Public()
  @Post("signup")
  signup(@Body() newUser: CreateUserDto): Promise<UserDto> {
    return this.userService.createUser(newUser);
  }

  /**
   * Login
   * */
  @ApiOperation({ summary: 'Login user and return JWT token - Public Access' })
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    description: 'User credentials',
    type: LoginDto, // Data Transfer Object for Swagger
  })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}

import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { loginDto } from 'src/validators/login.validator';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  
  @Post('login')
  async login(@Body() loginDto: loginDto) {
    console.log('Login request:', loginDto);
  
    const identifier = loginDto.username || loginDto.email;
    const password = loginDto.password;
  
    if (!identifier || !password) {
      throw new HttpException('Username/email va parol kerak!', HttpStatus.BAD_REQUEST);
    }
  
    const user = await this.usersService.findByUsernameOrEmail(identifier);

    if (!user) {
      throw new HttpException('Invalid username or email', HttpStatus.NOT_FOUND);
    }
  
    // user.password o‘rniga user.dataValues.password ishlatamiz
    const userPassword = user.dataValues.password;
    if (!userPassword) {
      throw new HttpException('User password not found in database', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  
    const isPasswordValid = await this.usersService.validatePassword(password, userPassword);

    if (!isPasswordValid) {
      throw new HttpException('Invalid username or email', HttpStatus.UNAUTHORIZED);
    }
  
    const payload = { id: user.dataValues.id, nickname: user.dataValues.username, role: user.dataValues.role };
    const token = this.jwtService.sign(payload);

  
    return { access_token: token };
  }
  


}

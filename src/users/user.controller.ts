import { Controller, Post, Get, Param, Body, Put, Delete, NotFoundException, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

import { User } from './user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { JwtAuthGuard } from 'src/authguard/jwt-auth.guard';
import { Express } from 'express';

import { extname } from 'path';
import { unlink } from 'fs';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import { Roles } from 'src/validators/RolesGuard/Roles';
import { RolesGuard } from 'src/validators/RolesGuard/Roluse.guard';
import { CreateUsersDto, Role, UpdateUserDto } from 'src/validators/users.validator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Post()
  async create(@Body() createUserDto: CreateUsersDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }



  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Customer)

  @Get('username/:nickname')
  async findByNickname(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findBynickname(username);
    if (!user) {
      throw new NotFoundException(`User with nickname ${username} not found`);
    }
    return user;
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Admin, Role.Customer)

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatar',
        filename: (req, file, callback) => {
          if (!file) return callback(null, '');
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname).toLowerCase();
          const fileName = `${uniqueSuffix}${ext === '.heic' || ext === '.heif' ? '.webp' : ext}`;
          callback(null, fileName);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|heic|heif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async updateProfile(
    @Param('id') id: number,
    @Body() updateProfileDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      const user = await this.usersService.findOne(id);
      let avatar: string | undefined;

      // Agar fayl mavjud bo‘lsa
      if (file) {
        const ext = extname(file.originalname).toLowerCase();
        const filePath = `./uploads/avatar/${file.filename}`;

        if (ext === '.heic' || ext === '.heif') {
          const outputFileName = file.filename.replace(ext, '.webp');
          const outputPath = `./uploads/avatar/${outputFileName}`;

          await sharp(filePath).toFormat('webp').toFile(outputPath);
          await fs.unlink(filePath);

          avatar = `/uploads/avatar/${outputFileName}`;
        } else {
          avatar = `/uploads/avatar/${file.filename}`;
        }


        console.log('Yuklangan rasm:', user.dataValues.avatar);
        // Eski rasmni o‘chirish
        if (user.dataValues.avatar) {
          const oldImagePath = `.${user.dataValues.avatar}`;
          unlink(oldImagePath, (err) => {
            if (err) {
              console.error('Eski rasmni o‘chirishda xatolik:', err);
            }
          });
        }
      }

      // Yangi ma’lumotlar bilan yangilash
      const updatedData = {
        ...updateProfileDto,
        ...(avatar && { avatar }),
      };

      const updatedProfile = await this.usersService.update(id, updatedData);

      return {
        message: 'Profil muvaffaqiyatli yangilandi',
        updatedProfile,
      };
    } catch (error) {
      return {
        message: 'Profilni yangilashda xatolik yuz berdi',
        error: error.message,
      };
    }
  }

  

@Post('forgot-password')
async forgotPassword(@Body('email') email: string) {
  return this.usersService.sendPasswordResetEmail(email);
}

// 🔑 Kiritilgan kod orqali parolni yangilash
@Post('reset-password')
async resetPassword(
  @Body('resetCode') resetCode: string,
  @Body('newPassword') newPassword: string
) {
  return this.usersService.resetPassword(resetCode, newPassword);
}

@Post('send-email-code')
async sendEmailCode(@Body('email') email: string) {
  return this.usersService.sendEmailConfirmationCode(email);
}
@Post('confirm-email-code')
async confirmEmailWithCode(
  @Body('email') email: string,
  @Body('code') code: string
) {
  return this.usersService.confirmEmailWithCode(email, code);
}


@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.Customer)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.usersService.deleteUser(id);
  }
}

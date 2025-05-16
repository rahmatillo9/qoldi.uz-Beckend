import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { MailService } from 'src/email/mail.service';

import { Op } from 'sequelize';
import * as dotenv from "dotenv";
import { CreateUsersDto, UpdateUserDto } from 'src/validators/users.validator';

dotenv.config();
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly mailService: MailService
  ) {}

  async create(createUserDto: CreateUsersDto) {
    try {
      // Parolni hash qilish
      const hashPassword = await bcrypt.hash(createUserDto.password, 10);
  
      // Yangi foydalanuvchi yaratish
      return await this.userModel.create({
        ...createUserDto,
        password: hashPassword,
      } as User);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Bu email bilan ro‘yxatdan o‘tgan foydalanuvchi mavjud.');
      }
      throw new InternalServerErrorException('Serverda kutilmagan xatolik yuz berdi.');
    }
  }
  

  async generateEmailConfirmationToken(userId: number): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex'); // 32 baytli tasodifiy token
    await this.userModel.update({ emailConfirmationToken: token }, { where: { id: userId } });

    return token;
  }

  async sendEmailConfirmationCode(email: string) {
    const user = await this.userModel.findOne({ where: { email } });
  
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
  
    const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();
  
    // Kodni bazaga saqlaymiz
    await this.userModel.update({ verificationCode: confirmationCode }, { where: { email } });
  
    // Emailga kod jo‘natamiz
    await this.mailService.sendEmail(
      email,
      'Emailni tasdiqlash',
      `Emailingizni tasdiqlash uchun kod: ${confirmationCode}`
    );
  
    return { message: 'Tasdiqlash kodi emailingizga yuborildi!' };
  }


  async confirmEmailWithCode(email: string, code: string) {
    const user = await this.userModel.findOne({ where: { email }, raw: true });
  
    
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
  
    if (!user.verificationCode || user.verificationCode !== code) {
      throw new BadRequestException('Tasdiqlash kodi noto‘g‘ri');
    }
    
  
    // Email tasdiqlandi
    await this.userModel.update(
      { isEmailConfirmed: true, verificationCode: undefined }, // kodni undefined qilamiz
      { where: { email } }
    );
  
    return { message: 'Email tasdiqlandi!' };
  }
  
  
  async confirmEmail(token: string) {
    const user = await this.userModel.findOne({ where: { emailConfirmationToken: token } });
  
    if (!user) {
      throw new BadRequestException('Noto‘g‘ri yoki muddati o‘tgan token');
    }
  
    user.isEmailConfirmed = true;
    user.emailConfirmationToken = undefined; // Token ishlatilganidan keyin uni o‘chiramiz
    await user.save();
  
    return { message: 'Emailingiz muvaffaqiyatli tasdiqlandi!' };
  }
  

  async validatePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    if (!plainTextPassword || !hashedPassword) {
      console.log('Validation error: Password or hash is missing');
      throw new Error('Password or hashed password is missing');
    }
    const isValid = await bcrypt.compare(plainTextPassword, hashedPassword);
    console.log('Password validation result:', isValid);
    return isValid;
  }

  async findBynickname(username: string) {
    return this.userModel.findOne({ where: { username } });
  }


  async findAll(): Promise<User[]> {
    return this.userModel.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number) {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserProfileDto: UpdateUserDto): Promise<User> {
    const userProfile = await this.userModel.findByPk(id);
    if (!userProfile) {
      throw new NotFoundException(`User Profile ID: ${id} not found`);
    }
    return userProfile.update(updateUserProfileDto);
  }

  async findByUsernameOrEmail(identifier: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { 
        [Op.or]: [{ username: identifier }, { email: identifier }] 
      },
      // raw: true bo‘lsa, olib tashlang yoki kommentga oling
    });
  }
  
  

  async deleteUser(id: number): Promise<void> {
    const user = await this.userModel.findOne({ where: { id } });
    if (user) {
      await user.destroy();
    }
  }

  // 📌 1. Email orqali foydalanuvchini topish
  async findByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }


  // 📌 2. Email yoki username orqali foydalanuvchini topish
  async findByEmailOrNickname(email: string, username: string) {
    return this.userModel.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });
  }

  async sendPasswordResetEmail(email: string) {
    const user = await this.userModel.findOne({ where: { email } });
  
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
  
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Yaratilgan kod:", resetCode);
  
    // Bazaga to‘g‘ridan-to‘g‘ri yozamiz
    await this.userModel.update({ resetCode }, { where: { email } });
  
    // Email yuborish
    await this.mailService.sendEmail(
      email,
      'Parolni tiklash',
      `Parolingizni tiklash uchun ushbu kodni kiriting: ${resetCode}`
    );
  
    return { message: 'Parolni tiklash kodi emailingizga yuborildi!' };
  }
  
  
  async resetPassword(resetCode: string, newPassword: string) {
    const user = await this.userModel.findOne({ where: { resetCode } });
  
    if (!user) {
      throw new BadRequestException('Noto‘g‘ri yoki eskirgan tiklash kodi');
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    user.set({
      password: hashedPassword,
      resetCode: null, // resetCode is explicitly set to null
    });
  
    await user.save();
  
    return { message: 'Parolingiz muvaffaqiyatli o‘zgartirildi!' };
  }
  
}

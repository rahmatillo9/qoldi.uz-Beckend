import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    UploadedFile,
    UseInterceptors,
    UseGuards,
  } from '@nestjs/common';
  import { ProductImageService } from './product-image.service';
  import { CreateProductImageDto } from 'src/validators/product-image.validator';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  import { existsSync, unlink } from 'fs';
  import { JwtAuthGuard } from 'src/authguard/jwt-auth.guard';
  import { RolesGuard } from 'src/validators/RolesGuard/Roluse.guard';
  import { Roles } from 'src/validators/RolesGuard/Roles';
  import { Role } from 'src/validators/users.validator';
  
  @Controller('product-images')
  export class ProductImageController {
    constructor(private readonly productImageService: ProductImageService) {}
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Customer)
    @Post()
    @UseInterceptors(
      FileInterceptor('image', {
        storage: diskStorage({
          destination: './uploads/productImage',
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `${uniqueSuffix}${ext}`;
            cb(null, filename);
          },
        }),
        fileFilter: (req, file, cb) => {
          if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
          }
          cb(null, true);
        },
      }),
    )
    async create(
      @UploadedFile() file: Express.Multer.File,
      @Body() dto: CreateProductImageDto,
    ) {
      if (!file) return { message: 'Image file is required' };
  
      const imageUrl = `/uploads/productImage/${file.filename}`;
      const newImage = await this.productImageService.create({ ...dto, imageUrl });
  
      return {
        message: 'Product image created successfully',
        newImage,
      };
    }
  
    @Get()
    async findAll() {
      const images = await this.productImageService.findAll();
      return { message: 'All images fetched', images };
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Customer)
    @Put(':id')
    @UseInterceptors(
      FileInterceptor('image', {
        storage: diskStorage({
          destination: './uploads/productImage',
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `${uniqueSuffix}${ext}`;
            cb(null, filename);
          },
        }),
        fileFilter: (req, file, cb) => {
          if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
          }
          cb(null, true);
        },
      }),
    )
    async update(
      @Param('id') id: number,
      @UploadedFile() file: Express.Multer.File,
      @Body() dto: CreateProductImageDto,
    ) {
      const productImage = await this.productImageService.findOne(id);
      if (!productImage) return { message: 'Product image not found' };
  
      if (productImage.imageUrl && file) {
        const oldPath = `.${productImage.imageUrl}`;
        if (existsSync(oldPath)) {
          unlink(oldPath, (err) => {
            if (err) console.error('Eski rasm o‘chmadi:', err);
          });
        }
      }
  
      const imageUrl = file ? `/uploads/productImage/${file.filename}` : productImage.imageUrl;
      const updatedImage = await this.productImageService.update(id, { ...dto, imageUrl });
  
      return { message: 'Product image updated', updatedImage };
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Customer)
    @Delete(':id')
    async delete(@Param('id') id: number) {
      await this.productImageService.delete(id);
      return { message: 'Product image deleted' };
    }
  }
  
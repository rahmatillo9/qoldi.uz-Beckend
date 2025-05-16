import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query } from "@nestjs/common";
import { FavoritesService } from "./favorites.service";
import { FaoriteDto } from "src/validators/favorite.validate";
import { JwtAuthGuard } from "src/authguard/jwt-auth.guard";
import { RolesGuard } from "src/validators/RolesGuard/Roluse.guard";


  @UseGuards(JwtAuthGuard, RolesGuard)

@Controller("favorites")
export class FavoritesController {
  constructor(private readonly favoriteService: FavoritesService) {}

  
  @Post()
  create(@Body() dto: FaoriteDto) {
    return this.favoriteService.create(dto);
  }

  @Get()
  findAll() {
    return this.favoriteService.findAll();
  }

  @Post('toggle')
async toggle(@Body() dto: FaoriteDto) {
  return this.favoriteService.toggleFavorite(dto);
}


@Get('check')
async checkFavorite(
  @Query('userId') userId: number,
  @Query('productId') productId: number,
) {
  return this.favoriteService.checkFavorite(userId, productId);
}


  // @Roles(Role.Admin, Role.Customer)
  @Get("user/:userId")
  async getFavoritesByUserId(@Param("userId") userId: string) {
    return this.favoriteService.findByUserId(+userId); // string -> number
  }


  // @Roles(Role.Admin, Role.Customer)
  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.favoriteService.findOne(id);
  }

  // @Roles(Role.Admin, Role.Customer)
  @Delete(":id")
  delete(@Param("id") id: number) {
    return this.favoriteService.delete(id);
  }
}
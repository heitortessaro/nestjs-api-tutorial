import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) { }

  @Get()
  getBookmarks(@GetUser('id') userId: number) { }

  @Get(':id')
  getBookmarkById(
    @GetUser('id') userId: number,
    // the id param is a string, so we use the pipe to parse to int
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) { }

  @Post()
  createBookmark(
    @GetUser('id') userId: number,
    @Body() dto: CreateBookmarkDto,
  ) { }

  @Patch()
  editBookmarkById(
    @GetUser('id') userId: number,
    @Body() dto: EditBookmarkDto,
  ) { }

  @Delete(':id')
  deleteBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) { }
}

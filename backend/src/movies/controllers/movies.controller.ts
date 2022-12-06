import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {CreateMovie} from "../models/create-movie.interface";
import {diskStorage} from "multer";
import {MoviesService} from "../services/movies.service";
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import {FileInterceptor} from "@nestjs/platform-express";
import {Observable, of} from "rxjs";
import {MoviesDto} from "../models/movies.dto";
import {join} from  'path';
import fs = require('fs');

export const storage = {
    storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`);
        }
    })
}

@Controller('movies')
export class MoviesController {

    movie: CreateMovie = {};

    constructor(private moviesService: MoviesService) {}

    @Post('/add')
    @UseInterceptors(FileInterceptor('file', storage))
    addMovie(@UploadedFile() file, @Req() req): Observable<Object> {
        console.log(file)

        this.movie = {
            filename: file.filename,
            name: req.body.name,
            category: req.body.category,
            description: req.body.description
        }

        this.moviesService.createMovie(this.movie);

        return of({ imagePath: file.filename});
    }

    @Get('/all')
    getAllMovies() {
        return this.moviesService.allMovies();
    }

    @Get('/movie/:id')
    async findMovie(@Param('id') id) {
        this.movie = await this.moviesService.getMovie(id);
        return this.movie;
    }

    @Get('/photo/:filename')
    findImage(@Param('filename') filename, @Res() res): Observable<Object> {
        return of(
            res.sendFile(join(process.cwd(), 'uploads/images/' + filename)),
        );
    }

    @Delete('image/delete/:imagename')
    deleteImage(@Param('imagename') imagename): string {
        try {
            fs.unlinkSync(join(process.cwd(), 'uploads/images/' + imagename));
            this.moviesService.deleteFile(imagename);
        } catch (err) {
            console.error(err);
        }

        return `removed: ${imagename}`;
    }

    @Get('/all-data')
    getAllImageNames() {
        return this.moviesService.allFiles();
    }


}

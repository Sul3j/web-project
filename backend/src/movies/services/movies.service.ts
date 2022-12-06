import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {MoviesEntity} from "../models/movies.entity";
import {DeleteResult, Repository} from "typeorm";
import {MoviesDto} from "../models/movies.dto";

@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(MoviesEntity)
        private readonly moviesRepository: Repository<MoviesEntity>
    ) {}

    public async createMovie(dto: MoviesDto): Promise<boolean> {
        await this.moviesRepository
            .createQueryBuilder()
            .insert()
            .into(MoviesEntity)
            .values([{
                filename: dto.filename,
                name: dto.name,
                category: dto.category,
                description: dto.description,
            }])
            .execute();

        return true;
    }

    public async allMovies(): Promise<MoviesEntity[]> {
        return await this.moviesRepository
            .createQueryBuilder()
            .getMany();
    }

    public async deleteMovie(filename: string): Promise<DeleteResult> {
        try {
            const exists: boolean = await this.movieExist(filename);
            if(exists) {
                return await this.moviesRepository
                    .createQueryBuilder()
                    .delete()
                    .where("filename = :filename", { filename })
                    .execute();
            } else {
                throw new NotFoundException('This movie no exists');
            }
        } catch (err) {
            throw new NotFoundException('This movie not exists');
        }
    }

    public async getMovie(id: string): Promise<MoviesEntity> {

        console.log(id)

        const movie = await this.moviesRepository.createQueryBuilder().where("id = :id", { id: id }).getOne();

        return movie;
    }

    private async movieExist(filename: string): Promise<boolean> {
        // @ts-ignore
        const file = await this.moviesRepository.findOne({ filename });

        if (file) {
           return true;
        }

        return false;
    }

    public async allFiles(): Promise<MoviesEntity[]> {
        return await this.moviesRepository
            .createQueryBuilder()
            .getMany();
    }

    public async deleteFile(filename: string): Promise<DeleteResult> {
        try {
            return await this.moviesRepository
                    .createQueryBuilder()
                    .delete()
                    .where("filename = :filename", { filename })
                    .execute();
        } catch (err) {
            throw new NotFoundException('This file not exists');
        }
    }
}

import { Controller } from '@nestjs/common';
import { Body, Delete, Get, Headers, Post, Put, Query, Request, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { cwd } from 'process';
import { GearModel } from 'src/model/gear.model';
import { GearService } from './gear.service';
import { saveImageToStorage, isFileValid, deleteFile } from './image-filter';

@Controller('gear')
export class GearController {

    constructor(private gearService: GearService) { }

    @Get('')
    async getGears(@Query('page') page: string, @Query('perpage') perPage: string, @Query('id') id: string) {
        if (page || perPage) {
            return await this.gearService.getAllGears(parseInt(page), parseInt(perPage));
        } else {
            if (id) {
                return await this.gearService.getGearById(parseInt(id));
            } else {
                return await this.gearService.getAllGears(1, 20);
            }
        }
    }

    @Post('')
    async addGear(@Body() gear: any) {
        let convertGear: GearModel = {
            id: 0,
            name: '',
            description: '',
            price: 0,
            image: '',
            category: '',
            quantity: 0
        };

        Object.keys(convertGear).forEach(key => {
            convertGear[key] = gear[key];
        });

        return await this.gearService.addGear(convertGear);
    }


    @Put('')
    async updateGear(@Body() gear: any) {
        let convertGear: GearModel;

        Object.keys(convertGear).forEach(key => {
            convertGear[key] = gear[key];
        });

        return await this.gearService.updateGear(convertGear);
    }

    @Delete('')
    async deleteGear(@Query('id') id: string) {
        return await this.gearService.removeGear(parseInt(id));
    }


    @Put('upload')
    @UseInterceptors(FileInterceptor('image', saveImageToStorage))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Headers() header) {
        if (!file) {
            return { error: 'File must be png, jpg, jpeg or wepb' };
        }

        const pathToImageFolder = join(cwd(), 'src', 'public', 'images');
        const pathToImage = join(pathToImageFolder, file.filename);

        let fileValid = await isFileValid(pathToImage);

        if (fileValid) {
            if (header['old']) {
                try {
                    deleteFile(join(pathToImageFolder, header['old']));
                }
                catch (error) {
                    console.log(error);
                }
            }
            return { message: 'File uploaded successfully', name: file.filename }
        }

        deleteFile(pathToImage);
        return { error: "File extension doesn't match the file content" }
    }
}

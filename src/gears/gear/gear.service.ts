import { Injectable } from '@nestjs/common';
import { GearModel } from 'src/model/gear.model';
import fs from 'fs';


@Injectable()
export class GearService {
    fakeBD: GearModel[] | undefined;
    jsonPath = 'src/gears/gear/FakeDB.json';
    constructor() {
        this.init();
    }

    async init() {
        await fs.readFile(this.jsonPath, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                this.fakeBD = JSON.parse(data.toString());
            }
        })
    }

    async addGearToJson(gear: GearModel) {
        fs.readFile(this.jsonPath, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                let json = JSON.parse(data.toString());
                json.push(gear);

                fs.writeFile(this.jsonPath, JSON.stringify(json), (err) => {
                    console.log("writeFile function called");
                    if (err) {
                        console.log(err);
                    }
                });
            }
        })

        return `Gear ${JSON.stringify(gear)} added from json file successfully.`
    }

    async removeGearToJson(id: number): Promise<string> {
        let gear = this.fakeBD.find(gear => gear.id === id);
        fs.readFile(this.jsonPath, (err, data) => {
            if (err) {
                return `Error: Cannot read json file. ${err}`
            } else {
                let json = JSON.parse(data.toString());
                json = json.filter((item: GearModel) => item.id !== id);

                fs.writeFile(this.jsonPath, JSON.stringify(json), (err) => {
                    if (err) {
                        return `Error: Cannot remove gear to json file. ${err}`
                    }
                });
            }
        })
        return `Gear ${JSON.stringify(gear)} removed from json file successfully.`
    }

    async updateGearToJson(gear: GearModel): Promise<string> {
        fs.readFile(this.jsonPath, (err, data) => {
            if (err) {
                return `Error: Cannot read json file. ${err}`
            } else {
                let json = JSON.parse(data.toString());
                json = json.filter((item: GearModel) => item.id !== gear.id);

                fs.writeFile(this.jsonPath, JSON.stringify(json), (err) => {
                    if (err) {
                        return `Error: Cannot update gear to json file. ${err}`
                    }
                });
            }
        })
        return `Gear ${JSON.stringify(gear)} updated from json file successfully.`
    }

    async testUploadImage() {
        return 'test';
    }

    async getAllGears(page: number = 1, perPage: number = 10): Promise<GearModel[]> {
        let start = (page - 1) * perPage;
        let end = page * perPage;
        return this.fakeBD.slice(start, end);
    }

    async getGearById(id: number) {
        let gear = this.fakeBD.find(gear => gear.id === id);

        if (!gear) {
            return `Error: Cannot find gear with id ${id}`;
        }

        return gear;
    }

    async getGearByCategory(category: string[]) {
        return this.fakeBD.filter(gear => category.includes(gear.category));
    }

    async addGear(gear: GearModel): Promise<string> {
        this.fakeBD.push(gear);
        console.log("addGear function called");
        let message = await this.addGearToJson(gear);
        return message;
    }

    async removeGear(id: number): Promise<string> {
        let item = this.fakeBD.find(item => item.id === id);

        if (!item) {
            return `Error: Cannot find gear with id ${id} to remove`;
        }

        this.fakeBD = this.fakeBD.filter(item => item.id !== id);
        let message = await this.removeGearToJson(id);
        return message;
    }

    async updateGear(gear: GearModel): Promise<string> {
        let item = this.fakeBD.find(item => item.id === gear.id);

        if (!item) {
            return `Error: Cannot find gear with id ${gear.id} to update`;
        }

        this.fakeBD = this.fakeBD.filter(item => item.id !== gear.id);
        let message = await this.updateGearToJson(gear);
        return message;
    }
}

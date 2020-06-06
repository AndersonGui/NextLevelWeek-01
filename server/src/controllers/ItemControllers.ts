import knex from '../database/connection';
import { Request, Response } from 'express';

class ItemController {
    async index(request: Request, response: Response) {
        try {
            const items = await knex('item').select('*');

            const serializedItems = items.map(item => {
                return {
                    id: item.id,
                    title: item.title,
                    image_url: `http://192.168.0.105:4200/uploads/${item.image}`
                }
            });

            return response.json(serializedItems);
        } catch (error) {
            return response.json(error);
        }
    };
}

export default ItemController;
import knex from '../database/connection';
import { Request, Response } from 'express';

class PointController {
    async index(request: Request, response: Response) {
        try {
            const { city, uf, items } = request.query;

            const parsedItems = items ? String(items).split(',').map(item => Number(item.trim())) : [];

            const points = await knex('point')
                .join('point_items', 'point.id', '=', 'point_items.point_id')
                .whereIn('point_items.item_id', parsedItems).
                where('city', String(city)).
                where('uf', String(uf))
                .distinct()
                .select('point.*');

            const serializedPoints = points.map(point => {
                return {
                    ...point,
                    image_url: `http://192.168.0.105:4200/uploads/${point.image}`
                }
            });

            return response.json(serializedPoints);
        } catch (error) {
            console.log(error);
            return response.json({ error });
        }
    };

    async show(request: Request, response: Response) {
        try {
            const { id } = request.params;

            const point = await knex('point').where('id', id).first();

            if (!point) {
                return response.status(400).json({ message: 'Point not found.' });
            }

            const items = await knex('item').join('point_items', 'item.id', '=', 'point_items.item_id')
                .where('point_items.point_id', id)
                .select('item.title');

            const serializedPoint = {
                ...point,
                image_url: `http://192.168.0.105:4200/uploads/${point.image}`
            };

            return response.json({ serializedPoint, items });
        } catch (error) {
            console.log(error);
            return response.json({ error });
        }
    };

    async create(request: Request, response: Response) {
        try {
            const { name, email, whatsapp, latitude, longitude, city, uf, items } = request.body;

            const trx = await knex.transaction();

            console.log(request.file);

            const point = { image: request.file.filename, name, email, whatsapp, latitude, longitude, city, uf };

            const insertedIds = await trx('point').insert(point);

            const point_id = insertedIds[0];

            const pointItems = items.split(',').map((item: string) => Number(item.trim())).map((item_id: number) => {
                return {
                    item_id,
                    point_id
                }
            });

            await trx('point_items').insert(pointItems);

            await trx.commit();

            return response.json({ id: point_id, ...point });
        } catch (error) {
            console.log(error);
            return response.json({ error });
        }
    };
}

export default PointController;
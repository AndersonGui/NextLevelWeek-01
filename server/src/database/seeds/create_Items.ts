import Knex from 'knex'
export async function seed(knex: Knex) {
    await knex('item').insert([
        { title: 'Lâmpadas', image: 'lampadas.svg' },
        { title: 'Pilhas e Baterias', image: 'baterias.svg' },
        { title: 'Papéis e Papelão', image: 'papis-papelao.svg' },
        { title: 'Residuos Eletrônicos', image: 'eletronicos.svg' },
        { title: 'Residuos Orgânicos', image: 'organicos.svg' },
        { title: 'Óleo de Cozinha', image: 'oleo.svg' }
    ]);
}
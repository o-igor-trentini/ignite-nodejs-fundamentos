import fs from 'node:fs/promises';

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
    #database = {};

    constructor() {
        fs.readFile(databasePath, 'utf8')
            .then((data) => {
                this.#database = JSON.parse(data);
            })
            .catch(() => {
                this.#persist();
            })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database));
    }

    #getIndex(table, id) {
        return this.#database[table].findIndex((row) => row.id === id);
    }

    select(table, search) {
        const data = this.#database[table] ?? [];

        if (!search) return data;

        console.clear()

        return data.filter((row) =>
            Object.entries(search).some(([key, value]) => row[key].toLowerCase().includes(value.toLowerCase()))
        );
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) this.#database[table].push(data)
        else this.#database[table] = [data];

        this.#persist();

        return data;
    }

    delete(table, id) {
        const rowIndex = this.#getIndex(table, id);

        if (rowIndex === -1) return;

        this.#database[table].splice(rowIndex, 1);
        this.#persist();
    }

    update(table, id, data) {
        const rowIndex = this.#getIndex(table, id);

        if (rowIndex === -1) return;

        this.#database[table][rowIndex] = {id, ...data}
        this.#persist();
    }
}

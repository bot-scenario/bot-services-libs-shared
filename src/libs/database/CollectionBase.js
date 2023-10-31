export class CollectionBase {
  /** @type {import('mongodb').Collection} */
  #collection
  /** @type {object} */
  #collectionName

  /** @type {import('mongodb').Db} */
  #database

  /**
   *  @param {import('mongodb').Db} database
   *  @param {string} collectionName
   *
   */
  constructor(database, collectionName) {
    this.#database = database
    this.#collectionName = collectionName
    this.#collection = this.#database.collection(this.#collectionName)
  }

  get collection() {
    return this.#collection
  }
}

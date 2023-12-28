import { Entity, Schema } from 'redis-om'
import Graph from 'graph-data-structure'

class Platform extends Entity {
  #graphReady
  #graphReadyStringify

  #nodesReady
  #nodesReadyStringify

  #tenantConfigurationsReady
  #tenantConfigurationsReadyStringify

  #userActivationCodesReady
  #userActivationCodesReadyStringify

  get graph() {
    if (this.#graphReadyStringify !== this.graphStringify) {
      this.#graphReady = Graph(JSON.parse(this.graphStringify))
      this.#graphReadyStringify = this.graphStringify
    }

    return this.#graphReady
  }

  get nodes() {
    if (this.#nodesReadyStringify !== this.nodesStringify) {
      this.#nodesReady = JSON.parse(this.nodesStringify)
      this.#nodesReadyStringify = this.nodesStringify
    }

    return this.#nodesReady
  }

  get tenantConfigurations() {
    if (
      this.#tenantConfigurationsReadyStringify !==
      this.tenantConfigurationsStringify
    ) {
      this.#tenantConfigurationsReady = JSON.parse(
        this.tenantConfigurationsStringify,
      )
      this.#tenantConfigurationsReadyStringify =
        this.tenantConfigurationsStringify
    }

    return this.#tenantConfigurationsReady
  }

  get userActivationCodes() {
    if (
      this.#userActivationCodesReadyStringify !==
      this.userActivationCodesStringify
    ) {
      this.#userActivationCodesReady = JSON.parse(
        this.userActivationCodesStringify,
      )
      this.#userActivationCodesReadyStringify =
        this.userActivationCodesStringify
    }

    return this.#userActivationCodesReady
  }
}

const PlatformProperties = {
  id: { type: 'string' },
  token: { type: 'string' },
  email: { type: 'string' },
  webhookToken: { type: 'string' },
  name: { type: 'string' },
  phoneNumberId: { type: 'string' },
  application: { type: 'string' },
  graphStringify: { type: 'string' /* JSON string  */ },
  nodesStringify: { type: 'string' /* JSON string  */ },
  tenantConfigurationsStringify: { type: 'string' /* JSON string  */ },
  userActivationCodesStringify: { type: 'string' /* JSON string  */ },
}

export const PlatformSchema = new Schema(Platform, PlatformProperties, {
  dataStructure: 'JSON',
})

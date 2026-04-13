import { Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ElasticsearchService {
  private client: Client;

  constructor() {
    this.client = new Client({
      node: "https://my-elasticsearch-project-f1ecdc.es.us-central1.gcp.elastic.cloud:443",
      auth: {
        apiKey: "MHJOdGlKMEJNRHdVeml0RmxaZDU6SVlkNFFvS0RJeUZJcENvbmFVdzRHZw==",
      },
    });
  }

  getClient() {
    return this.client;
  }
}
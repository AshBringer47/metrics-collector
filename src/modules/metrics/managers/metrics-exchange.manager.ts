// import {Injectable} from "@nestjs/common";
// import {MetricsCollectionRepository} from "~src/modules/metrics/repositories/metrics-collection.repository";
// import {ApplicationLogger} from "~common/logger/logger.service";
//
// @Injectable()
// export class MetricsExchangeManager {
//     private pullTask: CronJob;
//     private pushTask: CronJob;
//     private microserviceGroups: MicroserviceGroupsDetails = {};
//
//     constructor(
//         private readonly metricsCollectionRepository: MetricsCollectionRepository,
//         private readonly logger: ApplicationLogger,
//     ) {
//         console.log('MetricsExchangeManager created');
//     }
//
//     getMetrics() {
//         console.log(
//             this.pullTask,
//             this.pushTask,
//             this.microserviceGroups,
//             this.logger,
//             this.metricsCollectionRepository,
//         );
//         this.pushMetrics();
//     }
//
//     pushMetrics() {
//         console.log('MetricsExchangeManager created');
//         if (1 !== 1) this.getMetrics();
//     }
// }

import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import _CONFIG from "~src/config";
import {MetricsCollectionRepository} from "~src/modules/metrics/repositories/metrics-collection.repository";
import {ApplicationLogger} from "~common/logger/logger.service";

@Injectable()
export class MetricsExchangeManager {
    private refreshMetrics: CronJob;
    private microserviceGroups: MicroservicesDetails = {
        data_processor: {
            type: 'async',
            microservices: [],
            toAdd: [],
            toDelete: [],
        },
        notifier: {
            type: 'sync',
            microservices: [],
            toAdd: [],
            toDelete: [],
        },
    };

    constructor(
        private readonly metricsCollectionRepository: MetricsCollectionRepository,
        private readonly logger: ApplicationLogger,
        private readonly httpService: HttpService,
    ) {
        console.log('MetricsExchangeManager created');
        this.refreshMetrics = new CronJob('*/5 * * * * *', async () => {
            await this.getMetrics();
            await this.pushMetrics();
        });
        this.refreshMetrics.start();
    }

    async getMetrics() {
        try {
            const consulUrl = `${_CONFIG.services.consul}/v1/catalog/services`;
            const response = await firstValueFrom(this.httpService.get(consulUrl));
            const services = response.data;

            const newMicroservicesDetails: MicroservicesDetails = {
                data_processor: { type: 'async', microservices: [], toAdd: [], toDelete: [] },
                notifier: { type: 'sync', microservices: [], toAdd: [], toDelete: [] },
            };

            // Fetch details of each service from Consul
            await Promise.all(
                Object.keys(services).map(async (service) => {
                    const serviceDetailsUrl = `${_CONFIG.services.consul}/v1/catalog/service/${service}`;
                    const serviceDetailsResponse = await firstValueFrom(
                        this.httpService.get(serviceDetailsUrl),
                    );
                    const serviceInstances = serviceDetailsResponse.data;

                    // Iterate over instances of each service
                    await Promise.all(
                        serviceInstances.map(async (instance: any) => {
                            const host = instance.ServiceAddress || instance.Address;
                            const port = instance.ServicePort;
                            const url = `http://${host}:${port}/common/metrics`;

                            try {
                                const metricsResponse = await firstValueFrom(
                                    this.httpService.get(url),
                                );
                                const microservice: MicroserviceInfo = {
                                    name: service,
                                    url,
                                    metrics: metricsResponse.data,
                                };

                                if (instance.ServiceTags.includes('data_processor')) {
                                    newMicroservicesDetails.data_processor.microservices.push(
                                        microservice,
                                    );
                                } else if (instance.ServiceTags.includes('notifier')) {
                                    newMicroservicesDetails.notifier.microservices.push(
                                        microservice,
                                    );
                                }
                            } catch (error) {
                                this.logger.error(
                                    `Failed to fetch metrics for microservice ${service} at ${url}`,
                                    error,
                                );
                            }
                        }),
                    );
                }),
            );

            this.microserviceGroups = newMicroservicesDetails;
            this.logger.log('Metrics successfully updated');
        } catch (error) {
            this.logger.error('Error fetching metrics from Consul', error);
        }
    }

    async pushMetrics() {
        try {
            const loadBalancerUrl = `${_CONFIG.services.loadBalancer}/common/metrics`;
            await firstValueFrom(
                this.httpService.post(loadBalancerUrl, this.microserviceGroups),
            );
            this.logger.log('Metrics successfully pushed to load balancer');
        } catch (error) {
            this.logger.error('Error pushing metrics to load balancer', error);
        }
    }
}

// Interfaces for MicroservicesDetails
interface MicroservicesDetails {
    [key: string]: MicroserviceGroup;
}

interface MicroserviceGroup {
    type: 'async' | 'sync';
    microservices: MicroserviceInfo[];
    toAdd: string[];
    toDelete: string[];
}

export type MicroserviceInfo = {
    name: string;
    url: string;
    metrics: Metrics;
};

export type Metrics = Record<string, any>; // Define the structure of metrics as required

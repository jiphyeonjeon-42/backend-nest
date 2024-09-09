import { DataSource } from 'typeorm';
import { VHistories } from 'src/entities';

export const historiesProviders = [
  {
    provide: 'VHISTORIES_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(VHistories),
    inject: [DataSource],
  },
];

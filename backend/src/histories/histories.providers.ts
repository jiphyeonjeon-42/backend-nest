import { DataSource } from 'typeorm';
import { VHistories } from 'src/database/legacy_view/VHistories';

export const historiesProviders = [
  {
    provide: 'VHISTORIES_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(VHistories),
    inject: [DataSource],
  },
];

import dataSource from '@shared/config/dataSource';
import { DataSource } from 'typeorm';

export const initializeDataSource = async (): Promise<DataSource> => {
  if (dataSource && typeof dataSource === 'object') {
    if (!(dataSource as DataSource).isInitialized) {
      await (dataSource as DataSource).initialize();
    }
    return dataSource as DataSource;
  }
  throw new Error('DataSource is not properly configured');
};

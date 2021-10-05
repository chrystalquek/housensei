import { FindConditions, getRepository, Raw } from 'typeorm';
import Resale from '../models/resale';
import { Town } from '../utils/model';

export type QueryResale = {
  years?: number[] | number;
  town?: Town;
};

const getResales = async (queries: QueryResale): Promise<Array<Resale>> => {
  const conditions: FindConditions<Resale> = {};
  if (queries.years) {
    // check that each ResaleFlat's transactionDate's year is one of years specified
    const years =
      typeof queries.years === 'string' || typeof queries.years === 'number'
        ? [Number(queries.years)]
        : queries.years.map((year) => Number(year));

    conditions.transactionDate = Raw(
      (transactionDate) =>
        `date_part('year', ${transactionDate}) IN (:...years)`,
      {
        years,
      }
    );
  }

  if (queries.town) {
    conditions.town = queries.town;
  }

  return getRepository(Resale).find({
    where: conditions,
    cache: true,
  });
};

export default {
  getResales,
};
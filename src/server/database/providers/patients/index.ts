import * as create from './Create'
import * as getAll from './GetAll'
import * as count from './Count'
import * as updateById from './UpdateById'
import * as deleteByID from './DeleteById'
import * as getById from './GetById'

export const PatientsProvider = {
    ...create,
    ...getAll,
    ...count,
    ...updateById,
    ...deleteByID,
    ...getById,
};

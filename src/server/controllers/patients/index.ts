import * as create from './Create';
import * as getAll from './GetAll';
import * as deleteById from './DeleteById';
import * as getProfileImage from './GetProfileImage';
// import * as getById from './GetById';
import * as UpdateById from './UpdateById';

export const patientsController = {
    ...create,
    ...getAll,
    ...deleteById,
    ...getProfileImage,
    // ...getById,
    ...UpdateById,
}

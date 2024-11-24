import * as create from './Create';
// import * as getAll from './GetAll';
// import * as deleteById from './DeleteById';
// import * as getById from './GetById';
// import * as UpdateById from './UpdateById';
import * as signIn from './SignIn';

export const usersController = {
    ...create,
    // ...getAll,
    // ...deleteById,
    // ...getById,
    // ...UpdateById,
    ...signIn
}

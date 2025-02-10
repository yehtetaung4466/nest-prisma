import { DOMAIN } from "../shared/enums/domain"
import I_DB_CONFIG from "../shared/interfaces/dbconfig"

export default [
    {
        domain:DOMAIN.MIT,
        dbName:'connect_db',
    },
    {
        domain: DOMAIN.ONE,
        dbName: 'one_db',
    },
    {
        domain: DOMAIN.TWO,
        dbName: 'two_db',
    }
] satisfies I_DB_CONFIG[]
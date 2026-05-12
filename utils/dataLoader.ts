import Ajv from 'ajv';

import getChargersAPIschema from '../schemas/01_get_Chargers_schema.json' with {type: 'json'}; 
import getAssetManagerChargersAPIschema from '../schemas/02_get_AssetManagerChargers_schema.json' with {type: 'json'}
import getLogManagerAPIschema from '../schemas/03_get_Logmanager_schema.json' with {type: 'json'}
import chargerConfigAPIschema from '../schemas/04_put_delete_chargerConfig_schema.json' with {type: 'json'}


/***************************************************************** 
                * API Schema loader
                * return compiled Schema using ajv
****************************************************************/

        const ajv =  new Ajv ();

        export const compiled_getChargersAPIschema =  ajv.compile(getChargersAPIschema);  // returns compiled validation function

        export const compiled_getAssetManagerChargersAPIschema = ajv.compile(getAssetManagerChargersAPIschema); 

        export const compiled_getLogmanagerApiSchema = ajv.compile(getLogManagerAPIschema);

        export const compiled_putdeleteChargerConfigApiSchema = ajv.compile(chargerConfigAPIschema);
        


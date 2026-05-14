 
/* Login Page */

    export const LOGIN_TITLE = 'Depot360 AI';

    export const LOGIN_LANG_LIST = ['Deutsch', 'English', 'Español', 'Français', 'Norsk'];

    export const LOGIN_ERROR_MESSAGE = 'Invalid username or password. Please try again.';

/* Reset Password Page */

    export const RESETPASSWORD_LABELS = {
        h1header: 'Depot360 AI',
        h2header: 'Reset Password',
        h6header: 'Enter the email address to receive a password reset code.'      
    }

/* OCPP Logs Page */

    export const OCPPLOGS_MESSAGETYPES = [
        'Select / Deselect all', 'Authorize', 'BootNotification', 'CancelReservation', 'ChangeAvailability', 
        'ChangeConfiguration', 'ClearCache', 'ClearChargingProfile', 'DataTransfer', 'DiagnosticsStatusNotification', 
        'FirmwareStatusNotification', 'GetCompositeSchedule', 'GetConfiguration', 'GetDiagnostics', 'GetLocalListVersion', 
        'Heartbeat', 'MeterValues', 'RemoteStartTransaction', 'RemoteStopTransaction', 'ReserveNow', 'Reset', 'SendLocalList', 
        'SetChargingProfile', 'StartTransaction', 'StatusNotification', 'StopTransaction', 'TriggerMessage', 'UnlockConnector', 
        'UpdateFirmware'] as const;

    
    export const OCPPLOGS_STATUSTYPE = ['Select / Deselect all', 'Accepted', 'Rejected', 'Blocked', 'Concurrenttx', 'Expired', 'Failed', 
            'Faulted', 'Invalid', 'Locked', 'Notimplemented', 'Notsupported', 'Occupied', 'Pending', 'Rebootrequired', 'Scheduled',
             'Unavailable', 'Unknown', 'Unknownmessageid', 'Unknownvendorid', 'Unlocked', 
             'Unlockfailed', 'Versionmismatch'] as const;
             
   
    export const OCPPLOGS_WEBTABLE_HEADERS = [
        'Message direction', 'Date & time\nyyyy-mm-dd', 'Charger\nCharger ID', 'Connector ID', 'Depot', 
        'Message type', 'Status', 'Key attributes'] as const;          
    

     export const OCPPLOGS_TIMEZONES = [
        'Africa/Abidjan GMT', 'Africa/Accra GMT', 'Africa/Addis_Ababa GMT+03:00', 'Africa/Algiers GMT+01:00', 'Africa/Asmera GMT+03:00', 
        'Africa/Bamako GMT', 'Africa/Bangui GMT+01:00', 'Africa/Banjul GMT', 'Africa/Bissau GMT', 'Africa/Blantyre GMT+02:00', 
        'Africa/Brazzaville GMT+01:00', 'Africa/Bujumbura GMT+02:00', 'Africa/Cairo GMT+03:00', 'Africa/Casablanca GMT+01:00', 
        'Africa/Ceuta GMT+02:00', 'Africa/Conakry GMT', 'Africa/Conakry GMT', 'Africa/Dakar GMT', 'Africa/Dar_es_Salaam GMT+03:00', 
        'Africa/Djibouti GMT+03:00', 'Africa/Douala GMT+01:00', 'Africa/El_Aaiun GMT+01:00', 'Africa/Freetown GMT', 
        'Africa/Gaborone GMT+02:00', 'Africa/Harare GMT+02:00', 'Africa/Johannesburg GMT+02:00', 'Africa/Juba GMT+02:00', 'Africa/Kampala GMT+03:00', 
        'Africa/Khartoum GMT+02:00', 'Africa/Kigali GMT+02:00', 'Africa/Kinshasa GMT+01:00', 'Africa/Lagos GMT+01:00', 'Africa/Libreville GMT+01:00', 
        'Africa/Lome GMT', 'Africa/Luanda GMT+01:00', 'Africa/Lubumbashi GMT+02:00', 'Africa/Lusaka GMT+02:00', 'Africa/Malabo GMT+01:00', 
        'Africa/Maputo GMT+02:00', 'Africa/Maseru GMT+02:00', 'Africa/Mbabane GMT+02:00', 'Africa/Mogadishu GMT+03:00', 'Africa/Monrovia GMT', 
        'Africa/Nairobi GMT+03:00', 'Africa/Ndjamena GMT+01:00', 'Africa/Niamey GMT+01:00', 'Africa/Nouakchott GMT', 'Africa/Ouagadougou GMT', 
        'Africa/Porto-Novo GMT+01:00']  as const;



// Optional: TypeScript Type extraction
        // This allows you to use these values as specific types in your functions
        // export type VehicleType = typeof VEHICLE_TYPES[number];

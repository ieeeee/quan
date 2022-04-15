/*
The $prefs is for persistent store: 
$prefs.valueForKey(key)
$prefs.setValueForKey(value, key)
$prefs.removeValueForKey(key)
$prefs.removeAllValues()
*/
const ariport_config_key = "ariport_amounts_config_key";

/*
ariport format:
[{'tag':'xx','url':'http://xxx'},{'tag':'xx','url':'http://xxx'}]
*/
const ariport = [];

$prefs.setValueForKey(ariport_config_key, JSON.stringify(ariport));
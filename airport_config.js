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
[{'tag':'xx','url':'http://xxx','style': 'text|percent|percentandnum'},{'tag':'xx','url':'http://xxx','style': 'text|percent|percentandnum'}]
style:
    text:机场tag➤  • ↑37.77 MB • ↓5.22 GB • 20GB
    percent:机场tag➤ ⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆ 100%
    percentandnum:机场tag➤ ⋆⋆⋆⋆⋆⋆⋆⋆ 50% [10GB]
⚠️注意：percent 风格显示方式受到机场tag字符串长度以及设备尺寸大小影响不建议使用，脚本调试仅针对iPhone12 pro适配
*/
const ariport = [];

$prefs.setValueForKey(JSON.stringify(ariport), ariport_config_key);
console.log(`ariport_amounts_config_key配置项已保存.`);

const ariportValue = $prefs.valueForKey(ariport_config_key) || "";
console.log(`ariport_amounts_config_key读取:[${ariportValue}]`);


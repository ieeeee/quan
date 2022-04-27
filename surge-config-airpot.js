/*
https://manual.nssurge.com/scripting/common.html
The $persistentStore is for persistent store: 
$persistentStore.write(data<String>, [key<String>])
$persistentStore.read([key<String>])
*/

/*
ariport format:
[{'tag':'xx','url':'http://xxx','style': 'text|percent|percentnum|percentandnum|percentauto'},{'tag':'xx','url':'http://xxx','style': 'text|percent|percentnum|percentandnum|percentauto'}]
style:
    text:机场tag➤  • ↑37.77 MB • ↓5.22 GB • 20GB
    percent:机场tag➤ ⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆ 100%
    percentnum:机场tag➤ ⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆ 30 GB
    percentandnum:机场tag➤ ⋆⋆⋆⋆⋆⋆⋆⋆ 50% [10 GB]
    percentauto:自动切换percent与percentandnum（用量<=50% 时使用percentandnum反之percent）
⚠️注意：percent 风格显示方式受到机场tag字符串长度以及设备尺寸大小影响不建议使用，脚本调试仅针对iPhone12 pro适配
*/
const ariport_config_key = "ariport_amounts_config_key";
const ariport = [];
$persistentStore.write(JSON.stringify(ariport), ariport_config_key);
console.log(`ariport_amounts_config_key配置项已保存.`);

const ariportValue = $persistentStore.read(ariport_config_key) || "";
console.log(`ariport_amounts_config_key读取:[${ariportValue}]`);

/*
open the door format:
$httpClient options headers
*/
const openthedoor_headers_config_key = "openthedoor_headers_config_key";
const openthedoor_headers = {};
$persistentStore.write(JSON.stringify(openthedoor_headers), openthedoor_headers_config_key);
console.log(`openthedoor_headers_config_key配置项已保存.`);

const openTheDoorHeadersValue = $persistentStore.read(openthedoor_headers_config_key) || "";
console.log(`openthedoor_headers_config_key读取:[${openTheDoorHeadersValue}]`);

$done();
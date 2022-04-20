/**
 * 构建出多个异步请求（每个异步请求都应该是一个Promise对象）
 */
 const promises = ['请求1', '请求2', '请求3', '请求4'].map((name) => {
	
	// 构建请求体
	let requestBody = new URLSearchParams();
	requestBody.set('name', name);
	
	console.log(`开始异步执行 ${name} `);
	
	// 执行异步请求，返回一个 Promise 对象
	return fetch('/action', {
		method: 'POST',
		body: requestBody
	});
});

/**
 * 使用 Promise.all() 来处理所有的异步请求。当所有的请求都执行完毕后，会调用 then 方法
 */
Promise.all(promises).then((results) => {
	console.log('所有请求都执行完毕了');
	for (let response of results){
		// 遍历所有请求的响应结果
		response.json().then(message => {
			console.log(message);
		});
	}
});
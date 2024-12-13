import fetch from 'node-fetch';

// 测试 GET /api/posts
const testGetPosts = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/posts');
    console.log('GET Status Code:', response.status);
    const data = await response.json();
    console.log('GET /api/posts Response:', data);
  } catch (error) {
    console.error('Error during GET /api/posts:', error.message);
  }
};

// 测试 POST /api/posts
const testPostPost = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Alice',
        content: 'Hello from test.js!',
      }),
    });
    console.log('POST Status Code:', response.status);
    const data = await response.json();
    console.log('POST /api/posts Response:', data);

    // 调用 GET 请求，验证数据是否已保存
    await testGetPosts();
  } catch (error) {
    console.error('Error during POST /api/posts:', error.message);
  }
};

// 开始测试
testPostPost();

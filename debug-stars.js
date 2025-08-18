// Debug script to check star rendering
const agents = [
  {
    "id": "cmda4zyno0006deb7lpr1su5k",
    "name": "Perplexity AI",
    "description": "AI搜索引擎，提供准确的信息检索和答案生成",
    "tags": "搜索,研究,信息获取",
    "manager": "钱七",
    "enabled": true,
    "clickCount": 0
  },
  {
    "id": "cmda4zyno0007deb7p0phqe99",
    "name": "Notion AI",
    "description": "集成在Notion中的AI助手，帮助写作、总结和头脑风暴",
    "tags": "写作,笔记,知识管理",
    "manager": "孙八",
    "enabled": true,
    "clickCount": 2
  },
  {
    "id": "cmda4zynn0004deb7fere53j1",
    "name": "Midjourney",
    "description": "AI图像生成工具，创建高质量的艺术作品和设计",
    "tags": "设计,图像生成,艺术",
    "manager": "王五",
    "enabled": true,
    "clickCount": 0
  },
  {
    "id": "cmda4zyno0005deb7c2ocvrq1",
    "name": "Cursor IDE",
    "description": "AI驱动的代码编辑器，提供智能补全和代码生成",
    "tags": "编程,IDE,代码补全",
    "manager": "赵六",
    "enabled": true,
    "clickCount": 0
  },
  {
    "id": "cmda4zynk0003deb7vm4yxkrs",
    "name": "ChatGPT Plus",
    "description": "通用AI助手，支持文本生成、问答、创作等多种任务",
    "tags": "通用,写作,问答",
    "manager": "李四",
    "enabled": true,
    "clickCount": 0
  },
  {
    "id": "cmda4zynj0002deb79ttn73fq",
    "name": "Claude Code",
    "description": "用于代码生成、调试、数据处理任务，支持多轮交互",
    "tags": "编程,调试,Agent编排",
    "manager": "张三",
    "enabled": true,
    "clickCount": 0
  }
];

console.log('Total agents:', agents.length);

// Test the hash generation and position calculation like in the component
function generateStarPositions(agents) {
  return agents.map((agent, index) => {
    // 使用agent ID的hash来确定位置，保证位置固定
    const hash = agent.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    const angle1 = (hash % 360) * Math.PI / 180
    const angle2 = ((hash * 7) % 180 - 90) * Math.PI / 180
    const distance = 300 + (hash % 400)
    
    const star = {
      agent,
      x: Math.cos(angle1) * Math.cos(angle2) * distance,
      y: Math.sin(angle2) * distance,
      z: Math.sin(angle1) * Math.cos(angle2) * distance,
      hash: hash,
      angle1: angle1,
      angle2: angle2,
      distance: distance
    }
    
    console.log(`Agent ${index + 1}: ${agent.name}`);
    console.log(`  ID: ${agent.id}`);
    console.log(`  Hash: ${hash}`);
    console.log(`  Position: x=${star.x.toFixed(2)}, y=${star.y.toFixed(2)}, z=${star.z.toFixed(2)}`);
    console.log(`  Distance: ${distance}`);
    console.log('---');
    
    return star;
  });
}

const starPositions = generateStarPositions(agents);

console.log('Star positions generated:', starPositions.length);

// Test 3D projection
function project3D(star, rotateX = -20, rotateY = 0, zoom = 1) {
  const radX = rotateX * Math.PI / 180
  const radY = rotateY * Math.PI / 180
  
  // 3D旋转
  let x = star.x
  let y = star.y * Math.cos(radX) - star.z * Math.sin(radX)
  let z = star.y * Math.sin(radX) + star.z * Math.cos(radX)
  
  const nx = x * Math.cos(radY) + z * Math.sin(radY)
  const nz = -x * Math.sin(radY) + z * Math.cos(radY)
  
  // 透视投影
  const distance = 800
  const scale = distance / (distance + nz) * zoom
  
  return {
    x: nx * scale + 800, // assuming window width 1600
    y: y * scale + 600,  // assuming window height 1200
    scale: Math.max(0.1, scale),
    z: nz
  }
}

console.log('\nProjected positions:');
starPositions.forEach((star, index) => {
  const projected = project3D(star);
  console.log(`${star.agent.name}: screen(${projected.x.toFixed(2)}, ${projected.y.toFixed(2)}) scale=${projected.scale.toFixed(3)} z=${projected.z.toFixed(2)}`);
});
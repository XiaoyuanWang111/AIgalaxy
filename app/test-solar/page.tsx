'use client'

import React from 'react'
import GalaxyStarSystem from '@/components/GalaxyStarSystem'

// 测试数据 - 模拟不同点击次数的AI工具
const testAgents = [
  {
    id: '1',
    name: 'Claude Code',
    description: 'Anthropic的官方CLI工具，提供先进的代码生成、调试和重构功能。具有卓越的上下文理解能力，能够精准理解复杂的项目结构。支持多种编程语言和框架，是开发者的得力助手。',
    tags: '编程,调试,AI助手,代码生成',
    manager: 'Anthropic',
    homepage: 'https://claude.ai/code',
    icon: '🤖',
    enabled: true,
    clickCount: 1250 // 超亮星
  },
  {
    id: '2',
    name: 'ChatGPT',
    description: 'OpenAI开发的革命性大型语言模型，具有卓越的自然语言理解和生成能力。能够进行深度对话、创意写作、问题解答、数据分析等多种任务。是目前全球最受欢迎的AI工具之一。',
    tags: '对话,文本生成,AI助手,问答',
    manager: 'OpenAI',
    homepage: 'https://chat.openai.com',
    icon: '💬',
    enabled: true,
    clickCount: 1100 // 超亮星
  },
  {
    id: '3',
    name: 'GitHub Copilot',
    description: '基于OpenAI Codex的智能代码助手，能够实时理解代码上下文和注释，提供精准的代码建议和自动完成。支持数十种编程语言，大幅提升开发效率。',
    tags: '编程,代码生成,开发工具,自动完成',
    manager: 'GitHub',
    homepage: 'https://github.com/features/copilot',
    icon: '🚁',
    enabled: true,
    clickCount: 780 // 一等星
  },
  {
    id: '4',
    name: 'Midjourney',
    description: '领先的AI图像生成平台，使用先进的扩散模型技术，能够根据文本描述创造令人惊叹的艺术作品。支持多种艺术风格，从写实到抽象，从古典到未来主义。',
    tags: '图像生成,艺术,设计,创意',
    manager: 'Midjourney Inc.',
    homepage: 'https://midjourney.com',
    icon: '🎨',
    enabled: true,
    clickCount: 650 // 一等星
  },
  {
    id: '5',
    name: 'Notion AI',
    description: '深度集成在Notion工作空间中的AI助手，提供全方位的内容创作支持。包括智能写作、文档总结、语言翻译、思维导图等功能，让知识管理和协作更加高效。',
    tags: '写作,总结,生产力,知识管理',
    manager: 'Notion',
    homepage: 'https://notion.so',
    icon: '📝',
    enabled: true,
    clickCount: 320 // 二等星
  },
  {
    id: '6',
    name: 'Figma AI',
    description: '集成在Figma设计平台中的AI设计助手，能够智能生成设计元素、自动创建原型、优化设计流程。支持从概念草图到高保真原型的全流程设计，是设计师的创意伙伴。',
    tags: '设计,原型,UI/UX,创意',
    manager: 'Figma',
    homepage: 'https://figma.com',
    icon: '🎯',
    enabled: true,
    clickCount: 180 // 三等星
  },
  {
    id: '7',
    name: 'Stable Diffusion',
    description: '开源的扩散模型图像生成工具，支持本地部署和自定义训练。拥有强大的社区生态和丰富的模型库，能够生成各种风格的高质量图像。',
    tags: '图像生成,开源,自定义',
    manager: 'Stability AI',
    homepage: 'https://stability.ai',
    icon: '🔥',
    enabled: true,
    clickCount: 95 // 四等星
  },
  {
    id: '8',
    name: 'Cursor',
    description: 'AI原生IDE，专为现代开发流程设计。集成先进的AI编程助手，支持自然语言编程、代码生成和智能重构。',
    tags: '编程,IDE,代码编辑器',
    manager: 'Anysphere',
    homepage: 'https://cursor.sh',
    icon: '⌨️',
    enabled: true,
    clickCount: 42 // 五等星
  },
  {
    id: '9',
    name: 'Perplexity',
    description: 'AI驱动的搜索引擎，提供实时、准确的信息检索和答案生成。能够理解复杂问题并提供有来源的答案。',
    tags: '搜索,问答,信息检索',
    manager: 'Perplexity AI',
    homepage: 'https://perplexity.ai',
    icon: '🔍',
    enabled: true,
    clickCount: 28 // 六等星
  },
  {
    id: '10',
    name: 'RunwayML',
    description: '专注于视频和多媒体内容创作的AI平台，提供视频编辑、特效生成、动画制作等工具。',
    tags: '视频,多媒体,特效',
    manager: 'Runway',
    homepage: 'https://runwayml.com',
    icon: '🎥',
    enabled: true,
    clickCount: 15 // 七等星(暗星)
  }
]

export default function TestSolarPage() {
  const handlePlanetHover = (agent: any) => {
    console.log('Hovered:', agent?.name)
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* 银河系 AI星图 - 按点击次数显示星等 */}
      <GalaxyStarSystem 
        agents={testAgents}
        onPlanetHover={handlePlanetHover}
      />

      {/* 测试信息 */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(255, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '12px',
        zIndex: 3000
      }}>
✨ 星系模式 - {testAgents.length} 颗AI星星
      </div>
    </div>
  )
}
export const career = [
  { version: "v1.0", title: "UI Designer", period: "2015" },
  { version: "v2.0", title: "Product Interface Designer", period: "2018-2020" },
  { version: "v3.0", title: "Design System Builder", period: "2021-2023" },
  { version: "v4.0", title: "UI Design Lead", period: "2024-Now" },
];

export const systemModules = [
  {
    id: "tokens",
    title: "Design Tokens",
    caption: "Color / Type / Space / State",
    description: "建立颜色、字体、间距、圆角、阴影、状态与布局变量，让低代码平台拥有统一的体验语言。",
    detail: "变量按业务层级、组件状态和研发映射关系组织，减少重复沟通，让设计和代码能用同一套命名规则描述界面。",
    tags: ["Color Tokens", "Typography", "Spacing", "State Map"],
  },
  {
    id: "components",
    title: "Component Library",
    caption: "Button / Table / Modal / Workflow",
    description: "沉淀覆盖后台、表单、流程、图表和低代码画布的组件库，支持状态、尺寸、权限和异常场景。",
    detail: "组件不是视觉资产堆叠，而是包含使用场景、边界规则、交互状态和研发验收标准的可复用产品语言。",
    tags: ["Default", "Hover", "Active", "Disabled", "Loading"],
  },
  {
    id: "editor",
    title: "Visual Editor",
    caption: "Material / Canvas / Inspector",
    description: "定义左侧物料、中间画布、右侧属性面板、顶部工具栏和图层结构的可视化编辑器体验。",
    detail: "重点处理拖拽吸附、属性同步、状态预览、页面发布和复杂组件配置，让低代码能力被普通业务用户理解。",
    tags: ["Drag", "Snap", "Preview", "Publish"],
  },
  {
    id: "admin",
    title: "Admin Console",
    caption: "Application / Role / Workflow",
    description: "梳理应用管理、用户角色、权限、数据源、流程、发布和日志等后台信息架构。",
    detail: "通过树状导航、表格批量操作、权限状态和异常反馈，把复杂管理任务拆成稳定可学习的操作路径。",
    tags: ["Permission", "Data Source", "Publish", "Log"],
  },
  {
    id: "governance",
    title: "Governance",
    caption: "Review / Handoff / QA / Archive",
    description: "建立设计规范维护、组件命名、文件结构、评审流程、研发对接和设计验收标准。",
    detail: "治理部分确保团队并行交付时仍能保持一致性，让设计系统从一次性产物变成持续演进的组织能力。",
    tags: ["Review", "Handoff", "Design QA", "Versioning"],
  },
];

export const tokenOptions = [
  { name: "blue.action.primary", value: "#4bb8ff" },
  { name: "cyan.signal.active", value: "#40f3ff" },
  { name: "gold.priority.focus", value: "#d8b76a" },
  { name: "silver.neutral.control", value: "#e5e8ee" },
];

export const componentStates = ["Default", "Hover", "Active", "Disabled", "Loading", "Focus"];

export const cases = [
  {
    id: "wanying",
    short: "WANYING",
    type: "Enterprise Low-Code Platform",
    title: "万应低代码平台设计系统",
    role: "Design System Lead / UI Design Lead",
    brief: "从 0 到 1 构建变量、组件、可视化编辑器、后台管理和设计治理流程，让多模块平台保持一致、可扩展的体验标准。",
    process: ["Research", "Token Map", "Component Library", "Editor Interaction", "Governance", "Metrics Review"],
    metrics: [
      { value: "40+", label: "核心组件沉淀" },
      { value: "6", label: "系统模块统一" },
      { value: "30%", label: "重复设计减少" },
    ],
  },
  {
    id: "admin",
    short: "ADMIN",
    type: "Enterprise Admin Console",
    title: "企业级权限与流程管理平台",
    role: "Lead UI Designer",
    brief: "重构复杂权限、组织架构、审批流程和数据表格体验，降低后台系统学习成本，提高业务处理效率。",
    process: ["Stakeholder Interview", "IA Tree", "Permission Matrix", "Table Pattern", "Empty/Error States", "QA"],
    metrics: [
      { value: "12", label: "权限场景覆盖" },
      { value: "28", label: "后台页面模板" },
      { value: "22%", label: "操作路径缩短" },
    ],
  },
  {
    id: "mobile",
    short: "MOBILE",
    type: "Mobile Product / Mini Program",
    title: "移动端服务小程序体验升级",
    role: "Product Interface Designer",
    brief: "围绕业务查询、任务处理、消息提醒和用户转化重构移动端路径，提升核心功能触达和操作效率。",
    process: ["User Journey", "Persona", "Task Flow", "Mobile UI", "Conversion Review", "Iteration"],
    metrics: [
      { value: "3", label: "核心人群画像" },
      { value: "18%", label: "关键入口点击提升" },
      { value: "2.4x", label: "任务路径更清晰" },
    ],
  },
  {
    id: "dashboard",
    short: "DATA",
    type: "Data Visualization Platform",
    title: "运营数据看板与指标分析系统",
    role: "Senior UI Designer",
    brief: "设计指标卡、趋势图、异常告警、筛选器和多角色数据视图，帮助业务快速发现问题并追踪结果。",
    process: ["Metric Audit", "Dashboard Layout", "Chart Rules", "Filter Logic", "Alert State", "Review"],
    metrics: [
      { value: "24", label: "指标组件规则" },
      { value: "5", label: "角色视图" },
      { value: "15%", label: "复查效率提升" },
    ],
  },
  {
    id: "brand",
    short: "BRAND",
    type: "Brand / Campaign / Exhibition",
    title: "品牌活动与平面视觉系统",
    role: "Visual Design Lead",
    brief: "负责品牌延展、活动主视觉、展会物料、营销 Banner 与产品宣传视觉，建立跨媒介的一致表现语言。",
    process: ["Brand Key Visual", "Poster System", "Exhibition Material", "Marketing Banner", "Print Proof", "Archive"],
    metrics: [
      { value: "5", label: "视觉媒介类型" },
      { value: "60+", label: "物料资产整理" },
      { value: "1", label: "统一视觉档案" },
    ],
  },
];

export const visualWorks = [
  {
    category: "Branding",
    mark: "B01",
    title: "企业品牌视觉延展",
    description: "品牌色、辅助图形、办公物料和线上传播模板。",
  },
  {
    category: "Poster",
    mark: "P02",
    title: "产品发布活动海报",
    description: "围绕产品价值主张设计系列主视觉和社媒传播图。",
  },
  {
    category: "Exhibition",
    mark: "E03",
    title: "展会空间与物料系统",
    description: "展板、易拉宝、背景墙、手册和现场引导视觉。",
  },
  {
    category: "Marketing",
    mark: "M04",
    title: "营销 Banner 与运营图",
    description: "适配官网、公众号、销售材料和渠道投放。",
  },
  {
    category: "Print",
    mark: "R05",
    title: "画册与宣传折页",
    description: "信息层级、版式节奏、纸张输出和印前校验。",
  },
  {
    category: "Product Visual",
    mark: "V06",
    title: "产品功能概念视觉",
    description: "为复杂功能制作更容易理解的视觉解释图。",
  },
  {
    category: "Branding",
    mark: "B07",
    title: "低代码平台图形语言",
    description: "以节点、画布、变量和流程为核心的品牌化图形资产。",
  },
  {
    category: "Poster",
    mark: "P08",
    title: "内部设计规范发布海报",
    description: "将设计系统规则转译成团队可传播的视觉语言。",
  },
];

export const leadershipFlow = [
  "需求输入",
  "业务理解",
  "信息架构",
  "原型评审",
  "UI 设计",
  "组件复用检查",
  "研发交付",
  "设计验收",
  "数据复查",
  "迭代优化",
];

export const governance = [
  {
    code: "QA-01",
    title: "视觉一致性检查",
    description: "统一字体、间距、色彩、圆角、阴影和状态表现，避免跨项目体验漂移。",
  },
  {
    code: "QA-02",
    title: "组件复用检查",
    description: "设计前先匹配已有组件和模板，减少重复设计和研发返工。",
  },
  {
    code: "QA-03",
    title: "异常状态检查",
    description: "覆盖空状态、加载、错误、无权限、禁用、批量操作和边界数据。",
  },
  {
    code: "QA-04",
    title: "研发还原验收",
    description: "按页面、组件、交互和响应式断点建立验收清单，保证上线质量。",
  },
];

export const signalRows = [
  { label: "Current Role", value: "UI Design Lead" },
  { label: "Core Focus", value: "Design Systems / Low-Code / Enterprise UX" },
  { label: "Availability", value: "Portfolio content ready to replace" },
];

export const contact = {
  email: "zen92@foxmail.com",
};

"use client";

import {
  ArrowRight,
  ArrowSquareOut,
  Buildings,
  CaretLeft,
  CaretRight,
  ChartLineUp,
  CheckCircle,
  Cpu,
  FilmSlate,
  HouseLine,
  Leaf,
  List,
  Play,
  Recycle,
  ShieldCheck,
  Sun,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

type Locale = "zh-hk" | "zh-cn" | "en";
type PillarKey = "homes" | "carbon" | "future";
type ActionKey = "community" | "environment" | "service" | "innovation";
type StoryMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; alt: string }
  | { type: "graphic"; variant: "solar" | "community"; alt: string };

type Pillar = {
  key: PillarKey;
  title: string;
  english: string;
  description: string;
  action: string;
};

type Story = {
  slug: string;
  pillar: PillarKey;
  action: ActionKey;
  place: string;
  title: string;
  summary: string;
  detail: string;
  impact: string;
  media: StoryMedia;
  scopeKind?: "organization" | "property";
  sourceKey?: "sustainability" | "annual";
  sourcePage?: number;
};

type Metric = {
  value: string;
  unit: string;
  label: string;
  scope: string;
  scopeKind: "organization" | "property";
  sourceKey: "sustainability" | "annual";
  sourcePage: number;
};

type RailCueProps = {
  activeIndex: number;
  count: number;
  label: string;
  previousLabel: string;
  nextLabel: string;
  onSelect: (index: number) => void;
};

const sourceDocuments = {
  sustainability: "https://www.hkhs.com/home/pdf/sustainability_report/2025/files/downloads/HKHS%20Sustainability%20Report_24-25.pdf",
  annual: "https://www.hkhs.com/home/pdf/ar2025/files/downloads/HKHS_Annual_Report_24-25.pdf",
} as const;

const siteBasePath = process.env.NEXT_PUBLIC_SITE_BASE_PATH ?? "";
const publicPath = (path: string) => `${siteBasePath}${path}`;

const media = {
  reuseHero: publicPath("/media/photos/kll-reuse-hero.jpg"),
  reuseDetail: publicPath("/media/photos/kll-reuse-detail-1.jpg"),
  reusePortrait: publicPath("/media/photos/kll-reuse-detail-2.jpg"),
  garden: publicPath("/media/videos/community-garden.mp4"),
  foodWasteKll: publicPath("/media/videos/food-waste-kll.mp4"),
  foodWasteLtt: publicPath("/media/videos/food-waste-ltt.mp4"),
  foodWaste: publicPath("/media/feedback2/estate-food-waste.webp"),
  clothesRecycling: publicPath("/media/feedback2/estate-clothes-recycling.webp"),
  smartRecycling: publicPath("/media/feedback2/estate-smart-recycling.webp"),
  recyclingStation: publicPath("/media/feedback2/estate-recycling-station.webp"),
  solarMosquito: publicPath("/media/feedback2/estate-solar-mosquito.webp"),
  solarMosquitoNight: publicPath("/media/feedback2/estate-solar-mosquito-night.webp"),
  communityArt: publicPath("/media/feedback2/estate-community-art.webp"),
  evCharging: publicPath("/media/feedback2/estate-ev-charging.webp"),
  inclusivePlay: publicPath("/media/feedback2/estate-inclusive-play.webp"),
  hsLiving: publicPath("/media/feedback4/hs-living.webp"),
  renewableWind: publicPath("/media/feedback4/renewable-wind.webp"),
  smartMosquito: publicPath("/media/feedback4/smart-mosquito.webp"),
  smartFoodWaste: publicPath("/media/feedback4/smart-food-waste.webp"),
};

const content = {
  "zh-hk": {
    htmlLang: "zh-HK",
    nav: {
      home: "首頁",
      stories: "屋邨行動",
      progress: "進展",
      videos: "影片",
      pillars: "三大支柱",
      direction: "房協方向",
      menu: "開啟選單",
      close: "關閉",
    },
    brand: {
      division: "香港房屋協會 物業管理部門",
      full: "Hong Kong Housing Society Property Management Division",
    },
    ui: {
      swipe: "左右滑動查看更多",
      previous: "上一項",
      next: "下一項",
      source: "查看正式來源",
      reportPage: "PDF 第",
      pageSuffix: "頁",
      organization: "房協整體",
      property: "物業管理實踐",
      sustainabilityReport: "香港房屋協會 2024/25 可持續發展報告",
      annualReport: "香港房屋協會 2024/25 年度報告",
      previousStory: "上一個故事",
      nextStory: "下一個故事",
      journeyProgress: "探索進度",
    },
    hero: {
      eyebrow: "香港房屋協會-物業管理部門 可持續發展",
      title: "創建宜居．永續共融",
      body: "我們在物業管理和社區日常中落實可持續發展，與居民共建更宜居、更低碳的未來。",
      cta: "探索屋邨行動",
      secondary: "查看進展",
      videoLabel: "ESG 概覽影片",
      videoDuration: "約 2 分鐘",
      videoStatus: "完整影片將於此位置播放",
    },
    intro: {
      title: "在物業管理日常，把 ESG 承諾變成行動",
      body: "我們從居民需要、資源使用、設施表現和未來能力出發，把房協的長遠方向落實在屋邨管理和社區日常。",
    },
    pillarHeading: "三大支柱，共同支撐宜居未來",
    pillarPrompt: "選擇支柱",
    pillarSource: "三大支柱源自房協可持續發展策略。",
    pillars: [
      {
        key: "homes",
        title: "可持續居所",
        english: "Sustainable Homes",
        description: "回應不同人生階段和社會需要，營造安全、共融並具連繫的居住環境。",
        action: "居所與社區",
      },
      {
        key: "carbon",
        title: "低碳轉型",
        english: "Low-carbon Transformation",
        description: "把節能、減碳、循環資源和氣候韌性融入發展、管理及營運。",
        action: "資源與環境",
      },
      {
        key: "future",
        title: "裝備未來",
        english: "Future-fit Capabilities",
        description: "以人才、安全、數據和創新科技，提升物業及資產的長遠表現。",
        action: "能力與創新",
      },
    ] satisfies Pillar[],
    journey: {
      title: "從建造到管理，把長遠價值帶進日常",
      body: "物業管理團隊承接房屋和資產全生命週期的成果，並在營運中持續改善。",
      items: [
        ["規劃與設計", "把全生命週期、居民需要和氣候韌性納入早期決策。"],
        ["建造", "推動低碳建造、物料效益和安全施工。"],
        ["管理營運", "以數據和科技持續改善能源、設施及服務表現。"],
        ["居民參與", "讓減廢、回收、園圃和共融活動成為屋邨日常。"],
        ["社區協作", "與居民、學校、伙伴及業界共同擴大正面影響。"],
      ],
    },
    storySection: {
      title: "物業管理，讓可持續發展在屋邨發生",
      body: "按主題探索我們在社區共融、綠色營運、數碼服務及智慧管理上的實際工作。",
      all: "全部",
      read: "閱讀故事",
      detailTitle: "我們的行動",
      impactTitle: "帶來的改變",
      actionPrompt: "選擇屋邨行動主題",
      actions: { community: "共融社區", environment: "綠色營運", service: "數碼服務", innovation: "智慧管理" },
    },
    stories: [
      {
        slug: "smart-recycling-hub",
        pillar: "carbon",
        action: "environment",
        place: "20 個出租屋邨",
        title: "智能回收，讓分類走進日常",
        summary: "廚餘、舊衣和多類可回收物各有清楚去向，讓屋邨分類更便利。",
        detail: "物業管理團隊按屋邨環境整合智能廚餘機、衣物回收箱，以及金屬、塑膠、紙張和玻璃分類設施，並以清楚標示和日常管理支援居民參與。",
        impact: "近 50 部智能廚餘回收機已設於 20 個出租屋邨，並與其他分類設施共同支援資源循環。",
        media: { type: "image", src: media.smartFoodWaste, alt: "出租屋邨設置的智能廚餘回收設施" },
        sourceKey: "annual",
        sourcePage: 141,
      },
      {
        slug: "renewable-energy",
        pillar: "carbon",
        action: "environment",
        place: "出租屋邨",
        title: "在屋邨採集潔淨能源",
        summary: "太陽能和風力設備把公共空間轉化為可再生能源的實踐場景。",
        detail: "房協在合適屋邨設置太陽能光伏系統，並在觀龍樓應用風力發電，將可再生能源融入物業營運。",
        impact: "截至 2024/25 年度，10 個出租屋邨設有太陽能光伏系統。",
        media: { type: "image", src: media.renewableWind, alt: "觀龍樓的風力發電設備" },
        sourceKey: "annual",
        sourcePage: 141,
      },
      {
        slug: "intergenerational-community",
        pillar: "homes",
        action: "community",
        place: "跨代社區",
        title: "讓不同世代共享生活空間",
        summary: "共融設施和社區活動回應長者、家庭及不同居民的生活需要。",
        detail: "房協從空間、設施和活動三方面推動跨代交流，讓居民在日常生活中建立互助和連繫。",
        impact: "設計不只處理通行和使用需要，也重視尊重、參與和社區歸屬感。",
        media: { type: "image", src: media.inclusivePlay, alt: "屋邨內色彩清晰的長幼共融遊樂空間" },
      },
      {
        slug: "community-art",
        pillar: "homes",
        action: "community",
        place: "屋邨公共空間",
        title: "把社區故事帶進日常空間",
        summary: "以街坊創作和地方特色豐富公共空間，讓屋邨環境更具歸屬感。",
        detail: "物業管理不只照顧設施運作，也透過合適的社區藝術和展示，把地方記憶融入居民每天經過的空間。",
        impact: "公共空間兼具使用功能和社區特色，支持居民建立對居住環境的認同。",
        media: { type: "image", src: media.communityArt, alt: "屋邨公共空間展示以漁光竹映為題的街坊創作" },
      },
      {
        slug: "ev-charging",
        pillar: "carbon",
        action: "environment",
        place: "屋邨停車場",
        title: "為低碳出行準備充電設施",
        summary: "在合適停車位置配置充電設備，配合交通電動化的長遠需要。",
        detail: "物業管理團隊按場地條件和使用需要規劃充電設施，並把設備安全、維護和日常運作納入管理。",
        impact: "逐步完善屋邨低碳出行配套，也為未來資產管理建立實務經驗。",
        media: { type: "image", src: media.evCharging, alt: "屋邨停車位置旁的電動車充電設備" },
      },
      {
        slug: "geoai-mosquito-control",
        pillar: "future",
        action: "innovation",
        place: "觀龍樓等屋邨",
        title: "以智能監測支援精準防蚊",
        summary: "智能滅蚊燈和氣象資料協助團隊掌握環境變化，提早部署防蚊工作。",
        detail: "物業管理團隊與科研機構合作，在觀龍樓等屋邨安裝智能滅蚊燈及氣象站，透過數據辨識蚊種及預測短期蚊患趨勢。",
        impact: "環境管理由定期處理走向更具針對性的部署，提升屋邨防蚊工作的效率。",
        media: { type: "image", src: media.smartMosquito, alt: "屋邨園景內的智能滅蚊及環境監測設備" },
      },
      {
        slug: "hs-living-service",
        pillar: "future",
        action: "service",
        place: "屋邨數碼服務",
        title: "一站式資訊，連繫屋邨生活",
        summary: "居民可透過手機應用程式查閱屋邨資訊、接收通知及報名參與活動。",
        detail: "HS Living 及房協屋邨資訊手機應用程式把常用屋邨資訊和服務帶到流動裝置，讓居民更便捷地了解日常安排及社區活動。",
        impact: "資訊傳達更及時，亦減少紙本通告的需要，支持居民參與和綠色生活。",
        media: { type: "image", src: media.hsLiving, alt: "HS Living 手機應用程式畫面" },
      },
    ] satisfies Story[],
    progress: {
      title: "以量化成果，呈現我們的進展。",
      body: "",
      source: "資料來源：香港房屋協會 2024/25 可持續發展報告及年度報告。",
    },
    metrics: [
      { value: "31", unit: "%", label: "能源消耗減少", scope: "相對 2012/13 基準，按正式報告所列選定物業範圍", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "21.9", unit: "%", label: "範疇一及二碳排放按年下降", scope: "2024/25，涵蓋出租屋邨、管理物業、建築項目及主要辦公室", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "16,099", unit: "公噸", label: "回收物料", scope: "2024/25 年度，包括金屬、紙張、塑膠、玻璃、木材及紡織物", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "近 50", unit: "部", label: "智能廚餘回收設施", scope: "設於 20 個出租屋邨", scopeKind: "property", sourceKey: "annual", sourcePage: 141 },
      { value: "25,100", unit: "小時", label: "社區服務", scope: "2024/25，由房協友里團隊及房協學院舊生會共同貢獻", scopeKind: "organization", sourceKey: "annual", sourcePage: 144 },
      { value: "38,660", unit: "小時", label: "員工培訓及專業發展", scope: "2024/25，適用於長期及固定任期員工", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
    ] satisfies Metric[],
    governance: {
      title: "以負責任管治，推動每一步",
      body: "清晰的管治、跨部門協作和負責任融資，讓可持續發展成為房屋和資產決策的一部分。",
      items: [
        ["方向與監督", "由總監會議及相關工作小組推動策略、監督表現和檢視重點。"],
        ["落實與協作", "營運團隊把承諾納入規劃、建造、管理和社區服務。"],
        ["透明與問責", "以正式報告、明確數據範圍和持續溝通交代進展。"],
      ],
    },
    videos: {
      title: "看見社區中的改變",
      body: "由居民親身示範，了解綠色生活如何在屋邨發生。",
      play: "播放影片",
      note: "可使用原生播放控制觀看影片。",
      items: [
        ["週末園圃種植樂", "居民共享種植經驗，讓綠色空間成為社區交流的一部分。", media.garden],
        ["觀龍樓智能廚餘回收", "居民示範日常回收流程。", media.foodWasteKll],
        ["廚餘回收設施示範", "從分類到回收，建立更便利的參與體驗。", media.foodWasteLtt],
      ],
    },
    footer: {
      statement: "可持續發展不是單一項目，而是我們建造、管理和服務社區的方式。",
      copyright: "香港房屋協會 物業管理部門",
      note: "數據以所示報告期、披露範圍及正式來源為準。",
    },
  },
  "zh-cn": {
    htmlLang: "zh-CN",
    nav: { home: "首页", stories: "屋邨行动", progress: "进展", videos: "视频", pillars: "三大支柱", direction: "房协方向", menu: "打开菜单", close: "关闭" },
    brand: { division: "香港房屋协会 物业管理部门", full: "Hong Kong Housing Society Property Management Division" },
    ui: {
      swipe: "左右滑动查看更多", previous: "上一项", next: "下一项", source: "查看正式来源", reportPage: "PDF 第", pageSuffix: "页",
      organization: "房协整体", property: "物业管理实践", sustainabilityReport: "香港房屋协会 2024/25 可持续发展报告", annualReport: "香港房屋协会 2024/25 年度报告",
      previousStory: "上一个故事", nextStory: "下一个故事", journeyProgress: "探索进度",
    },
    hero: {
      eyebrow: "香港房屋协会-物业管理部门 可持续发展",
      title: "创建宜居．永续共融",
      body: "我们在物业管理和社区日常中落实可持续发展，与居民共建更宜居、更低碳的未来。",
      cta: "探索屋邨行动",
      secondary: "查看进展",
      videoLabel: "ESG 概览视频", videoDuration: "约 2 分钟", videoStatus: "完整视频将在此位置播放",
    },
    intro: {
      title: "在物业管理日常，把 ESG 承诺变成行动",
      body: "我们从居民需要、资源使用、设施表现和未来能力出发，把房协的长远方向落实在屋邨管理和社区日常。",
    },
    pillarHeading: "三大支柱，共同支撑宜居未来",
    pillarPrompt: "选择支柱",
    pillarSource: "三大支柱源自房协可持续发展策略。",
    pillars: [
      { key: "homes", title: "可持续居所", english: "Sustainable Homes", description: "回应不同人生阶段和社会需要，营造安全、共融并具连系的居住环境。", action: "居所与社区" },
      { key: "carbon", title: "低碳转型", english: "Low-carbon Transformation", description: "把节能、减碳、循环资源和气候韧性融入发展、管理及营运。", action: "资源与环境" },
      { key: "future", title: "装备未来", english: "Future-fit Capabilities", description: "以人才、安全、数据和创新科技，提升物业及资产的长远表现。", action: "能力与创新" },
    ] satisfies Pillar[],
    journey: {
      title: "从建造到管理，把长远价值带进日常",
      body: "物业管理团队承接房屋和资产全生命周期的成果，并在营运中持续改善。",
      items: [
        ["规划与设计", "把全生命周期、居民需要和气候韧性纳入早期决策。"],
        ["建造", "推动低碳建造、物料效益和安全施工。"],
        ["管理营运", "以数据和科技持续改善能源、设施及服务表现。"],
        ["居民参与", "让减废、回收、园圃和共融活动成为屋邨日常。"],
        ["社区协作", "与居民、学校、伙伴及业界共同扩大正面影响。"],
      ],
    },
    storySection: {
      title: "物业管理，让可持续发展在屋邨发生",
      body: "按主题探索我们在社区共融、绿色营运、数码服务及智慧管理上的实际工作。",
      all: "全部", read: "阅读故事", detailTitle: "我们的行动", impactTitle: "带来的改变", actionPrompt: "选择屋邨行动主题",
      actions: { community: "共融社区", environment: "绿色营运", service: "数码服务", innovation: "智慧管理" },
    },
    stories: [] as Story[],
    progress: { title: "以量化成果，呈现我们的进展。", body: "", source: "资料来源：香港房屋协会 2024/25 可持续发展报告及年度报告。" },
    metrics: [
      { value: "31", unit: "%", label: "能源消耗减少", scope: "相对 2012/13 基准，按正式报告所列选定物业范围", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "21.9", unit: "%", label: "范围一及二碳排放按年下降", scope: "2024/25，涵盖出租屋邨、管理物业、建筑项目及主要办公室", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "16,099", unit: "公吨", label: "回收物料", scope: "2024/25 年度，包括金属、纸张、塑料、玻璃、木材及纺织物", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "近 50", unit: "部", label: "智能厨余回收设施", scope: "设于 20 个出租屋邨", scopeKind: "property", sourceKey: "annual", sourcePage: 141 },
      { value: "25,100", unit: "小时", label: "社区服务", scope: "2024/25，由房协友里团队及房协学院旧生会共同贡献", scopeKind: "organization", sourceKey: "annual", sourcePage: 144 },
      { value: "38,660", unit: "小时", label: "员工培训及专业发展", scope: "2024/25，适用于长期及固定任期员工", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
    ] satisfies Metric[],
    governance: {
      title: "以负责任管治，推动每一步",
      body: "清晰的管治、跨部门协作和负责任融资，让可持续发展成为房屋和资产决策的一部分。",
      items: [
        ["方向与监督", "由总监会议及相关工作小组推动策略、监督表现和检视重点。"],
        ["落实与协作", "营运团队把承诺纳入规划、建造、管理和社区服务。"],
        ["透明与问责", "以正式报告、明确数据范围和持续沟通交代进展。"],
      ],
    },
    videos: {
      title: "看见社区中的改变",
      body: "由居民亲身示范，了解绿色生活如何在屋邨发生。",
      play: "播放视频",
      note: "可使用原生播放控制观看视频。",
      items: [
        ["周末园圃种植乐", "居民共享种植经验，让绿色空间成为社区交流的一部分。", media.garden],
        ["观龙楼智能厨余回收", "居民示范日常回收流程。", media.foodWasteKll],
        ["厨余回收设施示范", "从分类到回收，建立更便利的参与体验。", media.foodWasteLtt],
      ],
    },
    footer: { statement: "可持续发展不是单一项目，而是我们建造、管理和服务社区的方式。", copyright: "香港房屋协会 物业管理部门", note: "数据以所示报告期、披露范围及正式来源为准。" },
  },
  en: {
    htmlLang: "en",
    nav: { home: "Home", stories: "Estate action", progress: "Progress", videos: "Videos", pillars: "Our pillars", direction: "HKHS direction", menu: "Open menu", close: "Close" },
    brand: { division: "香港房屋協會 物業管理部門", full: "Hong Kong Housing Society Property Management Division" },
    ui: {
      swipe: "Swipe to explore", previous: "Previous", next: "Next", source: "View official source", reportPage: "PDF page ", pageSuffix: "",
      organization: "HKHS-wide", property: "Property management practice", sustainabilityReport: "HKHS Sustainability Report 2024/25", annualReport: "HKHS Annual Report 2024/25",
      previousStory: "Previous story", nextStory: "Next story", journeyProgress: "Exploration progress",
    },
    hero: {
      eyebrow: "HKHS Property Management Division Sustainability",
      title: "Creating Homes for Sustainable Living",
      body: "We put sustainability into practice through property management and community life, building a liveable, low-carbon future with residents.",
      cta: "Explore estate action",
      secondary: "View our progress",
      videoLabel: "ESG overview film", videoDuration: "Around 2 minutes", videoStatus: "The full film will play here",
    },
    intro: {
      title: "Turning ESG commitments into everyday management",
      body: "We bring HKHS's long-term direction into estate management through resident needs, resource use, asset performance and future-ready capabilities.",
    },
    pillarHeading: "Three pillars for a liveable future",
    pillarPrompt: "Choose a pillar",
    pillarSource: "The three pillars form part of HKHS's sustainability strategy.",
    pillars: [
      { key: "homes", title: "Sustainable Homes", english: "可持續居所", description: "We respond to changing life stages and community needs with safe, inclusive and connected living environments.", action: "Homes and community" },
      { key: "carbon", title: "Low-carbon Transformation", english: "低碳轉型", description: "We integrate energy efficiency, carbon reduction, circular resources and resilience into development and operations.", action: "Resources and environment" },
      { key: "future", title: "Future-fit Capabilities", english: "裝備未來", description: "We strengthen long-term asset performance through people, safety, data and innovation.", action: "Capabilities and innovation" },
    ] satisfies Pillar[],
    journey: {
      title: "Bringing long-term value into everyday management",
      body: "Property management carries lifecycle thinking into operations and continuous improvement.",
      items: [
        ["Plan and design", "Bring lifecycle thinking, resident needs and climate resilience into early decisions."],
        ["Build", "Advance lower-carbon construction, material efficiency and safe delivery."],
        ["Manage and operate", "Use data and technology to improve energy, facilities and services."],
        ["Engage residents", "Make waste reduction, recycling, gardens and inclusion part of estate life."],
        ["Work together", "Extend positive impact with residents, schools, partners and the industry."],
      ],
    },
    storySection: {
      title: "Property management makes sustainability tangible",
      body: "Explore our work across inclusive communities, greener operations, digital services and smarter management.",
      all: "All", read: "Read story", detailTitle: "Our action", impactTitle: "The change", actionPrompt: "Choose an estate action theme",
      actions: { community: "Inclusive community", environment: "Greener operations", service: "Digital services", innovation: "Smarter management" },
    },
    stories: [] as Story[],
    progress: { title: "Presenting our progress through measurable results.", body: "", source: "Sources: HKHS Sustainability Report 2024/25 and Annual Report 2024/25." },
    metrics: [
      { value: "31", unit: "%", label: "reduction in energy consumption", scope: "Against the 2012/13 baseline, within the selected property scope stated in the report", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "21.9", unit: "%", label: "year-on-year fall in Scope 1 and 2 emissions", scope: "2024/25, covering rental estates, managed properties, construction projects and major offices", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "16,099", unit: "tonnes", label: "materials recycled", scope: "2024/25, including metals, paper, plastics, glass, timber and textiles", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "Nearly 50", unit: "units", label: "smart food waste recycling facilities", scope: "Across 20 rental estates", scopeKind: "property", sourceKey: "annual", sourcePage: 141 },
      { value: "25,100", unit: "hours", label: "community service", scope: "Contributed in 2024/25 by the CES Team and HKHS Academy Alumni Club", scopeKind: "organization", sourceKey: "annual", sourcePage: 144 },
      { value: "38,660", unit: "hours", label: "staff training and professional development", scope: "2024/25, for permanent and contract staff", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
    ] satisfies Metric[],
    governance: {
      title: "Responsible governance behind every step",
      body: "Clear oversight, collaboration and responsible finance make sustainability part of housing and asset decisions.",
      items: [
        ["Direction and oversight", "The Directors' Meeting and relevant working groups guide strategy, monitor performance and review priorities."],
        ["Delivery and collaboration", "Operational teams bring commitments into planning, construction, management and community service."],
        ["Transparency and accountability", "Formal reporting, clear data scopes and ongoing communication show our progress."],
      ],
    },
    videos: {
      title: "See change taking place",
      body: "Residents show how greener living becomes part of everyday estate life.",
      play: "Play video",
      note: "Use the native playback controls to watch each video.",
      items: [
        ["A weekend in the community garden", "Residents share growing experience and turn green space into a place for connection.", media.garden],
        ["Smart food waste recycling at Kwun Lung Lau", "Residents demonstrate the everyday recycling process.", media.foodWasteKll],
        ["Using a food waste recycling facility", "A more convenient experience from separation to recycling.", media.foodWasteLtt],
      ],
    },
    footer: { statement: "Sustainability is not one project. It is how we build, manage and serve communities.", copyright: "Hong Kong Housing Society Property Management Division", note: "Figures should be read with the reporting period, disclosure scope and official source shown." },
  },
} as const;

const englishStories: Story[] = [
  {
    slug: "smart-recycling-hub",
    pillar: "carbon",
    action: "environment",
    place: "20 rental estates",
    title: "Smart recycling for everyday sorting",
    summary: "Food waste, used clothing and common recyclables each have a clearer route across estate life.",
    detail: "Property management teams bring together smart food waste bins, clothes collection and facilities for metal, plastic, paper and glass, supported by clear signs and daily management.",
    impact: "Nearly 50 smart food waste recycling bins serve 20 rental estates alongside other recycling facilities.",
    media: { type: "image", src: media.smartFoodWaste, alt: "A smart food waste recycling facility at a rental estate" },
    sourceKey: "annual",
    sourcePage: 141,
  },
  {
    slug: "renewable-energy",
    pillar: "carbon",
    action: "environment",
    place: "Rental estates",
    title: "Harvesting cleaner energy on estates",
    summary: "Solar and wind installations turn shared spaces into practical renewable energy sites.",
    detail: "HKHS installs solar photovoltaic systems at suitable estates and uses wind generation at Kwun Lung Lau, integrating renewables into operations.",
    impact: "By 2024/25, solar photovoltaic systems were installed at 10 rental estates.",
    media: { type: "image", src: media.renewableWind, alt: "Wind generation equipment at Kwun Lung Lau" },
    sourceKey: "annual",
    sourcePage: 141,
  },
  {
    slug: "intergenerational-community",
    pillar: "homes",
    action: "community",
    place: "Intergenerational community",
    title: "Shared spaces for every generation",
    summary: "Inclusive facilities and activities respond to older people, families and diverse residents.",
    detail: "HKHS promotes intergenerational connection through spaces, facilities and activities that encourage residents to meet and support one another.",
    impact: "Design addresses access and use while strengthening respect, participation and belonging.",
    media: { type: "image", src: media.inclusivePlay, alt: "A colourful inclusive play space on an estate" },
  },
  {
    slug: "community-art",
    pillar: "homes",
    action: "community",
    place: "Estate shared space",
    title: "Bringing community stories into shared space",
    summary: "Resident creativity and local character can enrich everyday estate environments.",
    detail: "Property management supports functional shared spaces while suitable community art and displays bring local memories into residents' daily routes.",
    impact: "Shared areas can serve practical needs and express a stronger sense of place and belonging.",
    media: { type: "image", src: media.communityArt, alt: "Community artwork displayed in an estate shared space" },
  },
  {
    slug: "ev-charging",
    pillar: "carbon",
    action: "environment",
    place: "Estate car park",
    title: "Preparing charging facilities for lower-carbon travel",
    summary: "Charging equipment at suitable parking spaces supports the longer-term transition to electric mobility.",
    detail: "Property management teams plan charging around site conditions and user needs, while including safety, maintenance and operation in daily management.",
    impact: "The facilities strengthen lower-carbon transport readiness and build practical asset management experience.",
    media: { type: "image", src: media.evCharging, alt: "Electric vehicle charging equipment beside an estate parking space" },
  },
  {
    slug: "geoai-mosquito-control",
    pillar: "future",
    action: "innovation",
    place: "Kwun Lung Lau and other estates",
    title: "Using smart monitoring for targeted mosquito control",
    summary: "Smart mosquito traps and weather data help teams track environmental change and plan earlier action.",
    detail: "Property management teams work with research partners to install smart mosquito traps and weather stations, using data to identify species and forecast short-term mosquito activity.",
    impact: "Estate hygiene work becomes more targeted and responsive to local conditions.",
    media: { type: "image", src: media.smartMosquito, alt: "Smart mosquito-control and environmental monitoring equipment in an estate landscape" },
  },
  {
    slug: "hs-living-service",
    pillar: "future",
    action: "service",
    place: "Estate digital services",
    title: "One place for everyday estate information",
    summary: "Residents can view estate information, receive notices and register for activities on their phones.",
    detail: "The HS Living and estate information apps bring frequently used information and services to mobile devices, helping residents keep up with everyday arrangements and community activities.",
    impact: "Information reaches residents sooner, with less reliance on paper notices and more convenient participation.",
    media: { type: "image", src: media.hsLiving, alt: "HS Living mobile application screens" },
  },
];

const simplifiedStories: Story[] = [
  {
    slug: "smart-recycling-hub",
    pillar: "carbon",
    action: "environment",
    place: "20 个出租屋邨",
    title: "智能回收，让分类走进日常",
    summary: "厨余、旧衣和多类可回收物各有清楚去向，让屋邨分类更便利。",
    detail: "物业管理团队按屋邨环境整合智能厨余机、衣物回收箱，以及金属、塑料、纸张和玻璃分类设施，并以清楚标示和日常管理支持居民参与。",
    impact: "近 50 部智能厨余回收机已设于 20 个出租屋邨，并与其他分类设施共同支持资源循环。",
    media: { type: "image", src: media.smartFoodWaste, alt: "出租屋邨设置的智能厨余回收设施" },
    sourceKey: "annual",
    sourcePage: 141,
  },
  {
    slug: "renewable-energy",
    pillar: "carbon",
    action: "environment",
    place: "出租屋邨",
    title: "在屋邨采集洁净能源",
    summary: "太阳能和风力设备把公共空间转化为可再生能源的实践场景。",
    detail: "房协在合适屋邨设置太阳能光伏系统，并在观龙楼应用风力发电，将可再生能源融入物业营运。",
    impact: "截至 2024/25 年度，10 个出租屋邨设有太阳能光伏系统。",
    media: { type: "image", src: media.renewableWind, alt: "观龙楼的风力发电设备" },
    sourceKey: "annual",
    sourcePage: 141,
  },
  {
    slug: "intergenerational-community",
    pillar: "homes",
    action: "community",
    place: "跨代社区",
    title: "让不同世代共享生活空间",
    summary: "共融设施和社区活动回应长者、家庭及不同居民的生活需要。",
    detail: "房协从空间、设施和活动三方面推动跨代交流，让居民在日常生活中建立互助和连系。",
    impact: "设计不只处理通行和使用需要，也重视尊重、参与和社区归属感。",
    media: { type: "image", src: media.inclusivePlay, alt: "屋邨内色彩清晰的长幼共融游乐空间" },
  },
  {
    slug: "community-art",
    pillar: "homes",
    action: "community",
    place: "屋邨公共空间",
    title: "把社区故事带进日常空间",
    summary: "以街坊创作和地方特色丰富公共空间，让屋邨环境更具归属感。",
    detail: "物业管理不只照顾设施运作，也透过合适的社区艺术和展示，把地方记忆融入居民每天经过的空间。",
    impact: "公共空间兼具使用功能和社区特色，支持居民建立对居住环境的认同。",
    media: { type: "image", src: media.communityArt, alt: "屋邨公共空间展示以渔光竹映为题的街坊创作" },
  },
  {
    slug: "ev-charging",
    pillar: "carbon",
    action: "environment",
    place: "屋邨停车场",
    title: "为低碳出行准备充电设施",
    summary: "在合适停车位置配置充电设备，配合交通电动化的长远需要。",
    detail: "物业管理团队按场地条件和使用需要规划充电设施，并把设备安全、维护和日常运作纳入管理。",
    impact: "逐步完善屋邨低碳出行配套，也为未来资产管理建立实务经验。",
    media: { type: "image", src: media.evCharging, alt: "屋邨停车位置旁的电动车充电设备" },
  },
  {
    slug: "geoai-mosquito-control",
    pillar: "future",
    action: "innovation",
    place: "观龙楼等屋邨",
    title: "以智能监测支持精准防蚊",
    summary: "智能灭蚊灯和气象数据协助团队掌握环境变化，提早部署防蚊工作。",
    detail: "物业管理团队与科研机构合作，在观龙楼等屋邨安装智能灭蚊灯及气象站，透过数据辨识蚊种及预测短期蚊患趋势。",
    impact: "环境管理由定期处理走向更具针对性的部署，提升屋邨防蚊工作的效率。",
    media: { type: "image", src: media.smartMosquito, alt: "屋邨园景内的智能灭蚊及环境监测设备" },
  },
  {
    slug: "hs-living-service",
    pillar: "future",
    action: "service",
    place: "屋邨数码服务",
    title: "一站式信息，连系屋邨生活",
    summary: "居民可透过手机应用程序查阅屋邨信息、接收通知及报名参与活动。",
    detail: "HS Living 及房协屋邨信息手机应用程序把常用屋邨信息和服务带到移动设备，让居民更便捷地了解日常安排及社区活动。",
    impact: "信息传达更及时，也减少纸本通告的需要，支持居民参与和绿色生活。",
    media: { type: "image", src: media.hsLiving, alt: "HS Living 手机应用程序画面" },
  },
];

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "brand-mark brand-mark-compact" : "brand-mark"} data-brand-status="provisional">
      <img
        src={publicPath("/brand/hkhs-horizontal.png")}
        alt="Hong Kong Housing Society 香港房屋協會"
        width="2212"
        height="729"
      />
    </span>
  );
}

function StoryVisual({ media: visual, compact = false }: { media: StoryMedia; compact?: boolean }) {
  if (visual.type === "image") {
    return <img src={visual.src} alt={visual.alt} width="1800" height="1352" loading="lazy" />;
  }

  if (visual.type === "video") {
    return (
      <video muted playsInline preload="metadata" aria-label={visual.alt} tabIndex={-1}>
        <source src={visual.src} type="video/mp4" />
      </video>
    );
  }

  const Icon = visual.variant === "solar" ? Sun : UsersThree;
  return (
    <div className={`story-graphic story-graphic-${visual.variant} ${compact ? "is-compact" : ""}`} role="img" aria-label={visual.alt}>
      <Icon size={compact ? 54 : 88} weight="thin" aria-hidden="true" />
      <span className="graphic-orbit" aria-hidden="true" />
      <span className="graphic-plane" aria-hidden="true" />
    </div>
  );
}

function RailCue({ activeIndex, count, label, previousLabel, nextLabel, onSelect }: RailCueProps) {
  return (
    <div className="rail-cue" aria-label={label}>
      <span className="rail-cue-label">{label}</span>
      <div className="rail-controls">
        <button type="button" onClick={() => onSelect(Math.max(0, activeIndex - 1))} disabled={activeIndex === 0} aria-label={previousLabel}>
          <CaretLeft size={18} weight="bold" aria-hidden="true" />
        </button>
        <span className="rail-count" aria-live="polite">{activeIndex + 1} / {count}</span>
        <div className="rail-dots" aria-hidden="true">
          {Array.from({ length: count }, (_, index) => <span key={index} className={index === activeIndex ? "is-active" : ""} />)}
        </div>
        <button type="button" onClick={() => onSelect(Math.min(count - 1, activeIndex + 1))} disabled={activeIndex === count - 1} aria-label={nextLabel}>
          <CaretRight size={18} weight="bold" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function useRailIndex(count: number) {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || typeof IntersectionObserver === "undefined") return;
    const items = Array.from(rail.children);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveIndex(items.indexOf(visible.target));
      },
      { root: rail, threshold: [0.45, 0.7] },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [count]);

  const selectIndex = (index: number) => {
    const item = railRef.current?.children[index] as HTMLElement | undefined;
    item?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setActiveIndex(index);
  };

  return { railRef, activeIndex, selectIndex };
}

const sectionIds = ["home", "stories", "progress", "videos", "pillars", "direction"] as const;

function useSectionProgress() {
  const [activeSection, setActiveSection] = useState<(typeof sectionIds)[number]>("home");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const elements = sectionIds.map((id) => document.getElementById(id)).filter((element): element is HTMLElement => Boolean(element));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id as (typeof sectionIds)[number]);
      },
      { rootMargin: "-32% 0px -56% 0px", threshold: [0, 0.15, 0.4] },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return activeSection;
}

export function SiteExperience({ locale }: { locale: Locale }) {
  const reduceMotion = useReducedMotion();
  const c = content[locale];
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePillar, setActivePillar] = useState<PillarKey>("homes");
  const [storyFilter, setStoryFilter] = useState<"all" | ActionKey>("all");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [activeVideo, setActiveVideo] = useState(0);
  const activeSection = useSectionProgress();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogInnerRef = useRef<HTMLDivElement>(null);
  const pillarRailRef = useRef<HTMLDivElement>(null);
  const videoRailRef = useRef<HTMLDivElement>(null);
  const {
    railRef: journeyRailRef,
    activeIndex: journeyActiveIndex,
    selectIndex: selectJourneyIndex,
  } = useRailIndex(c.journey.items.length);

  const stories = useMemo(() => {
    if (locale === "en") return englishStories;
    if (locale === "zh-cn") return simplifiedStories;
    return [...content["zh-hk"].stories];
  }, [locale]);

  const filteredStories = storyFilter === "all" ? stories : stories.filter((story) => story.action === storyFilter);
  const selectedPillar = c.pillars.find((pillar) => pillar.key === activePillar) ?? c.pillars[0];
  const activePillarIndex = c.pillars.findIndex((pillar) => pillar.key === activePillar);
  const sectionLinks = [
    ["home", c.nav.home],
    ["stories", c.nav.stories],
    ["progress", c.nav.progress],
    ["videos", c.nav.videos],
    ["pillars", c.nav.pillars],
    ["direction", c.nav.direction],
  ] as const;
  const dialogOpen = Boolean(selectedStory);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialogOpen) {
      if (dialog.open) dialog.close();
      return;
    }

    const scrollPosition = window.scrollY;
    const previousBodyStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };
    if (!dialog.open) dialog.showModal();
    if (dialogInnerRef.current) dialogInnerRef.current.scrollTop = 0;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      if (dialog.open) dialog.close();
      document.body.style.position = previousBodyStyles.position;
      document.body.style.top = previousBodyStyles.top;
      document.body.style.width = previousBodyStyles.width;
      document.body.style.overflow = previousBodyStyles.overflow;
      window.scrollTo(0, scrollPosition);
    };
  }, [dialogOpen]);

  const selectPillar = (index: number) => {
    const pillar = c.pillars[index];
    if (!pillar) return;
    setActivePillar(pillar.key);
    (pillarRailRef.current?.children[index] as HTMLElement | undefined)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  const selectVideo = (index: number) => {
    setActiveVideo(index);
    (videoRailRef.current?.children[index] as HTMLElement | undefined)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  const selectStoryByOffset = (offset: number) => {
    if (!selectedStory) return;
    const currentIndex = stories.findIndex((story) => story.slug === selectedStory.slug);
    const nextIndex = (currentIndex + offset + stories.length) % stories.length;
    setSelectedStory(stories[nextIndex]);
    if (dialogInnerRef.current) dialogInnerRef.current.scrollTop = 0;
  };

  const languageLinks = [
    ["zh-hk", "繁"],
    ["en", "EN"],
    ["zh-cn", "简"],
  ] as const;

  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 26 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.18 },
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <div className="site-shell" lang={c.htmlLang}>
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="topbar">
        <a href={publicPath(locale === "zh-hk" ? "/" : `/${locale}`)} className="brand-link" aria-label={c.nav.home}>
          <BrandMark compact />
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#stories">{c.nav.stories}</a>
          <a href="#progress">{c.nav.progress}</a>
          <a href="#videos">{c.nav.videos}</a>
          <a href="#pillars">{c.nav.pillars}</a>
          <a href="#direction">{c.nav.direction}</a>
        </nav>

        <div className="header-actions">
          <div className="language-switcher" aria-label="Language">
            {languageLinks.map(([key, label]) => (
              <a key={key} href={publicPath(key === "zh-hk" ? "/zh-hk" : `/${key}`)} aria-current={locale === key ? "page" : undefined}>
                {label}
              </a>
            ))}
          </div>
          <button className="menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label={c.nav.menu}>
            <List size={24} weight="regular" aria-hidden="true" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <button type="button" onClick={() => setMenuOpen(false)} aria-label={c.nav.close}>
              <X size={25} aria-hidden="true" />
            </button>
            <BrandMark />
            <nav aria-label="Mobile navigation">
              {[
                ["#stories", c.nav.stories],
                ["#progress", c.nav.progress],
                ["#videos", c.nav.videos],
                ["#pillars", c.nav.pillars],
                ["#direction", c.nav.direction],
              ].map(([href, label]) => (
                <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<ArrowRight size={22} aria-hidden="true" /></a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content">
        <section className="hero" id="home">
          <motion.div
            className="hero-copy"
            initial={reduceMotion ? false : { opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="eyebrow">{c.hero.eyebrow}</p>
            <h1>{c.hero.title}</h1>
            <p className="hero-body">{c.hero.body}</p>
            <div className="hero-actions">
              <a className="primary-button" href="#stories">{c.hero.cta}<ArrowRight size={18} aria-hidden="true" /></a>
              <a className="text-link" href="#progress">{c.hero.secondary}</a>
            </div>
          </motion.div>

          <motion.figure
            className="hero-visual"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-image-wrap hero-video-placeholder" role="img" aria-label={`${c.hero.videoLabel}, ${c.hero.videoDuration}. ${c.hero.videoStatus}`}>
              <img src={media.inclusivePlay} alt="" width="1600" height="900" fetchPriority="high" />
              <div className="hero-video-overlay">
                <div className="hero-video-heading">
                  <FilmSlate size={28} weight="regular" aria-hidden="true" />
                  <span><strong>{c.hero.videoLabel}</strong><small>{c.hero.videoDuration}</small></span>
                </div>
                <p>{c.hero.videoStatus}</p>
              </div>
            </div>
          </motion.figure>
        </section>

        <motion.section className="intro-section" {...reveal}>
          <div className="intro-mark" aria-hidden="true"><Leaf size={38} weight="thin" /></div>
          <h2>{c.intro.title}</h2>
          <p>{c.intro.body}</p>
        </motion.section>

        <section className="stories-section" id="stories">
          <div className="section-heading">
            <h2>{c.storySection.title}</h2>
            <p>{c.storySection.body}</p>
          </div>
          <div className="story-filters" role="group" aria-label={c.storySection.actionPrompt}>
            <button type="button" className={storyFilter === "all" ? "is-active" : ""} onClick={() => setStoryFilter("all")}>{c.storySection.all}</button>
            {(Object.entries(c.storySection.actions) as [ActionKey, string][]).map(([key, label]) => (
              <button key={key} type="button" className={storyFilter === key ? "is-active" : ""} onClick={() => setStoryFilter(key)}>{label}</button>
            ))}
          </div>
          <motion.div className="stories-grid" layout>
            <AnimatePresence mode="popLayout">
              {filteredStories.map((story, index) => (
                <motion.article
                  layout
                  key={story.slug}
                  className={`story-card story-card-${index % 6} story-${story.slug}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="story-media"><StoryVisual media={story.media} compact /></div>
                  <div className="story-copy">
                    <div className="story-meta"><p className="story-place">{story.place}</p><span>{c.ui.property}</span></div>
                    <h3>{story.title}</h3>
                    <p>{story.summary}</p>
                    <button type="button" onClick={() => setSelectedStory(story)}>{c.storySection.read}<ArrowRight size={17} aria-hidden="true" /></button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        <section className="progress-section" id="progress">
          <motion.div className="progress-heading" {...reveal}>
            <ChartLineUp size={42} weight="thin" aria-hidden="true" />
            <h2>{c.progress.title}</h2>
            {c.progress.body ? <p>{c.progress.body}</p> : null}
          </motion.div>
          <div className="metrics-grid">
            {c.metrics.map((metric, index) => (
              <motion.article key={metric.label} className={`metric metric-${index}`} {...reveal}>
                <span className={`scope-label scope-${metric.scopeKind}`}>{metric.scopeKind === "property" ? c.ui.property : c.ui.organization}</span>
                <div className="metric-value"><strong>{metric.value}</strong><span>{metric.unit}</span></div>
                <h3>{metric.label}</h3>
                <p>{metric.scope}</p>
              </motion.article>
            ))}
          </div>
          <details className="source-note">
            <summary>{c.ui.source}<ArrowSquareOut size={16} aria-hidden="true" /></summary>
            <p>{c.progress.source}</p>
            <div>
              <a href={sourceDocuments.sustainability} target="_blank" rel="noreferrer">{c.ui.sustainabilityReport}</a>
              <a href={sourceDocuments.annual} target="_blank" rel="noreferrer">{c.ui.annualReport}</a>
            </div>
          </details>
        </section>

        <section className="videos-section" id="videos">
          <div className="section-heading">
            <h2>{c.videos.title}</h2>
            <p>{c.videos.body}</p>
          </div>
          <div className="video-layout">
            <div className="video-player">
              {/* Captions will be connected when the approved transcripts are provided. */}
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video key={c.videos.items[activeVideo][2]} controls playsInline preload="metadata" poster={media.smartRecycling} aria-label={c.videos.items[activeVideo][0]}>
                <source src={c.videos.items[activeVideo][2]} type="video/mp4" />
              </video>
              <p>{c.videos.note}</p>
            </div>
            <div className="video-selector" ref={videoRailRef}>
              {c.videos.items.map(([title, description], index) => (
                <button key={title} type="button" className={activeVideo === index ? "is-active" : ""} onClick={() => selectVideo(index)}>
                  <span className="play-icon"><Play size={18} weight="fill" aria-hidden="true" /></span>
                  <span><strong>{title}</strong><small>{description}</small></span>
                </button>
              ))}
            </div>
            <RailCue
              activeIndex={activeVideo}
              count={c.videos.items.length}
              label={c.ui.swipe}
              previousLabel={c.ui.previous}
              nextLabel={c.ui.next}
              onSelect={selectVideo}
            />
          </div>
        </section>

        <section className="pillars-section" id="pillars">
          <div className="section-heading">
            <h2>{c.pillarHeading}</h2>
          </div>
          <div className="pillars-layout">
            <div className="pillar-tabs" role="tablist" aria-label={c.pillarPrompt} ref={pillarRailRef}>
              {c.pillars.map((pillar) => (
                <button
                  key={pillar.key}
                  type="button"
                  role="tab"
                  aria-selected={activePillar === pillar.key}
                  onClick={() => selectPillar(c.pillars.findIndex((item) => item.key === pillar.key))}
                >
                  <span>{pillar.title}</span>
                  <small>{pillar.english}</small>
                </button>
              ))}
            </div>
            <RailCue
              activeIndex={activePillarIndex}
              count={c.pillars.length}
              label={c.ui.swipe}
              previousLabel={c.ui.previous}
              nextLabel={c.ui.next}
              onSelect={selectPillar}
            />
            <AnimatePresence mode="wait">
              <motion.article
                key={selectedPillar.key}
                className={`pillar-panel pillar-${selectedPillar.key}`}
                initial={reduceMotion ? false : { opacity: 0, x: 22 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.35 }}
              >
                <div className="pillar-symbol" aria-hidden="true">
                  {selectedPillar.key === "homes" ? <HouseLine size={84} weight="thin" /> : selectedPillar.key === "carbon" ? <Recycle size={84} weight="thin" /> : <Cpu size={84} weight="thin" />}
                </div>
                <p>{selectedPillar.action}</p>
                <h3>{selectedPillar.title}</h3>
                <span>{selectedPillar.english}</span>
                <p className="pillar-description">{selectedPillar.description}</p>
              </motion.article>
            </AnimatePresence>
          </div>
          <a className="section-source-link" href={`${sourceDocuments.sustainability}#page=23`} target="_blank" rel="noreferrer">
            {c.pillarSource}<span>{c.ui.source}</span><ArrowSquareOut size={16} aria-hidden="true" />
          </a>
        </section>

        <motion.section className="journey-section" id="direction" {...reveal}>
          <div className="journey-lead">
            <h2>{c.journey.title}</h2>
            <p>{c.journey.body}</p>
          </div>
          <div className="journey-track" ref={journeyRailRef}>
            {c.journey.items.map(([title, description], index) => (
              <article key={title} style={{ "--item-index": index } as React.CSSProperties}>
                <span aria-hidden="true">{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <RailCue
            activeIndex={journeyActiveIndex}
            count={c.journey.items.length}
            label={c.ui.swipe}
            previousLabel={c.ui.previous}
            nextLabel={c.ui.next}
            onSelect={selectJourneyIndex}
          />
        </motion.section>

        <motion.section className="governance-section" {...reveal}>
          <div className="governance-copy">
            <ShieldCheck size={48} weight="thin" aria-hidden="true" />
            <h2>{c.governance.title}</h2>
            <p>{c.governance.body}</p>
            <a className="section-source-link governance-source" href={`${sourceDocuments.sustainability}#page=12`} target="_blank" rel="noreferrer">
              <span>{c.ui.source}</span><ArrowSquareOut size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="governance-points">
            {c.governance.items.map(([title, description]) => (
              <article key={title}>
                <CheckCircle size={24} weight="regular" aria-hidden="true" />
                <div><h3>{title}</h3><p>{description}</p></div>
              </article>
            ))}
          </div>
        </motion.section>
      </main>

      <aside className="page-progress" aria-label={c.ui.journeyProgress}>
        <span className="page-progress-label">{sectionLinks.find(([id]) => id === activeSection)?.[1]}</span>
        <div className="page-progress-track">
          <span className="page-progress-fill" aria-hidden="true" />
          <nav aria-label={c.ui.journeyProgress}>
            {sectionLinks.map(([id, label]) => (
              <a key={id} href={`#${id}`} className={activeSection === id ? "is-active" : ""} aria-label={label} aria-current={activeSection === id ? "location" : undefined}>
                <span aria-hidden="true" />
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <footer className="site-footer">
        <div className="footer-brand">
          <img src={publicPath("/brand/hkhs-vertical.png")} alt="Hong Kong Housing Society 香港房屋協會" width="1658" height="1260" data-brand-status="provisional" />
        </div>
        <div className="footer-statement">
          <p>{c.footer.statement}</p>
          <span>{c.brand.full}</span>
          <strong>{c.brand.division}</strong>
        </div>
        <div className="footer-meta">
          <p>© {new Date().getFullYear()} {c.footer.copyright}</p>
          <p>{c.footer.note}</p>
        </div>
      </footer>

      <nav className="bottom-nav" aria-label="Mobile primary navigation">
        <a href="#stories"><Buildings size={21} aria-hidden="true" /><span>{c.nav.stories}</span></a>
        <a href="#progress"><ChartLineUp size={21} aria-hidden="true" /><span>{c.nav.progress}</span></a>
        <a href="#videos"><Play size={21} aria-hidden="true" /><span>{c.nav.videos}</span></a>
        <a href="#pillars"><Leaf size={21} aria-hidden="true" /><span>{c.nav.pillars}</span></a>
        <a href="#direction"><HouseLine size={21} aria-hidden="true" /><span>{c.nav.direction}</span></a>
      </nav>

      <dialog
        ref={dialogRef}
        className={`story-dialog ${selectedStory ? `story-${selectedStory.slug}` : ""}`}
        onCancel={() => setSelectedStory(null)}
        onClose={() => setSelectedStory(null)}
      >
        {selectedStory && (
          <>
            <button className="dialog-close" type="button" onClick={() => setSelectedStory(null)} aria-label={c.nav.close}>
              <X size={23} aria-hidden="true" />
            </button>
            <div className="dialog-inner" ref={dialogInnerRef}>
            <div className="dialog-media"><StoryVisual media={selectedStory.media} /></div>
            <div className="dialog-copy">
              <div className="story-meta"><p className="story-place">{selectedStory.place}</p><span>{c.ui.property}</span></div>
              <h2>{selectedStory.title}</h2>
              <h3>{c.storySection.detailTitle}</h3>
              <p>{selectedStory.detail}</p>
              <h3>{c.storySection.impactTitle}</h3>
              <p>{selectedStory.impact}</p>
              {selectedStory.sourceKey && selectedStory.sourcePage && (
                <a className="dialog-source" href={`${sourceDocuments[selectedStory.sourceKey]}#page=${selectedStory.sourcePage}`} target="_blank" rel="noreferrer">
                  <span>{c.ui.source}</span>
                  <small>{selectedStory.sourceKey === "annual" ? c.ui.annualReport : c.ui.sustainabilityReport}<br />{c.ui.reportPage}{selectedStory.sourcePage}{c.ui.pageSuffix}</small>
                  <ArrowSquareOut size={17} aria-hidden="true" />
                </a>
              )}
              <div className="dialog-story-nav">
                <button type="button" onClick={() => selectStoryByOffset(-1)}><CaretLeft size={18} aria-hidden="true" />{c.ui.previousStory}</button>
                <button type="button" onClick={() => selectStoryByOffset(1)}>{c.ui.nextStory}<CaretRight size={18} aria-hidden="true" /></button>
              </div>
            </div>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}

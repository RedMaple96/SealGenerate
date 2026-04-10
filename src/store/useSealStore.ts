import { create } from 'zustand'

export type SealType = 'public' | 'contract' | 'finance' | 'invoice'
export type ShapeType = 'circle' | 'ellipse'

export interface SealConfig {
  type: SealType
  shape: ShapeType
  width: number
  height: number
  borderWidth: number
  color: string

  // 主文字
  mainText: string
  mainTextSize: number
  mainTextMargin: number
  mainTextAngle: number

  // 徽标/五角星
  hasStar: boolean
  starSize: number
  starOffsetY: number

  // 副文字 (如“合同专用章”)
  subText: string
  subTextSize: number
  subTextOffsetY: number

  // 底部编码
  codeText: string
  codeTextSize: number
  codeTextMargin: number
}

interface SealState {
  config: SealConfig
  updateConfig: (updates: Partial<SealConfig>) => void
  applyTemplate: (type: SealType) => void
}

const defaultTemplates: Record<SealType, SealConfig> = {
  public: {
    type: 'public',
    shape: 'circle',
    width: 42,
    height: 42,
    borderWidth: 1.2,
    color: '#e60000',
    mainText: '北京市测试科技有限公司',
    mainTextSize: 6.5,
    mainTextMargin: 1,
    mainTextAngle: 270,
    hasStar: true,
    starSize: 14,
    starOffsetY: 1.5,
    subText: '',
    subTextSize: 6.5,
    subTextOffsetY: 6,
    codeText: '1101010000001',
    codeTextSize: 1.2,
    codeTextMargin: 1,
  },
  contract: {
    type: 'contract',
    shape: 'circle',
    width: 40,
    height: 40,
    borderWidth: 1.1,
    color: '#e60000',
    mainText: '北京市测试科技有限公司',
    mainTextSize: 6.5,
    mainTextMargin: 1,
    mainTextAngle: 210,
    hasStar: true,
    starSize: 13,
    starOffsetY: 1.5,
    subText: '合同专用章',
    subTextSize: 6.5,
    subTextOffsetY: 7,
    codeText: '1101010000002',
    codeTextSize: 1.2,
    codeTextMargin: 1,
  },
  finance: {
    type: 'finance',
    shape: 'circle',
    width: 30,
    height: 30,
    borderWidth: 0.8,
    color: '#e60000',
    mainText: '北京市测试科技有限公司',
    mainTextSize: 4.5,
    mainTextMargin: 0.6,
    mainTextAngle: 210,
    hasStar: true,
    starSize: 9,
    starOffsetY: 1,
    subText: '财务专用章',
    subTextSize: 4.5,
    subTextOffsetY: 5,
    codeText: '1101010000003',
    codeTextSize: 1.2,
    codeTextMargin: 1,
  },
  invoice: {
    type: 'invoice',
    shape: 'ellipse',
    width: 40,
    height: 30,
    borderWidth: 1,
    color: '#e60000',
    mainText: '北京市测试科技有限公司',
    mainTextSize: 4.2,
    mainTextMargin: 0.5,
    mainTextAngle: 210,
    hasStar: false,
    starSize: 0,
    starOffsetY: 0,
    subText: '发票专用章',
    subTextSize: 4.6,
    subTextOffsetY: 4.2,
    codeText: '91110101XXXXXXXXXX',
    codeTextSize: 3.7,
    codeTextMargin: 1,
  }
}

export const useSealStore = create<SealState>((set) => ({
  config: { ...defaultTemplates.public },
  updateConfig: (updates) =>
    set((state) => ({ config: { ...state.config, ...updates } })),
  applyTemplate: (type) =>
    set(() => ({ config: { ...defaultTemplates[type] } })),
}))

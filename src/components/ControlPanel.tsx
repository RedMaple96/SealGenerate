import React from 'react'
import { useSealStore, SealType, ShapeType } from '../store/useSealStore'

export default function ControlPanel() {
  const { config, updateConfig, applyTemplate } = useSealStore()

  // 避免不必要的对象复制
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const isNumber = type === 'number' || type === 'range'
    const isCheckbox = type === 'checkbox'
    const finalValue = isCheckbox 
      ? (e.target as HTMLInputElement).checked 
      : isNumber ? Number(value) : value

    updateConfig({ [name]: finalValue })
  }

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    applyTemplate(e.target.value as SealType)
  }

  return (
    <div className="w-full md:w-96 bg-white p-6 shadow-sm border border-slate-100 overflow-y-auto max-h-[calc(100vh-2rem)] rounded-xl flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">印章配置</h2>
        <label className="block text-sm font-medium text-slate-700 mb-1">印章模板</label>
        <select 
          className="w-full border border-slate-300 rounded-md p-2 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
          value={config.type} 
          onChange={handleTemplateChange}
        >
          <option value="public">公章 (圆形)</option>
          <option value="contract">合同章 (圆形)</option>
          <option value="finance">财务专用章 (圆形)</option>
          <option value="invoice">发票专用章 (椭圆)</option>
        </select>
      </div>

      <div className="space-y-4 border-t pt-4">
        <h3 className="font-semibold text-slate-800">基础内容</h3>
        
        <div>
          <label className="block text-sm text-slate-600 mb-1">主文字 (如公司名称)</label>
          <input 
            type="text" name="mainText" value={config.mainText} onChange={handleChange}
            className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">副文字 (如"合同专用章")</label>
          <input 
            type="text" name="subText" value={config.subText} onChange={handleChange}
            className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">底部编码</label>
          <input 
            type="text" name="codeText" value={config.codeText} onChange={handleChange}
            className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="space-y-4 border-t pt-4">
        <h3 className="font-semibold text-slate-800">尺寸排版 (mm)</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">宽度: {config.width}</label>
            <input type="range" name="width" min="20" max="60" step="1" value={config.width} onChange={handleChange} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">高度: {config.height}</label>
            <input type="range" name="height" min="20" max="60" step="1" value={config.height} onChange={handleChange} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">主字大小: {config.mainTextSize}</label>
            <input type="range" name="mainTextSize" min="2" max="12" step="0.1" value={config.mainTextSize} onChange={handleChange} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">主字环排角: {config.mainTextAngle}°</label>
            <input type="range" name="mainTextAngle" min="150" max="360" step="5" value={config.mainTextAngle} onChange={handleChange} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">副字大小: {config.subTextSize}</label>
            <input type="range" name="subTextSize" min="2" max="12" step="0.1" value={config.subTextSize} onChange={handleChange} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">副字偏移: {config.subTextOffsetY}</label>
            <input type="range" name="subTextOffsetY" min="-20" max="20" step="0.5" value={config.subTextOffsetY} onChange={handleChange} className="w-full" />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <input type="checkbox" name="hasStar" id="hasStar" checked={config.hasStar} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
          <label htmlFor="hasStar" className="text-sm text-slate-700">显示五角星/徽标</label>
        </div>

        {config.hasStar && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">星星大小: {config.starSize}</label>
              <input type="range" name="starSize" min="5" max="30" step="0.5" value={config.starSize} onChange={handleChange} className="w-full" />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">星星Y偏移: {config.starOffsetY}</label>
              <input type="range" name="starOffsetY" min="-20" max="20" step="0.5" value={config.starOffsetY} onChange={handleChange} className="w-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

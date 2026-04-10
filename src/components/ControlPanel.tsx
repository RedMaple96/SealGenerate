import React, { useState } from 'react'
import { useSealStore, SealType } from '../store/useSealStore'
import { Settings2, ChevronDown, ChevronUp } from 'lucide-react'

export default function ControlPanel() {
  const { config, updateConfig, applyTemplate } = useSealStore()
  const [showAdvanced, setShowAdvanced] = useState(false)

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
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-blue-600" />
          印章配置
        </h2>
        <label className="block text-sm font-medium text-slate-700 mb-1">选择标准印章模板</label>
        <select 
          className="w-full border border-slate-300 rounded-md p-2 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
          value={config.type} 
          onChange={handleTemplateChange}
        >
          <optgroup label="国家行政机关、企事业单位公章">
            <option value="public_45">标准公章 (45mm)</option>
            <option value="public_42">标准公章 (42mm)</option>
            <option value="public_40">标准公章 (40mm)</option>
          </optgroup>
          <optgroup label="专用章">
            <option value="contract_42">合同专用章 (42mm)</option>
            <option value="contract_40">合同专用章 (40mm)</option>
            <option value="finance_30">财务专用章 (30mm)</option>
            <option value="invoice">发票专用章 (40x30mm椭圆)</option>
          </optgroup>
        </select>
        <p className="text-xs text-slate-500 mt-2">提示：切换模板将自动应用《规范》要求的默认尺寸与排版。</p>
      </div>

      <div className="space-y-4 border-t pt-4">
        <h3 className="font-semibold text-slate-800">印章文字内容</h3>
        
        <div>
          <label className="block text-sm text-slate-600 mb-1">主文字 (机构名称)</label>
          <input 
            type="text" name="mainText" value={config.mainText} onChange={handleChange}
            className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="请输入机构名称"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">副文字 (专用章名称，可空)</label>
          <input 
            type="text" name="subText" value={config.subText} onChange={handleChange}
            className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="如：合同专用章"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">防伪编码 (统一社会信用代码/顺序号)</label>
          <input 
            type="text" name="codeText" value={config.codeText} onChange={handleChange}
            className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="13位顺序号或18位信用代码"
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-slate-700 font-semibold hover:text-blue-600 transition-colors"
        >
          <span>高级设置 (手动微调)</span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvanced && (
          <div className="space-y-4 mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">宽度: {config.width}mm</label>
                <input type="range" name="width" min="20" max="60" step="1" value={config.width} onChange={handleChange} className="w-full accent-blue-600" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">高度: {config.height}mm</label>
                <input type="range" name="height" min="20" max="60" step="1" value={config.height} onChange={handleChange} className="w-full accent-blue-600" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">边框粗细: {config.borderWidth}mm</label>
                <input type="range" name="borderWidth" min="0.5" max="3" step="0.1" value={config.borderWidth} onChange={handleChange} className="w-full accent-blue-600" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">主字环排角: {config.mainTextAngle}°</label>
                <input type="range" name="mainTextAngle" min="150" max="360" step="5" value={config.mainTextAngle} onChange={handleChange} className="w-full accent-blue-600" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">主字大小: {config.mainTextSize}</label>
                <input type="range" name="mainTextSize" min="2" max="12" step="0.1" value={config.mainTextSize} onChange={handleChange} className="w-full accent-blue-600" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">副字大小: {config.subTextSize}</label>
                <input type="range" name="subTextSize" min="2" max="12" step="0.1" value={config.subTextSize} onChange={handleChange} className="w-full accent-blue-600" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">副字垂直偏移: {config.subTextOffsetY}</label>
                <input type="range" name="subTextOffsetY" min="-20" max="20" step="0.5" value={config.subTextOffsetY} onChange={handleChange} className="w-full accent-blue-600" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">编码文字大小: {config.codeTextSize}</label>
                <input type="range" name="codeTextSize" min="1" max="6" step="0.1" value={config.codeTextSize} onChange={handleChange} className="w-full accent-blue-600" />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
              <input type="checkbox" name="hasStar" id="hasStar" checked={config.hasStar} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
              <label htmlFor="hasStar" className="text-sm font-medium text-slate-700">显示五角星徽标</label>
            </div>

            {config.hasStar && (
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg mt-2">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">星星大小: {config.starSize}mm</label>
                  <input type="range" name="starSize" min="5" max="30" step="0.5" value={config.starSize} onChange={handleChange} className="w-full accent-blue-600" />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">星星垂直偏移: {config.starOffsetY}</label>
                  <input type="range" name="starOffsetY" min="-20" max="20" step="0.5" value={config.starOffsetY} onChange={handleChange} className="w-full accent-blue-600" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

import ControlPanel from './components/ControlPanel'
import SealCanvas from './components/SealCanvas'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            电子印章生成工具
          </h1>
          <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
            纯前端实现，严格参考《印章制作技术规范》，支持透明背景、PNG 导出与实时参数微调。
          </p>
        </header>

        <main className="flex flex-col md:flex-row gap-8 items-start">
          {/* 左侧控制面板 */}
          <ControlPanel />
          
          {/* 右侧预览区 */}
          <SealCanvas />
        </main>
      </div>
    </div>
  )
}

export default App

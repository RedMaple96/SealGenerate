import { useEffect, useRef, useCallback } from 'react'
import { useSealStore, SealConfig } from '../store/useSealStore'

const SCALE = 10 // 1mm = 10px 用于高清渲染

export default function SealCanvas() {
  const { config } = useSealStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  /**
   * 绘制五角星
   * @param ctx CanvasRenderingContext2D
   * @param x 中心点x
   * @param y 中心点y
   * @param radius 外接圆半径
   */
  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    // 提前返回，避免多层嵌套
    if (radius <= 0) return

    ctx.save()
    ctx.translate(x, y)
    ctx.beginPath()
    const innerRadius = radius * Math.sin(Math.PI / 10) / Math.sin(7 * Math.PI / 10)
    for (let i = 0; i < 5; i++) {
      const outerAngle = -Math.PI / 2 + i * (2 * Math.PI / 5)
      const innerAngle = outerAngle + Math.PI / 5
      ctx.lineTo(Math.cos(outerAngle) * radius, Math.sin(outerAngle) * radius)
      ctx.lineTo(Math.cos(innerAngle) * innerRadius, Math.sin(innerAngle) * innerRadius)
    }
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  /**
   * 绘制环排文字
   */
  const drawCircularText = (
    ctx: CanvasRenderingContext2D, 
    text: string, 
    cx: number, 
    cy: number, 
    radiusX: number, 
    radiusY: number, 
    totalAngleDeg: number,
    fontSize: number
  ) => {
    if (!text) return

    ctx.save()
    ctx.font = `bold ${fontSize}px SimSun, "Songti SC", serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    
    const totalAngle = (totalAngleDeg * Math.PI) / 180
    const startAngle = -Math.PI / 2 - totalAngle / 2
    const angleStep = totalAngle / (text.length > 1 ? text.length - 1 : 1)

    for (let i = 0; i < text.length; i++) {
      const currentAngle = startAngle + i * angleStep
      const x = cx + radiusX * Math.cos(currentAngle)
      const y = cy + radiusY * Math.sin(currentAngle)
      
      ctx.save()
      ctx.translate(x, y)
      // 文字方向需要垂直于椭圆的切线，这里做近似处理：直接旋转当前角度 + PI/2
      ctx.rotate(currentAngle + Math.PI / 2)
      // 垂直缩放文字，适配椭圆效果
      if (radiusX !== radiusY) {
         ctx.scale(1, radiusY / radiusX)
      }
      ctx.fillText(text[i], 0, 0)
      ctx.restore()
    }
    ctx.restore()
  }

  /**
   * 绘制印章核心逻辑
   */
  const drawSeal = useCallback((ctx: CanvasRenderingContext2D, cfg: SealConfig) => {
    // 提前返回，避免无效绘制
    if (!ctx) return

    const width = cfg.width * SCALE
    const height = cfg.height * SCALE
    const cx = width / 2
    const cy = height / 2

    // 1. 清空画布
    ctx.clearRect(0, 0, width, height)

    // 2. 基础设置
    ctx.strokeStyle = cfg.color
    ctx.fillStyle = cfg.color
    ctx.lineWidth = cfg.borderWidth * SCALE

    // 3. 绘制外边框 (椭圆或圆)
    ctx.save()
    ctx.beginPath()
    ctx.ellipse(cx, cy, Math.max(0, width / 2 - ctx.lineWidth / 2), Math.max(0, height / 2 - ctx.lineWidth / 2), 0, 0, 2 * Math.PI)
    ctx.stroke()
    // 发票专用章有内边框
    if (cfg.type === 'invoice') {
      ctx.lineWidth = 0.5 * SCALE
      ctx.beginPath()
      ctx.ellipse(cx, cy, Math.max(0, width / 2 - 1.5 * SCALE), Math.max(0, height / 2 - 1.5 * SCALE), 0, 0, 2 * Math.PI)
      ctx.stroke()
    }
    ctx.restore()

    // 4. 绘制五角星
    if (cfg.hasStar) {
      drawStar(ctx, cx, cy - cfg.starOffsetY * SCALE, (cfg.starSize / 2) * SCALE)
    }

    // 5. 绘制上方主文字
    if (cfg.mainText) {
      const textRadiusX = width / 2 - cfg.mainTextMargin * SCALE - cfg.mainTextSize * SCALE
      const textRadiusY = height / 2 - cfg.mainTextMargin * SCALE - cfg.mainTextSize * SCALE
      drawCircularText(ctx, cfg.mainText, cx, cy, Math.max(0, textRadiusX), Math.max(0, textRadiusY), cfg.mainTextAngle, cfg.mainTextSize * SCALE)
    }

    // 6. 绘制副文字 (如合同专用章)
    if (cfg.subText) {
      ctx.save()
      // 发票专用章使用仿宋，其他使用宋体
      const fontFamily = cfg.type === 'invoice' ? '"FangSong", "FangSong_GB2312", serif' : 'SimSun, "Songti SC", serif'
      ctx.font = `bold ${cfg.subTextSize * SCALE}px ${fontFamily}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // 处理发票专用章的文字宽度拉伸
      if (cfg.type === 'invoice') {
        ctx.translate(cx, cy + cfg.subTextOffsetY * SCALE)
        ctx.scale(0.8, 1) // 近似模拟字宽压缩
        ctx.fillText(cfg.subText, 0, 0)
      } else {
        ctx.fillText(cfg.subText, cx, cy + cfg.subTextOffsetY * SCALE)
      }
      ctx.restore()
    }

    // 7. 绘制底部编码
    if (cfg.codeText) {
      ctx.save()
      ctx.font = `bold ${cfg.codeTextSize * SCALE}px Arial`
      ctx.textAlign = 'center'
      
      if (cfg.type === 'invoice') {
        // 发票专用章：横排居中在上方
        ctx.textBaseline = 'middle'
        // 根据规范，税号宽约26mm，字高3.7mm
        ctx.translate(cx, cy - 3 * SCALE) // 稍微靠上
        ctx.scale(0.7, 1)
        ctx.fillText(cfg.codeText, 0, 0)
      } else {
        // 普通公章：底部环排
        ctx.textBaseline = 'bottom'
        const codeRadiusX = width / 2 - cfg.codeTextMargin * SCALE
        const codeRadiusY = height / 2 - cfg.codeTextMargin * SCALE
        
        const text = cfg.codeText
        const totalAngle = (100 * Math.PI) / 180 // 默认约100度
        const startAngle = Math.PI / 2 - totalAngle / 2
        const angleStep = totalAngle / (text.length > 1 ? text.length - 1 : 1)

        for (let i = 0; i < text.length; i++) {
          const currentAngle = startAngle + i * angleStep
          const x = cx + codeRadiusX * Math.cos(currentAngle)
          const y = cy + codeRadiusY * Math.sin(currentAngle)
          
          ctx.save()
          ctx.translate(x, y)
          // 文字方向朝向圆心
          ctx.rotate(currentAngle - Math.PI / 2)
          // 统一调整底部防伪码纵向压缩比，根据规范使数字略瘦
          ctx.scale(0.8, 1)
          ctx.fillText(text[i], 0, 0)
          ctx.restore()
        }
      }
      ctx.restore()
    }
  }, [])

  // 使用并发控制机制(这里通过 useEffect + requestAnimationFrame 模拟简单的渲染控制)
  useEffect(() => {
    let animationFrameId: number
    
    const render = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      // 修复高DPI模糊问题 (根据设备像素比调整)
      const dpr = window.devicePixelRatio || 1
      const width = config.width * SCALE
      const height = config.height * SCALE
      
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
      
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      drawSeal(ctx, config)
    }

    animationFrameId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animationFrameId)
  }, [config, drawSeal])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `seal_${Date.now()}.png`
    a.click()
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-slate-100 p-8 min-h-[500px]">
      {/* 棋盘格背景表示透明 */}
      <div 
        className="relative bg-transparent rounded shadow-inner mb-8"
        style={{
          backgroundImage: 'conic-gradient(#f1f5f9 25%, white 25%, white 50%, #f1f5f9 50%, #f1f5f9 75%, white 75%, white)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px'
        }}
      >
        <canvas 
          ref={canvasRef}
          className="block mx-auto max-w-full h-auto object-contain transition-transform duration-200"
        />
      </div>

      <button 
        onClick={handleDownload}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
        下载透明PNG印章
      </button>
      <p className="mt-4 text-sm text-slate-500 text-center max-w-md">
        注：仅供排版和技术测试使用，生成的印章图案请勿用于非法用途。
      </p>
    </div>
  )
}

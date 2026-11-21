/// <reference types="node" />
/**
 * test-chart-lifecycle.ts
 *
 * Kiểm thử vòng đời Chart.js và cơ chế chống xung đột Canvas:
 * 1. Khởi tạo biểu đồ trên canvas
 * 2. Remount trên cùng 1 canvas: giải phóng instance cũ, không ném lỗi "Canvas is already in use"
 * 3. Cập nhật dữ liệu: giữ nguyên instance, không tạo mới
 * 4. Hủy (unmount): giải phóng triệt để, không rò rỉ instance
 * 5. Lặp lại chu kỳ 25 lần liên tiếp (mô phỏng chuyển route và React StrictMode)
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import test from 'node:test'
// @ts-ignore
import assert from 'node:assert/strict'
import { Chart } from 'chart.js'
import 'chart.js/auto'

// Tạo mock Canvas tối giản cho môi trường Node.js
function taoMockCanvas(id = 'mock-canvas-1'): HTMLCanvasElement {
  let ctxProxy: unknown = null

  const canvas: Record<string, unknown> & HTMLCanvasElement = {
    id,
    nodeName: 'CANVAS',
    _ctx: null,
    $chartjs: null,
    getContext: () => ctxProxy,
    style: {} as CSSStyleDeclaration,
    getAttribute: () => null,
    setAttribute: () => {},
    removeAttribute: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    ownerDocument: {
      defaultView: {
        getComputedStyle: () => ({
          getPropertyValue: () => '',
        }),
      },
    } as unknown as Document,
    getBoundingClientRect: () => ({
      left: 0,
      top: 0,
      width: 400,
      height: 300,
      right: 400,
      bottom: 300,
      x: 0,
      y: 0,
      toJSON: () => {},
    }),
    width: 400,
    height: 300,
  } as unknown as Record<string, unknown> & HTMLCanvasElement

  const ctxMock: Record<string, unknown> = {
    canvas,
    measureText: () => ({ width: 50, actualBoundingBoxAscent: 10, actualBoundingBoxDescent: 10 }),
  }

  ctxProxy = new Proxy(ctxMock, {
    get(target, prop) {
      if (prop === 'canvas') return canvas
      if (prop in target) return target[prop as string]
      return () => {}
    },
  })

  return canvas
}

test('1. Khởi tạo Chart instance trên Canvas lần đầu', () => {
  const canvas = taoMockCanvas('canvas-1')

  // Đảm bảo ban đầu canvas chưa có chart
  assert.equal(Chart.getChart(canvas), undefined)

  const chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['T1', 'T2'],
      datasets: [{ data: [100, 200] }],
    },
    options: { responsive: false },
  })

  assert.ok(chart)
  assert.equal(Chart.getChart(canvas), chart)

  // Cleanup
  chart.destroy()
  assert.equal(Chart.getChart(canvas), undefined)
})

test('2. Tái tạo an toàn trên cùng 1 Canvas: Tự động destroy instance cũ trước khi new Chart', () => {
  const canvas = taoMockCanvas('canvas-2')

  // Tạo instance 1
  const chart1 = new Chart(canvas, {
    type: 'bar',
    data: { labels: ['A'], datasets: [{ data: [10] }] },
    options: { responsive: false },
  })
  const id1 = chart1.id

  // Mô phỏng logic ChartCanvas: Kiểm tra và giải phóng chart cũ trước khi tạo mới
  const existingChart = Chart.getChart(canvas)
  assert.ok(existingChart, 'Phải tìm thấy chart cũ trên canvas')
  existingChart?.destroy()

  // Tạo instance 2 trên chính canvas đó mà KHÔNG bị lỗi "Canvas is already in use"
  let chart2: Chart | null = null
  assert.doesNotThrow(() => {
    chart2 = new Chart(canvas, {
      type: 'bar',
      data: { labels: ['B'], datasets: [{ data: [20] }] },
      options: { responsive: false },
    })
  })

  assert.ok(chart2)
  assert.notEqual((chart2 as unknown as Chart).id, id1)
  assert.equal(Chart.getChart(canvas), chart2)

  // Cleanup
  if (chart2) {
    (chart2 as Chart).destroy()
  }
  assert.equal(Chart.getChart(canvas), undefined)
})

test('3. Cập nhật biểu đồ mà KHÔNG tạo mới instance', () => {
  const canvas = taoMockCanvas('canvas-3')

  const chart = new Chart(canvas, {
    type: 'doughnut',
    data: { labels: ['Ăn uống'], datasets: [{ data: [500] }] },
    options: { responsive: false },
  })

  const initialId = chart.id

  // Cập nhật dữ liệu
  chart.data = {
    labels: ['Ăn uống', 'Mua sắm'],
    datasets: [{ data: [500, 300] }],
  }
  chart.update()

  // ID instance phải giữ nguyên, không được sinh instance mới
  assert.equal(chart.id, initialId)
  assert.equal(Chart.getChart(canvas), chart)
  assert.equal(chart.data.labels?.length, 2)

  // Cleanup
  chart.destroy()
  assert.equal(Chart.getChart(canvas), undefined)
})

test('4. Chuyển đổi qua lại liên tục 25 lần (mô phỏng chuyển trang và React StrictMode)', () => {
  const canvas = taoMockCanvas('canvas-loop')

  for (let i = 0; i < 25; i++) {
    // 1. Giải phóng instance cũ nếu có
    const existing = Chart.getChart(canvas)
    if (existing) {
      existing.destroy()
    }

    // 2. Tạo instance mới
    const c = new Chart(canvas, {
      type: i % 2 === 0 ? 'bar' : 'doughnut',
      data: { labels: [`Lần ${i}`], datasets: [{ data: [i * 10] }] },
      options: { responsive: false },
    })

    assert.ok(c)
    assert.equal(Chart.getChart(canvas), c)
  }

  // Cuối cùng unmount
  const lastChart = Chart.getChart(canvas)
  assert.ok(lastChart)
  lastChart?.destroy()
  assert.equal(Chart.getChart(canvas), undefined, 'Sau khi destroy, canvas phải hoàn toàn sạch')
})

test('5. Khởi tạo và cập nhật BieuDoTietKiem với logic trục Y và mốc 0 chuẩn xác', () => {
  const canvas = taoMockCanvas('canvas-tiet-kiem')

  // Giả lập options của BieuDoTietKiem
  const options = {
    responsive: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'inherit', size: 11 } },
      },
      y: {
        suggestedMax: 1000000,
        suggestedMin: -500000,
        grid: {
          color: (ctx: { tick?: { value?: number } }) =>
            ctx.tick?.value === 0 ? '#334155' : 'rgba(0,0,0,0.06)',
          lineWidth: (ctx: { tick?: { value?: number } }) =>
            ctx.tick?.value === 0 ? 2 : 1,
        },
        ticks: {
          color: (ctx: { tick?: { value?: number } }) =>
            ctx.tick?.value === 0 ? '#0f172a' : '#64748b',
          font: (ctx: { tick?: { value?: number } }) => ({
            family: 'inherit',
            size: 11,
            weight: (ctx.tick?.value === 0 ? 700 : 500) as 700 | 500,
          }),
        },
      },
    },
  }

  // Khởi tạo Chart
  const chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['T9', 'T10', 'T11'],
      datasets: [
        {
          label: 'Tiền giữ lại',
          data: [500000, -206000, 300000],
          backgroundColor: ['#0d9488', '#e11d48', '#0d9488'],
        },
      ],
    },
    options: options as unknown as import('chart.js').ChartOptions<'bar'>,
  })

  assert.ok(chart)
  assert.equal(Chart.getChart(canvas), chart)

  // Cập nhật options (gán trực tiếp chart.options = newOptions)
  const newOptions = {
    ...options,
    scales: {
      ...options.scales,
      y: {
        ...options.scales.y,
        suggestedMax: 2000000,
      },
    },
  }
  chart.options = newOptions as unknown as import('chart.js').ChartOptions<'bar'>
  chart.update()

  assert.equal(chart.options.scales?.y?.suggestedMax, 2000000)

  // Cleanup
  chart.destroy()
  assert.equal(Chart.getChart(canvas), undefined)
})

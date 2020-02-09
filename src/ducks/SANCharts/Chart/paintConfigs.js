import COLOR from '@santiment-network/ui/variables.scss'

export const dayAxesColor = COLOR.porcelain
export const nightAxesColor = COLOR['cloud-burst']

export const dayHoverLineColor = COLOR.mystic
export const nightHoverLineColor = COLOR.rhino

export const dayTicksPaintConfig = {
  color: COLOR.casper,
  font: '12px sans-serif'
}
export const nightTicksPaintConfig = {
  color: COLOR.fiord,
  font: '12px sans-serif'
}

export const dayBubblesPaintConfig = {
  font: '12px sans-serif',
  bgColor: COLOR.porcelain,
  textColor: COLOR.waterloo
}
export const nightBubblesPaintConfig = {
  font: '12px sans-serif',
  bgColor: COLOR['cloud-burst'],
  textColor: COLOR['bali-hai']
}

export const dayTooltipPaintConfig = {
  font: '12px sans-serif',
  headerFill: COLOR.porcelain,
  borderColor: COLOR.mystic,
  contentFill: '#fff',
  headerColor: COLOR.waterloo,
  valueColor: COLOR.waterloo,
  labelColor: COLOR.mirage
}
export const nightTooltipPaintConfig = {
  font: '12px sans-serif',
  headerFill: COLOR['cloud-burst'],
  borderColor: COLOR.rhino,
  contentFill: COLOR.mirage,
  headerColor: COLOR['bali-hai'],
  valueColor: COLOR['bali-hai'],
  labelColor: '#fff'
}

export const dayBrushPaintConfig = {
  bgColor: COLOR.porcelain,
  fadeColor: COLOR.mystic,
  handleColor: COLOR.waterloo
}
export const nightBrushPaintConfig = {
  bgColor: COLOR['cloud-burst'],
  fadeColor: COLOR.rhino,
  handleColor: COLOR['bali-hai']
}

export const paintConfigs = [
  {
    axesColor: dayAxesColor,
    hoverLineColor: dayHoverLineColor,
    ticksPaintConfig: dayTicksPaintConfig,
    bubblesPaintConfig: dayBubblesPaintConfig,
    tooltipPaintConfig: dayTooltipPaintConfig,
    brushPaintConfig: dayBrushPaintConfig
  },
  {
    axesColor: nightAxesColor,
    hoverLineColor: nightHoverLineColor,
    ticksPaintConfig: nightTicksPaintConfig,
    bubblesPaintConfig: nightBubblesPaintConfig,
    tooltipPaintConfig: nightTooltipPaintConfig,
    brushPaintConfig: nightBrushPaintConfig
  }
]
